// ChittyRegistry Universal Worker - Production Deployment
// Integrates ChittyRegistry Universal System with Cloudflare Workers
// Provides REST API for the universal tool/script registry

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-ChittyID-Token",
      "Access-Control-Max-Age": "86400",
    };

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Authentication check for write operations
    const requiresAuth = request.method !== "GET";
    if (requiresAuth) {
      const authHeader =
        request.headers.get("Authorization") ||
        request.headers.get("X-ChittyID-Token");
      if (!authHeader || !authHeader.includes("chitty")) {
        return jsonResponse(
          { error: "Authentication required", code: "AUTH_REQUIRED" },
          401,
          corsHeaders,
        );
      }
    }

    try {
      // ============================================
      // HEALTH & STATUS ENDPOINTS
      // ============================================

      if (path === "/health" || path === "/") {
        const stats = await getRegistryStats(env);
        return jsonResponse(
          {
            status: "ok",
            service: "chittyregistry-universal",
            version: "2.0.0",
            timestamp: new Date().toISOString(),
            deployment: "cloudflare-workers",
            uptime: Date.now(),
            stats: stats,
          },
          200,
          corsHeaders,
        );
      }

      if (path === "/api/v1/stats") {
        const stats = await getRegistryStats(env);
        return jsonResponse({ success: true, stats }, 200, corsHeaders);
      }

      // ============================================
      // UNIVERSAL REGISTRY SEARCH & DISCOVERY
      // ============================================

      if (path === "/api/v1/search") {
        const query = url.searchParams.get("q") || "";
        const category = url.searchParams.get("category");
        const capability = url.searchParams.get("capability");
        const limit = parseInt(url.searchParams.get("limit") || "10");

        if (!query && !category && !capability) {
          return jsonResponse(
            { error: "Query, category, or capability required" },
            400,
            corsHeaders,
          );
        }

        const results = await searchRegistry(env, {
          query,
          category,
          capability,
          limit,
        });
        return jsonResponse(
          {
            success: true,
            query: { query, category, capability, limit },
            results: results,
            count: results.length,
          },
          200,
          corsHeaders,
        );
      }

      if (path === "/api/v1/recommendations") {
        const intent = url.searchParams.get("intent") || "create";
        const description = url.searchParams.get("description") || "";
        const capabilities =
          url.searchParams.get("capabilities")?.split(",") || [];

        const recommendations = await getIntelligentRecommendations(env, {
          intent,
          description,
          capabilities,
        });

        return jsonResponse(
          {
            success: true,
            context: { intent, description, capabilities },
            recommendations,
          },
          200,
          corsHeaders,
        );
      }

      if (path === "/api/v1/duplicates") {
        const duplicates = await getDuplicates(env);
        return jsonResponse(
          {
            success: true,
            duplicateGroups: Object.keys(duplicates).length,
            duplicates,
          },
          200,
          corsHeaders,
        );
      }

      if (path === "/api/v1/categories") {
        const categories = await getCategories(env);
        return jsonResponse({ success: true, categories }, 200, corsHeaders);
      }

      // ============================================
      // TOOL/SCRIPT MANAGEMENT
      // ============================================

      if (path === "/api/v1/tools" && request.method === "GET") {
        const category = url.searchParams.get("category");
        const tools = await getTools(env, category);
        return jsonResponse(
          { success: true, tools, count: tools.length },
          200,
          corsHeaders,
        );
      }

      if (path === "/api/v1/tools" && request.method === "POST") {
        const toolData = await request.json();
        const result = await registerTool(env, toolData);
        return jsonResponse({ success: true, tool: result }, 201, corsHeaders);
      }

      const toolMatch = path.match(/^\/api\/v1\/tools\/(.+)$/);
      if (toolMatch && request.method === "GET") {
        const toolId = toolMatch[1];
        const tool = await getTool(env, toolId);

        if (!tool) {
          return jsonResponse({ error: "Tool not found" }, 404, corsHeaders);
        }

        return jsonResponse({ success: true, tool }, 200, corsHeaders);
      }

      // ============================================
      // CHITTYCHAT INTEGRATION
      // ============================================

      if (path === "/api/v1/chittychat/recommendations") {
        const context = await request.json();
        const recommendations = await getChittyChatRecommendations(
          env,
          context,
        );

        return jsonResponse(
          {
            success: true,
            sessionContext: context,
            recommendations,
            metadata: {
              generatedAt: new Date().toISOString(),
              version: "2.0.0",
              totalRecommendations: Object.values(recommendations).reduce(
                (acc, arr) => acc + arr.length,
                0,
              ),
            },
          },
          200,
          corsHeaders,
        );
      }

      if (
        path === "/api/v1/chittychat/prevent-duplication" &&
        request.method === "POST"
      ) {
        const { description, capabilities } = await request.json();
        const existing = await searchRegistry(env, {
          query: description,
          capabilities,
          limit: 5,
        });

        return jsonResponse(
          {
            success: true,
            query: { description, capabilities },
            existingTools: existing,
            preventDuplication: existing.length > 0,
            message:
              existing.length > 0
                ? `Found ${existing.length} similar tools. Consider using existing solutions.`
                : "No similar tools found. Safe to proceed with implementation.",
          },
          200,
          corsHeaders,
        );
      }

      // ============================================
      // REGISTRY MAINTENANCE
      // ============================================

      if (path === "/api/v1/sync" && request.method === "POST") {
        const syncResult = await triggerRegistryScan(env);
        return jsonResponse(
          {
            success: true,
            message: "Registry scan triggered",
            syncId: syncResult.id,
            estimatedCompletion: syncResult.estimatedCompletion,
          },
          202,
          corsHeaders,
        );
      }

      if (path === "/api/v1/cleanup/duplicates" && request.method === "POST") {
        const cleanupResult = await cleanupDuplicates(env);
        return jsonResponse(
          {
            success: true,
            cleaned: cleanupResult.count,
            backupLocation: cleanupResult.backupLocation,
            report: cleanupResult.report,
          },
          200,
          corsHeaders,
        );
      }

      // ============================================
      // CLAUDE MD INTEGRATION (Legacy Support)
      // ============================================

      if (path === "/api/v1/claude/register" && request.method === "POST") {
        const claudeData = await request.json();
        const result = await registerClaudeProject(env, claudeData);
        return jsonResponse(
          { success: true, registered: result },
          200,
          corsHeaders,
        );
      }

      if (path === "/api/v1/claude/global") {
        const globalConfig = await getGlobalClaudeConfig(env);
        return jsonResponse(
          { success: true, content: globalConfig },
          200,
          corsHeaders,
        );
      }

      if (path === "/api/v1/claude/commands") {
        const commands = await getAvailableCommands(env);
        return jsonResponse({ success: true, commands }, 200, corsHeaders);
      }

      // ============================================
      // MCP REGISTRY v0.1 ENDPOINTS
      // ============================================

      // GET /v0.1/servers — list all MCP servers
      if (path === "/v0.1/servers" && request.method === "GET") {
        const defaultLimit = 30;
        const maxLimit = 100;
        const rawLimit = parseInt(url.searchParams.get("limit") || `${defaultLimit}`, 10);
        const limit = Number.isFinite(rawLimit) && rawLimit > 0
          ? Math.min(rawLimit, maxLimit)
          : defaultLimit;
        const cursor = url.searchParams.get("cursor");

        const allServers = await getAllMcpServers(env);
        const rawCursor = cursor ? parseInt(cursor, 10) : 0;
        const startIdx = Number.isFinite(rawCursor) && rawCursor >= 0
          ? Math.min(rawCursor, allServers.length)
          : 0;
        const page = allServers.slice(startIdx, startIdx + limit);
        const nextCursor = startIdx + limit < allServers.length ? String(startIdx + limit) : null;

        return jsonResponse(
          {
            servers: page.map(formatMcpRegistryEntry),
            metadata: { count: allServers.length, nextCursor },
          },
          200,
          corsHeaders,
        );
      }

      // GET /v0.1/servers/:name/versions/:version — specific or latest version
      if (path.startsWith("/v0.1/servers/") && request.method === "GET") {
        const parsed = parseMcpServerPath(path);
        if (!parsed || !parsed.name) {
          return jsonResponse({ error: "Invalid server path" }, 400, corsHeaders);
        }

        const allServers = await getAllMcpServers(env);
        const server = allServers.find((s) => s.name === parsed.name);

        if (!server) {
          return jsonResponse({ error: "Server not found", name: parsed.name }, 404, corsHeaders);
        }

        // If version specified and not "latest", check it matches
        if (parsed.version && parsed.version !== "latest" && parsed.version !== server.version) {
          return jsonResponse(
            { error: "Version not found", name: parsed.name, version: parsed.version },
            404,
            corsHeaders,
          );
        }

        return jsonResponse(formatMcpRegistryEntry(server), 200, corsHeaders);
      }

      // POST /v0.1/servers — register a new MCP server (auth required)
      if (path === "/v0.1/servers" && request.method === "POST") {
        const adminToken = env.MCP_REGISTRY_ADMIN_TOKEN;
        const authHeader = request.headers.get("Authorization") || "";
        const bearerToken = authHeader.startsWith("Bearer ")
          ? authHeader.slice(7).trim()
          : "";

        if (!adminToken || bearerToken !== adminToken) {
          return jsonResponse(
            { error: "Unauthorized registry mutation" },
            401,
            corsHeaders,
          );
        }

        let serverData;
        try {
          serverData = await request.json();
        } catch {
          return jsonResponse({ error: "Invalid JSON body" }, 400, corsHeaders);
        }

        if (!serverData.name || !serverData.description || !serverData.version) {
          return jsonResponse(
            { error: "name, description, and version are required" },
            400,
            corsHeaders,
          );
        }

        serverData._publishedAt = serverData._publishedAt || new Date().toISOString();
        serverData._updatedAt = new Date().toISOString();

        if (!env.REGISTRY_STORE || typeof env.REGISTRY_STORE.put !== "function") {
          return jsonResponse(
            { error: "Registry store unavailable. Please try again later." },
            503,
            corsHeaders,
          );
        }

        const kvKey = `mcp-servers:${serverData.name}:${serverData.version}`;
        await env.REGISTRY_STORE.put(kvKey, JSON.stringify(serverData));

        return jsonResponse(
          { success: true, server: formatMcpRegistryEntry(serverData) },
          201,
          corsHeaders,
        );
      }

      // GET /allowed-list — human-readable HTML page
      if (path === "/allowed-list" && request.method === "GET") {
        const allServers = await getAllMcpServers(env);
        const html = renderAllowedListHtml(allServers);
        return new Response(html, {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders },
        });
      }

      // ============================================
      // NOT FOUND
      // ============================================

      return jsonResponse(
        {
          error: "Endpoint not found",
          availableEndpoints: [
            "GET /health",
            "GET /api/v1/stats",
            "GET /api/v1/search",
            "GET /api/v1/recommendations",
            "GET /api/v1/duplicates",
            "GET /api/v1/categories",
            "GET /api/v1/tools",
            "POST /api/v1/chittychat/recommendations",
            "POST /api/v1/sync",
            "GET /v0.1/servers",
            "GET /v0.1/servers/:name/versions/latest",
            "GET /v0.1/servers/:name/versions/:version",
            "POST /v0.1/servers",
            "GET /allowed-list",
          ],
        },
        404,
        corsHeaders,
      );
    } catch (error) {
      console.error("ChittyRegistry Error:", error);
      return jsonResponse(
        {
          error: "Internal server error",
          message: error.message,
          timestamp: new Date().toISOString(),
        },
        500,
        corsHeaders,
      );
    }
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function jsonResponse(data, status = 200, additionalHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...additionalHeaders,
    },
  });
}

