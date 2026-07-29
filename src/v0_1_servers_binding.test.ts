/**
 * Real-behavior test for the register→discovery bridge auth path.
 *
 * Exercises the actual POST /v0.1/servers handler in universal-registry-worker.js
 * end-to-end: auth gate → KV key construction → KV.put → GET /v0.1/servers →
 * formatMcpRegistryEntry round-trip. The only fixture is an in-memory KV that
 * faithfully implements Cloudflare KV's put/get/list({prefix}) semantics — the
 * handler logic under test (auth bypass, key shape, formatter) runs unmocked.
 *
 * Asserts:
 *  1. A service-binding call (X-Chitty-Internal-Binding: chittyregister, no
 *     CF-Connecting-IP) with NO admin token is accepted (the bridge path).
 *  2. The server lands in the mcp-servers: KV under name:version.
 *  3. GET /v0.1/servers returns it with the EXACT remote hostname URL preserved
 *     (the projection diff keys on host+path — verbatim survival is load-bearing).
 *  4. A non-binding call with no token is still rejected (regression guard).
 */

// The worker is an ESM module (export default). ts-jest transpiles this test to
// CommonJS but leaves the .js worker untouched, so load it via a dynamic import,
// which Node resolves as ESM at runtime. Cached across tests.
// The worker is ESM (export default); jest.config.js transforms it to CommonJS
// via ts-jest (allowJs), so a normal import resolves to the default export.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const worker = require("./universal-registry-worker.js").default;

/** Minimal but faithful in-memory CF KV (put / get / list({prefix})). */
function makeKV() {
  const store = new Map<string, string>();
  return {
    async put(key: string, value: string) {
      store.set(key, value);
    },
    async get(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    async list({ prefix }: { prefix: string }) {
      const keys = [...store.keys()]
        .filter((k) => k.startsWith(prefix))
        .map((name) => ({ name }));
      return { keys, list_complete: true };
    },
    _store: store,
  };
}

const EXACT_HOST = "https://chittymcp-test.chittyops.workers.dev/mcp";

function mcpDescriptor() {
  return {
    name: "cc.chitty/chittymcp-test",
    description: "Bridge round-trip fixture for chittymcp-test",
    version: "1.0.0",
    repository: { url: "https://github.com/CHITTYOS/chittymcp", source: "github" },
    websiteUrl: "https://chittymcp-test.chittyops.workers.dev",
    remotes: [{ type: "streamable-http", url: EXACT_HOST }],
  };
}

function bindingHeaders() {
  // Service binding: no CF-Connecting-IP, carries the internal-binding marker.
  return { "Content-Type": "application/json", "X-Chitty-Internal-Binding": "chittyregister" };
}

describe("POST /v0.1/servers — register→discovery bridge auth + round-trip", () => {
  test("service-binding call (no admin token) is accepted and lands in KV", async () => {
    const env: any = { REGISTRY_STORE: makeKV() }; // note: MCP_REGISTRY_ADMIN_TOKEN intentionally absent
    const req = new Request("https://registry.chitty.cc/v0.1/servers", {
      method: "POST",
      headers: bindingHeaders(),
      body: JSON.stringify(mcpDescriptor()),
    });

    const res = await worker.fetch(req, env, {});
    expect(res.status).toBe(201);

    const stored = await env.REGISTRY_STORE.get("mcp-servers:cc.chitty/chittymcp-test:1.0.0");
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!).remotes[0].url).toBe(EXACT_HOST);
  });

  test("GET /v0.1/servers returns the server with the EXACT remote hostname URL", async () => {
    const env: any = { REGISTRY_STORE: makeKV() };
    await worker.fetch(
      new Request("https://registry.chitty.cc/v0.1/servers", {
        method: "POST",
        headers: bindingHeaders(),
        body: JSON.stringify(mcpDescriptor()),
      }),
      env,
      {},
    );

    const res = await worker.fetch(
      new Request("https://registry.chitty.cc/v0.1/servers", { method: "GET" }),
      env,
      {},
    );
    expect(res.status).toBe(200);
    const body: any = await res.json();
    const entry = body.servers.find((s: any) => s.server.name === "cc.chitty/chittymcp-test");
    expect(entry).toBeDefined();
    // remotes survives formatMcpRegistryEntry verbatim — projection diff keys on this.
    expect(entry.server.remotes[0].url).toBe(EXACT_HOST);
  });

  test("re-registering same name:version upserts (no duplicate KV key)", async () => {
    const env: any = { REGISTRY_STORE: makeKV() };
    for (let i = 0; i < 2; i++) {
      await worker.fetch(
        new Request("https://registry.chitty.cc/v0.1/servers", {
          method: "POST",
          headers: bindingHeaders(),
          body: JSON.stringify(mcpDescriptor()),
        }),
        env,
        {},
      );
    }
    const keys = [...env.REGISTRY_STORE._store.keys()].filter((k: string) =>
      k.startsWith("mcp-servers:cc.chitty/chittymcp-test:"),
    );
    expect(keys).toHaveLength(1);
  });

  test("non-binding call with no token is still rejected (regression guard)", async () => {
    const env: any = { REGISTRY_STORE: makeKV() };
    const req = new Request("https://registry.chitty.cc/v0.1/servers", {
      method: "POST",
      // External caller: simulate CF-Connecting-IP present, no internal-binding marker.
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.7" },
      body: JSON.stringify(mcpDescriptor()),
    });
    const res = await worker.fetch(req, env, {});
    expect(res.status).toBe(401);
  });
});
