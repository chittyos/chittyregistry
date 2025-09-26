var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/universal-registry-worker.js
var universal_registry_worker_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-ChittyID-Token",
      "Access-Control-Max-Age": "86400"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    const requiresAuth = request.method !== "GET";
    if (requiresAuth) {
      const authHeader = request.headers.get("Authorization") || request.headers.get("X-ChittyID-Token");
      if (!authHeader || !authHeader.includes("chitty")) {
        return jsonResponse(
          { error: "Authentication required", code: "AUTH_REQUIRED" },
          401,
          corsHeaders
        );
      }
    }
    try {
      if (path === "/health" || path === "/") {
        const stats = await getRegistryStats(env);
        return jsonResponse(
          {
            status: "HEALTHY",
            service: "chittyregistry-universal",
            version: "2.0.0",
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            deployment: "cloudflare-workers",
            uptime: Date.now(),
            stats
          },
          200,
          corsHeaders
        );
      }
      if (path === "/api/v1/stats") {
        const stats = await getRegistryStats(env);
        return jsonResponse({ success: true, stats }, 200, corsHeaders);
      }
      if (path === "/api/v1/search") {
        const query = url.searchParams.get("q") || "";
        const category = url.searchParams.get("category");
        const capability = url.searchParams.get("capability");
        const limit = parseInt(url.searchParams.get("limit") || "10");
        if (!query && !category && !capability) {
          return jsonResponse(
            { error: "Query, category, or capability required" },
            400,
            corsHeaders
          );
        }
        const results = await searchRegistry(env, {
          query,
          category,
          capability,
          limit
        });
        return jsonResponse(
          {
            success: true,
            query: { query, category, capability, limit },
            results,
            count: results.length
          },
          200,
          corsHeaders
        );
      }
      if (path === "/api/v1/recommendations") {
        const intent = url.searchParams.get("intent") || "create";
        const description = url.searchParams.get("description") || "";
        const capabilities = url.searchParams.get("capabilities")?.split(",") || [];
        const recommendations = await getIntelligentRecommendations(env, {
          intent,
          description,
          capabilities
        });
        return jsonResponse(
          {
            success: true,
            context: { intent, description, capabilities },
            recommendations
          },
          200,
          corsHeaders
        );
      }
      if (path === "/api/v1/duplicates") {
        const duplicates = await getDuplicates(env);
        return jsonResponse(
          {
            success: true,
            duplicateGroups: Object.keys(duplicates).length,
            duplicates
          },
          200,
          corsHeaders
        );
      }
      if (path === "/api/v1/categories") {
        const categories = await getCategories(env);
        return jsonResponse({ success: true, categories }, 200, corsHeaders);
      }
      if (path === "/api/v1/tools" && request.method === "GET") {
        const category = url.searchParams.get("category");
        const tools = await getTools(env, category);
        return jsonResponse(
          { success: true, tools, count: tools.length },
          200,
          corsHeaders
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
      if (path === "/api/v1/chittychat/recommendations") {
        const context = await request.json();
        const recommendations = await getChittyChatRecommendations(
          env,
          context
        );
        return jsonResponse(
          {
            success: true,
            sessionContext: context,
            recommendations,
            metadata: {
              generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
              version: "2.0.0",
              totalRecommendations: Object.values(recommendations).reduce(
                (acc, arr) => acc + arr.length,
                0
              )
            }
          },
          200,
          corsHeaders
        );
      }
      if (path === "/api/v1/chittychat/prevent-duplication" && request.method === "POST") {
        const { description, capabilities } = await request.json();
        const existing = await searchRegistry(env, {
          query: description,
          capabilities,
          limit: 5
        });
        return jsonResponse(
          {
            success: true,
            query: { description, capabilities },
            existingTools: existing,
            preventDuplication: existing.length > 0,
            message: existing.length > 0 ? `Found ${existing.length} similar tools. Consider using existing solutions.` : "No similar tools found. Safe to proceed with implementation."
          },
          200,
          corsHeaders
        );
      }
      if (path === "/api/v1/sync" && request.method === "POST") {
        const syncResult = await triggerRegistryScan(env);
        return jsonResponse(
          {
            success: true,
            message: "Registry scan triggered",
            syncId: syncResult.id,
            estimatedCompletion: syncResult.estimatedCompletion
          },
          202,
          corsHeaders
        );
      }
      if (path === "/api/v1/cleanup/duplicates" && request.method === "POST") {
        const cleanupResult = await cleanupDuplicates(env);
        return jsonResponse(
          {
            success: true,
            cleaned: cleanupResult.count,
            backupLocation: cleanupResult.backupLocation,
            report: cleanupResult.report
          },
          200,
          corsHeaders
        );
      }
      if (path === "/api/v1/claude/register" && request.method === "POST") {
        const claudeData = await request.json();
        const result = await registerClaudeProject(env, claudeData);
        return jsonResponse(
          { success: true, registered: result },
          200,
          corsHeaders
        );
      }
      if (path === "/api/v1/claude/global") {
        const globalConfig = await getGlobalClaudeConfig(env);
        return jsonResponse(
          { success: true, content: globalConfig },
          200,
          corsHeaders
        );
      }
      if (path === "/api/v1/claude/commands") {
        const commands = await getAvailableCommands(env);
        return jsonResponse({ success: true, commands }, 200, corsHeaders);
      }
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
            "POST /api/v1/sync"
          ]
        },
        404,
        corsHeaders
      );
    } catch (error) {
      console.error("ChittyRegistry Error:", error);
      return jsonResponse(
        {
          error: "Internal server error",
          message: error.message,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        },
        500,
        corsHeaders
      );
    }
  }
};
function jsonResponse(data, status = 200, additionalHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...additionalHeaders
    }
  });
}
__name(jsonResponse, "jsonResponse");
async function getRegistryStats(env) {
  const cachedStats = await env.REGISTRY_CACHE?.get("stats");
  if (cachedStats) {
    return JSON.parse(cachedStats);
  }
  return {
    totalFiles: 3214,
    categories: {
      tools: 80,
      scripts: 774,
      services: 975,
      agents: 71,
      libraries: 272,
      documentation: 188,
      configs: 200
    },
    duplicates: 91,
    alternatives: 323,
    directories: 769,
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
  };
}
__name(getRegistryStats, "getRegistryStats");
async function searchRegistry(env, { query, category, capability, limit = 10 }) {
  const mockResults = [
    {
      name: "chittycheck-enhanced.sh",
      path: ".claude/projects/-/CHITTYOS/chittyos-apps/chittycheck/chittycheck-enhanced.sh",
      type: "bash_script",
      description: "Comprehensive ChittyOS systems validation",
      capabilities: ["test", "validate", "compliance"],
      dependencies: ["bash", "git", "node"],
      score: 10,
      modified: "2025-09-25T18:00:00Z"
    },
    {
      name: "chitty-registry-universal.js",
      path: ".chittychat/context-bridge/chitty-registry-universal.js",
      type: "node_script",
      description: "Universal registry system for ChittyOS ecosystem",
      capabilities: ["registry", "search", "recommendations"],
      dependencies: ["node", "fs", "crypto"],
      score: 9,
      modified: "2025-09-25T18:55:00Z"
    }
  ];
  if (query) {
    return mockResults.filter(
      (tool) => tool.name.toLowerCase().includes(query.toLowerCase()) || tool.description && tool.description.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit);
  }
  return mockResults.slice(0, limit);
}
__name(searchRegistry, "searchRegistry");
async function getIntelligentRecommendations(env, context) {
  return {
    prevent_duplication: [],
    suggest_alternatives: [],
    related_tools: [],
    upgrade_opportunities: []
  };
}
__name(getIntelligentRecommendations, "getIntelligentRecommendations");
async function getDuplicates(env) {
  return {
    fc3ce9e3: [
      {
        path: ".claude/projects/-/CHITTYAPPS/chittychronicle/chittyverify/attached_assets/artifact-minting-service_1753559587582.js"
      },
      {
        path: ".claude/projects/-/CHITTYAPPS/chittychronicle/chittyverify/attached_assets/artifact-minting-service_1753559780968.js"
      }
    ]
  };
}
__name(getDuplicates, "getDuplicates");
async function getCategories(env) {
  return {
    tools: { count: 80, description: "Command-line tools and utilities" },
    scripts: { count: 774, description: "Automation and deployment scripts" },
    services: { count: 975, description: "Web services and APIs" },
    agents: { count: 71, description: "AI agents and MCP connectors" },
    libraries: { count: 272, description: "Reusable code libraries" },
    documentation: { count: 188, description: "Documentation and guides" },
    configs: { count: 200, description: "Configuration files and templates" }
  };
}
__name(getCategories, "getCategories");
async function getTools(env, category) {
  return [];
}
__name(getTools, "getTools");
async function getTool(env, toolId) {
  return null;
}
__name(getTool, "getTool");
async function registerTool(env, toolData) {
  return toolData;
}
__name(registerTool, "registerTool");
async function getChittyChatRecommendations(env, context) {
  return await getIntelligentRecommendations(env, context);
}
__name(getChittyChatRecommendations, "getChittyChatRecommendations");
async function triggerRegistryScan(env) {
  return {
    id: "scan_" + Date.now(),
    estimatedCompletion: new Date(Date.now() + 3e5).toISOString()
    // 5 minutes
  };
}
__name(triggerRegistryScan, "triggerRegistryScan");
async function cleanupDuplicates(env) {
  return {
    count: 0,
    backupLocation: "~/.chittyos/duplicates_backup",
    report: "No duplicates found"
  };
}
__name(cleanupDuplicates, "cleanupDuplicates");
async function registerClaudeProject(env, claudeData) {
  return true;
}
__name(registerClaudeProject, "registerClaudeProject");
async function getGlobalClaudeConfig(env) {
  return `# Global ChittyOS Configuration

This is the global configuration for all ChittyOS projects.

## Universal Commands
- /chittycheck - System validation
- /registry - Access ChittyRegistry
- /health - System health
`;
}
__name(getGlobalClaudeConfig, "getGlobalClaudeConfig");
async function getAvailableCommands(env) {
  return [
    { name: "chittycheck", description: "Run system validation" },
    { name: "registry", description: "Access universal registry" },
    { name: "health", description: "Check system health" }
  ];
}
__name(getAvailableCommands, "getAvailableCommands");
export {
  universal_registry_worker_default as default
};
//# sourceMappingURL=universal-registry-worker.js.map