// ============================================
// REGISTRY OPERATIONS
// ============================================

async function getRegistryStats(env) {
  // Get cached stats or return defaults
  const cachedStats = await env.REGISTRY_CACHE?.get("stats");

  if (cachedStats) {
    return JSON.parse(cachedStats);
  }

  // Default stats if no cache available
  return {
    totalFiles: 3214,
    categories: {
      tools: 80,
      scripts: 774,
      services: 975,
      agents: 71,
      libraries: 272,
      documentation: 188,
      configs: 200,
    },
    duplicates: 91,
    alternatives: 323,
    directories: 769,
    lastUpdated: new Date().toISOString(),
  };
}

async function searchRegistry(
  env,
  { query, category, capability, limit = 10 },
) {
  // This would integrate with the Universal Registry system
  // For now, return mock data that represents the structure

  const mockResults = [
    {
      name: "chittycheck-enhanced.sh",
      path: ".claude/projects/-/CHITTYOS/chittyos-apps/chittycheck/chittycheck-enhanced.sh",
      type: "bash_script",
      description: "Comprehensive ChittyOS systems validation",
      capabilities: ["test", "validate", "compliance"],
      dependencies: ["bash", "git", "node"],
      score: 10,
      modified: "2025-09-25T18:00:00Z",
    },
    {
      name: "chitty-registry-universal.js",
      path: ".chittychat/context-bridge/chitty-registry-universal.js",
      type: "node_script",
      description: "Universal registry system for ChittyOS ecosystem",
      capabilities: ["registry", "search", "recommendations"],
      dependencies: ["node", "fs", "crypto"],
      score: 9,
      modified: "2025-09-25T18:55:00Z",
    },
  ];

  // Filter by query if provided
  if (query) {
    return mockResults
      .filter(
        (tool) =>
          tool.name.toLowerCase().includes(query.toLowerCase()) ||
          (tool.description &&
            tool.description.toLowerCase().includes(query.toLowerCase())),
      )
      .slice(0, limit);
  }

  return mockResults.slice(0, limit);
}

