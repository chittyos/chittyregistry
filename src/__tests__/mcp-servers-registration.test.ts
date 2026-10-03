/**
 * POST /v0.1/servers input validation.
 *
 * These tests drive the real worker's fetch() handler (src/universal-registry-worker.js)
 * against an in-memory implementation of the Cloudflare KVNamespace contract. Nothing in
 * the worker is stubbed: no jest.fn() stands in for a handler, a helper, or the store —
 * the KV below is a real implementation of put/get/list, and every assertion is made on
 * what the handler actually wrote or served.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const worker = require('../universal-registry-worker.js').default;

const ADMIN_TOKEN = 'mcp-registry-admin-token-for-tests';

/** In-memory KVNamespace: put/get/list({ prefix }) with lexicographically sorted keys. */
class MemoryKV {
  private store = new Map<string, string>();

  async put(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.store.has(key) ? (this.store.get(key) as string) : null;
  }

  async list({ prefix = '' }: { prefix?: string } = {}) {
    const keys = [...this.store.keys()]
      .filter((k) => k.startsWith(prefix))
      .sort()
      .map((name) => ({ name }));
    return { keys, list_complete: true };
  }

  rawKeys(): string[] {
    return [...this.store.keys()];
  }
}

const makeEnv = () => {
  const kv = new MemoryKV();
  return {
    kv,
    env: {
      REGISTRY_STORE: kv,
      MCP_REGISTRY_ADMIN_TOKEN: ADMIN_TOKEN,
      // Satisfies the worker-wide read-only guard for non-GET requests.
      CHITTY_REGISTRY_ADMIN_TOKEN: ADMIN_TOKEN,
    } as any,
  };
};

const post = (env: any, body: unknown, headers: Record<string, string> = {}) =>
  worker.fetch(
    new Request('https://registry.chitty.cc/v0.1/servers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_TOKEN}`,
        ...headers,
      },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
    env,
    {} as any,
  );

const get = (env: any, path: string) =>
  worker.fetch(new Request(`https://registry.chitty.cc${path}`), env, {} as any);

const validEntry = (overrides: Record<string, unknown> = {}) => ({
  name: 'cc.chitty/test-harness-server',
  description: 'Fixture MCP server used by the registration validation tests',
  version: '1.0.0',
  remotes: [{ transportType: 'streamable-http', url: 'https://example.invalid/mcp' }],
  ...overrides,
});

describe('POST /v0.1/servers — admin token is still required', () => {
  test('rejects a request without the registry admin token', async () => {
    const { env } = makeEnv();
    const res = await post(env, validEntry(), { Authorization: 'Bearer wrong-token' });
    expect(res.status).toBe(401);
  });
});

describe('1. name/version are type-checked on the write path', () => {
  test('a non-string name is rejected instead of writing an unreadable key', async () => {
    const { env, kv } = makeEnv();
    const res = await post(env, validEntry({ name: 12345 }));

    expect(res.status).toBe(400);
    expect(kv.rawKeys()).toHaveLength(0);

    // Without the guard the entry is persisted under `mcp-servers:12345:1.0.0` and then
    // dropped by getAllMcpServers' typeof check — invisible in every listing.
    const listed = await (await get(env, '/v0.1/servers')).json();
    expect(listed.servers.some((s: any) => String(s.server.name) === '12345')).toBe(false);
  });

  test('a non-string version is rejected', async () => {
    const { env, kv } = makeEnv();
    const res = await post(env, validEntry({ version: 2 }));
    expect(res.status).toBe(400);
    expect(kv.rawKeys()).toHaveLength(0);
  });

  test('a non-object JSON body is a 400, not a 500', async () => {
    const { env } = makeEnv();
    expect((await post(env, 'null')).status).toBe(400);
    expect((await post(env, '[]')).status).toBe(400);
  });
});

describe('2. a colon in name is rejected so the KV key stays unambiguous', () => {
  test('cross-registrant overwrite via a colon in name is blocked', async () => {
    const { env, kv } = makeEnv();

    const first = await post(env, validEntry({ name: 'a', version: 'b:1.0' }));
    expect(first.status).toBe(201);

    const second = await post(env, validEntry({ name: 'a:b', version: '1.0' }));
    expect(second.status).toBe(400);

    // Without the guard both writes land on `mcp-servers:a:b:1.0` and the second
    // silently replaces the first registrant's entry.
    expect(kv.rawKeys()).toEqual(['mcp-servers:a:b:1.0']);
    const stored = JSON.parse((await kv.get('mcp-servers:a:b:1.0')) as string);
    expect(stored.name).toBe('a');
    expect(stored.version).toBe('b:1.0');
  });
});