async function getIntelligentRecommendations(env, context) {
  return {
    prevent_duplication: [],
    suggest_alternatives: [],
    related_tools: [],
    upgrade_opportunities: [],
  };
}

async function getDuplicates(env) {
  return {
    fc3ce9e3: [
      {
        path: ".claude/projects/-/CHITTYAPPS/chittychronicle/chittyverify/attached_assets/artifact-minting-service_1753559587582.js",
      },
      {
        path: ".claude/projects/-/CHITTYAPPS/chittychronicle/chittyverify/attached_assets/artifact-minting-service_1753559780968.js",
      },
    ],
  };
}

async function getCategories(env) {
  return {
    tools: { count: 80, description: "Command-line tools and utilities" },
    scripts: { count: 774, description: "Automation and deployment scripts" },
    services: { count: 975, description: "Web services and APIs" },
    agents: { count: 71, description: "AI agents and MCP connectors" },
    libraries: { count: 272, description: "Reusable code libraries" },
    documentation: { count: 188, description: "Documentation and guides" },
    configs: { count: 200, description: "Configuration files and templates" },
  };
}

async function getTools(env, category) {
  // Return tools from specific category
  return [];
}

async function getTool(env, toolId) {
  // Get specific tool by ID
  return null;
}

async function registerTool(env, toolData) {
  // Register new tool in registry
  return toolData;
}

async function getChittyChatRecommendations(env, context) {
  // Get recommendations specifically for ChittyChat integration
  return await getIntelligentRecommendations(env, context);
}

async function triggerRegistryScan(env) {
  // Trigger background registry scan
  return {
    id: "scan_" + Date.now(),
    estimatedCompletion: new Date(Date.now() + 300000).toISOString(), // 5 minutes
  };
}

async function cleanupDuplicates(env) {
  return {
    count: 0,
    backupLocation: "~/.chittyos/duplicates_backup",
    report: "No duplicates found",
  };
}

async function registerClaudeProject(env, claudeData) {
  // Register Claude MD project
  return true;
}

async function getGlobalClaudeConfig(env) {
  return `# Global ChittyOS Configuration

This is the global configuration for all ChittyOS projects.

## Universal Commands
- /chittycheck - System validation
- /registry - Access ChittyRegistry
- /health - System health
`;
}

async function getAvailableCommands(env) {
  return [
    { name: "chittycheck", description: "Run system validation" },
    { name: "registry", description: "Access universal registry" },
    { name: "health", description: "Check system health" },
  ];
}

// ============================================
// MCP REGISTRY v0.1
// ============================================

function getMcpServerSeed() {
  const now = "2026-03-03T00:00:00Z";
  return [
    {
      name: "cc.chitty/chittymcp",
      description: "ChittyOS MCP Gateway — MemoryCloude, credentials, Notion, Neon, ecosystem",
      version: "2.0.0",
      websiteUrl: "https://chitty.cc",
      repository: { url: "https://github.com/CHITTYOS/chittymcp", source: "github" },
      remotes: [{ transportType: "streamable-http", url: "https://mcp.chitty.cc/mcp" }],
      _internal: true,
      _publishedAt: now,
      _updatedAt: now,
    },
    {
      name: "cc.chitty/chittyevidence-search",
      description: "ChittyEvidence AI semantic search over case documents and evidence",
      version: "1.0.0",
      websiteUrl: "https://chitty.cc",
      repository: { url: "https://github.com/CHITTYOS/chittyevidence", source: "github" },
      remotes: [{ transportType: "streamable-http", url: "https://autorag.mcp.cloudflare.com/mcp" }],
      _internal: true,
      _publishedAt: now,
      _updatedAt: now,
    },
    {
      name: "cc.chitty/chittymac",
      description: "Apple-native data MCP — Contacts, Calendar, Notes, Reminders, Mail access",
      version: "1.0.0",
      websiteUrl: "https://chitty.cc",
      repository: { url: "https://github.com/CHITTYOS/chittymac", source: "github" },
      packages: [{ registryName: "npm", name: "chittymac", version: "1.0.0" }],
      _internal: true,
      _publishedAt: now,
      _updatedAt: now,
    },
    {
      name: "cc.chitty/neon",
      description: "Neon PostgreSQL management — database operations, branching, migrations",
      version: "1.0.0",
      websiteUrl: "https://neon.tech",
      repository: { url: "https://github.com/neondatabase/mcp-server-neon", source: "github" },
      packages: [{ registryName: "npm", name: "@neondatabase/mcp-server-neon", version: "latest" }],
      _internal: true,
      _publishedAt: now,
      _updatedAt: now,
    },
    {
      name: "com.github/github-mcp-server",
      description: "GitHub integration — repos, issues, PRs, actions, code search",
      version: "1.0.0",
      websiteUrl: "https://github.com",
      repository: { url: "https://github.com/anthropics/github-mcp-server", source: "github" },
      packages: [{ registryName: "npm", name: "@anthropic-ai/github-mcp-server", version: "latest" }],
      _internal: false,
      _publishedAt: now,
      _updatedAt: now,
    },
    {
      name: "com.notion/notion-mcp-server",
      description: "Notion workspace integration — pages, databases, search, comments",
      version: "1.0.0",
      websiteUrl: "https://notion.so",
      repository: { url: "https://github.com/makenotion/notion-mcp-server", source: "github" },
      packages: [{ registryName: "npm", name: "@notionhq/notion-mcp-server", version: "latest" }],
      _internal: false,
      _publishedAt: now,
      _updatedAt: now,
    },
    {
      name: "com.stripe/stripe-agent-toolkit",
      description: "Stripe payments integration — customers, invoices, subscriptions, refunds",
      version: "1.0.0",
      websiteUrl: "https://stripe.com",
      repository: { url: "https://github.com/stripe/agent-toolkit", source: "github" },
      packages: [{ registryName: "npm", name: "@stripe/agent-toolkit", version: "latest" }],
      _internal: false,
      _publishedAt: now,
      _updatedAt: now,
    },
    {
      name: "com.cloudflare/mcp-server-cloudflare",
      description: "Cloudflare developer platform — Workers, KV, R2, D1, Hyperdrive",
      version: "1.0.0",
      websiteUrl: "https://developers.cloudflare.com",
      repository: { url: "https://github.com/cloudflare/mcp-server-cloudflare", source: "github" },
      packages: [{ registryName: "npm", name: "@cloudflare/mcp-server-cloudflare", version: "latest" }],
      _internal: false,
      _publishedAt: now,
      _updatedAt: now,
    },
    {
      name: "io.modelcontextprotocol/filesystem",
      description: "Local filesystem access — read, write, search, and manage files",
      version: "1.0.0",
      websiteUrl: "https://modelcontextprotocol.io",
      repository: { url: "https://github.com/modelcontextprotocol/servers", source: "github" },
      packages: [{ registryName: "npm", name: "@modelcontextprotocol/server-filesystem", version: "latest" }],
      _internal: false,
      _publishedAt: now,
      _updatedAt: now,
    },
    {
      name: "cc.chitty/chittyagent-ship",
      description: "Development wrap-up agent — preflight checks, AI brainstorm, context checkpoint, branch management",
      version: "1.0.0",
      websiteUrl: "https://ship.chitty.cc",
      repository: { url: "https://github.com/CHITTYOS/chittyagent", source: "github" },
      remotes: [{ transportType: "streamable-http", url: "https://ship.chitty.cc/mcp" }],
      _internal: true,
      _publishedAt: "2026-03-16T18:30:00Z",
      _updatedAt: "2026-03-16T18:30:00Z",
    },
    {
      name: "cc.chitty/chittyagent-notes",
      description: "Apple Notes MCP agent — sync, search, RAG-powered semantic retrieval over notes",
      version: "1.0.0",
      websiteUrl: "https://notes.chitty.cc",
      repository: { url: "https://github.com/CHITTYOS/chittyagent", source: "github" },
      remotes: [{ transportType: "streamable-http", url: "https://notes.chitty.cc/mcp" }],
      _internal: true,
      _publishedAt: "2026-03-16T18:30:00Z",
      _updatedAt: "2026-03-16T18:30:00Z",
    },
  ];
}