describe('3. the number of KV-stored registrations is bounded', () => {
  const fillTo = async (kv: MemoryKV, count: number) => {
    for (let i = 0; i < count; i += 1) {
      await kv.put(
        `mcp-servers:cc.chitty/filler-${String(i).padStart(4, '0')}:1.0.0`,
        JSON.stringify({
          name: `cc.chitty/filler-${i}`,
          description: 'pre-existing registration',
          version: '1.0.0',
        }),
      );
    }
  };

  test('a new registration past the cap is refused', async () => {
    const { env, kv } = makeEnv();
    await fillTo(kv, 100);

    const res = await post(env, validEntry());
    expect(res.status).toBe(507);
    expect((await res.json()).code).toBe('REGISTRY_FULL');
    expect(kv.rawKeys()).toHaveLength(100);
  });

  test('a registration just under the cap still succeeds', async () => {
    const { env, kv } = makeEnv();
    await fillTo(kv, 99);
    expect((await post(env, validEntry())).status).toBe(201);
    expect(kv.rawKeys()).toHaveLength(100);
  });

  test('an existing name:version can still be updated at the cap', async () => {
    const { env, kv } = makeEnv();
    await fillTo(kv, 99);
    expect((await post(env, validEntry())).status).toBe(201);
    expect(kv.rawKeys()).toHaveLength(100);
    const firstPublishedAt = JSON.parse(
      (await kv.get('mcp-servers:cc.chitty/test-harness-server:1.0.0')) as string,
    )._publishedAt;

    const update = await post(env, validEntry({ description: 'updated description' }));
    expect(update.status).toBe(201);
    expect(kv.rawKeys()).toHaveLength(100);
    const stored = JSON.parse(
      (await kv.get('mcp-servers:cc.chitty/test-harness-server:1.0.0')) as string,
    );
    expect(stored.description).toBe('updated description');
    // The caller can no longer supply _publishedAt, so an update must carry the
    // stored publication date forward rather than resetting it.
    expect(stored._publishedAt).toBe(firstPublishedAt);
  });
});

describe('4. caller-supplied underscore fields are stripped', () => {
  test('_internal does not place a caller under "Internal (ChittyOS)"', async () => {
    const { env, kv } = makeEnv();
    expect((await post(env, validEntry({ _internal: true }))).status).toBe(201);

    const stored = JSON.parse(
      (await kv.get('mcp-servers:cc.chitty/test-harness-server:1.0.0')) as string,
    );
    expect(stored._internal).toBeUndefined();

    const html = await (await get(env, '/allowed-list')).text();
    const [internalSection, externalSection] = html.split('<h2>External');
    expect(internalSection).not.toContain('cc.chitty/test-harness-server');
    expect(externalSection).toContain('cc.chitty/test-harness-server');
  });

  test('_publishedAt cannot be backdated by the caller', async () => {
    const { env } = makeEnv();
    const res = await post(env, validEntry({ _publishedAt: '1999-01-01T00:00:00Z' }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.server._meta['io.modelcontextprotocol.registry/official'].publishedAt)
      .not.toBe('1999-01-01T00:00:00Z');
  });
});

describe('5. caller attribution is recorded', () => {
  const storedEntry = (kv: MemoryKV) =>
    kv
      .get('mcp-servers:cc.chitty/test-harness-server:1.0.0')
      .then((raw) => JSON.parse(raw as string));

  test('an external admin-token caller cannot claim an internal source', async () => {
    const { env, kv } = makeEnv();
    const res = await post(env, validEntry(), {
      // Caller-controlled on this route: the outer guard admits plain Bearer callers,
      // so this header proves nothing and must not be recorded as the source.
      'X-Internal-Source': 'chittyregister-mcp-bridge',
      'CF-Connecting-IP': '203.0.113.7',
      'cf-ray': '8f0e1a2b3c4d5e6f-ORD',
    });
    expect(res.status).toBe(201);

    const stored = await storedEntry(kv);
    expect(stored._registeredBy).toMatchObject({
      auth: 'MCP_REGISTRY_ADMIN_TOKEN',
      via: 'admin-token',
      source: null,
      ip: '203.0.113.7',
      ray: '8f0e1a2b3c4d5e6f-ORD',
    });
  });

  test('the persisted entry records the guard that admitted the request', async () => {
    const { env, kv } = makeEnv();
    const res = await post(env, validEntry(), {
      // Service-binding path: no CF-Connecting-IP, so X-Internal-Source is trustworthy.
      'X-Chitty-Internal-Binding': 'chittyregister',
      'X-Internal-Source': 'chittyregister-mcp-bridge',
      'cf-ray': '8f0e1a2b3c4d5e6f-ORD',
    });
    expect(res.status).toBe(201);

    const stored = await storedEntry(kv);
    expect(stored._registeredBy).toMatchObject({
      auth: 'MCP_REGISTRY_ADMIN_TOKEN',
      via: 'service-binding',
      source: 'chittyregister-mcp-bridge',
      ip: null,
      ray: '8f0e1a2b3c4d5e6f-ORD',
    });
    expect(typeof stored._registeredBy.at).toBe('string');

    // Attribution must never leak the token, and must not surface on public GETs.
    expect(JSON.stringify(stored)).not.toContain(ADMIN_TOKEN);
    const publicEntry = await (
      await get(env, '/v0.1/servers/cc.chitty/test-harness-server/versions/latest')
    ).json();
    expect(JSON.stringify(publicEntry)).not.toContain('_registeredBy');
  });
});