async function getAllMcpServers(env) {
  const seed = getMcpServerSeed();
  const seedNames = new Set(seed.map((s) => s.name));

  // Merge with any KV-stored servers
  const kvList = await env.REGISTRY_STORE?.list({ prefix: "mcp-servers:" });
  if (kvList?.keys?.length) {
    const raws = await Promise.all(kvList.keys.map((key) => env.REGISTRY_STORE.get(key.name)));
    for (const raw of raws) {
      if (!raw) continue;
      try {
        const server = JSON.parse(raw);
        if (
          !server ||
          typeof server.name !== "string" ||
          typeof server.description !== "string" ||
          typeof server.version !== "string"
        ) {
          continue;
        }

        // Seed entries are canonical; avoid overriding them with custom variants.
        if (seedNames.has(server.name)) {
          continue;
        }

        if (!seed.find((s) => s.name === server.name && s.version === server.version)) {
          seed.push(server);
        }
      } catch (_) {
        // skip malformed entries
      }
    }
  }

  return seed;
}

function formatMcpRegistryEntry(serverDef) {
  const entry = {
    server: {
      $schema: "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
      name: serverDef.name,
      description: serverDef.description,
      version: serverDef.version,
    },
    _meta: {
      "io.modelcontextprotocol.registry/official": {
        status: "active",
        publishedAt: serverDef._publishedAt || new Date().toISOString(),
        updatedAt: serverDef._updatedAt || new Date().toISOString(),
        isLatest: true,
      },
    },
  };

  if (serverDef.websiteUrl) entry.server.websiteUrl = serverDef.websiteUrl;
  if (serverDef.repository) entry.server.repository = serverDef.repository;
  if (serverDef.remotes) entry.server.remotes = serverDef.remotes;
  if (serverDef.packages) entry.server.packages = serverDef.packages;

  return entry;
}

function parseMcpServerPath(path) {
  // Paths like /v0.1/servers/cc.chitty/chittymcp/versions/latest
  // or /v0.1/servers/cc.chitty/chittymcp/versions/2.0.0
  const prefix = "/v0.1/servers/";
  if (!path.startsWith(prefix)) return null;

  const safeDecode = (value) => {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  };

  const rest = path.slice(prefix.length);
  // rest = "cc.chitty/chittymcp/versions/latest" or "cc.chitty/chittymcp"
  const versionsIdx = rest.indexOf("/versions/");
  if (versionsIdx === -1) {
    return { name: safeDecode(rest), version: null };
  }

  const name = safeDecode(rest.slice(0, versionsIdx));
  const version = safeDecode(rest.slice(versionsIdx + "/versions/".length));
  return { name, version };
}

function renderAllowedListHtml(servers) {
  const internal = servers.filter((s) => s._internal);
  const external = servers.filter((s) => !s._internal);

  const renderRow = (s) => {
    let install = "";
    if (s.remotes?.length) {
      install = `<code>${escapeHtml(s.remotes[0].url || "")}</code>`;
    } else if (s.packages?.length) {
      install = `<code>npx ${escapeHtml(s.packages[0].name || "")}</code>`;
    }
    return `<tr>
      <td><strong>${escapeHtml(s.name)}</strong></td>
      <td>${escapeHtml(s.description)}</td>
      <td>${install}</td>
    </tr>`;
  };

  const tableHead = `<thead><tr><th>Name</th><th>Description</th><th>Install / URL</th></tr></thead>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ChittyRegistry — Approved MCP Servers</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 960px; margin: 2rem auto; padding: 0 1rem; color: #1a1a1a; }
    h1 { border-bottom: 2px solid #0066cc; padding-bottom: 0.5rem; }
    h2 { margin-top: 2rem; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid #ddd; }
    th { background: #f5f5f5; }
    code { background: #f0f0f0; padding: 0.15rem 0.35rem; border-radius: 3px; font-size: 0.9em; }
    .meta { color: #666; font-size: 0.9em; margin-top: 2rem; }
  </style>
</head>
<body>
  <h1>ChittyRegistry — Approved MCP Servers</h1>
  <p>MCP servers approved for use in the ChittyOS ecosystem. Configure <code>https://registry.chitty.cc</code> as your MCP Registry URL.</p>

  <h2>Internal (ChittyOS)</h2>
  <table>${tableHead}<tbody>${internal.map(renderRow).join("")}</tbody></table>

  <h2>External (Vetted Third-Party)</h2>
  <table>${tableHead}<tbody>${external.map(renderRow).join("")}</tbody></table>

  <p class="meta">Served by ChittyRegistry v2.0.0 &middot; ${servers.length} servers &middot; ${new Date().toISOString()}</p>
</body>
</html>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
