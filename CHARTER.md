# ChittyRegistry Charter

## Classification
- **Tier**: 2 (Core Infrastructure)
- **Organization**: CHITTYOS
- **Domain**: registry.chitty.cc

## Mission

ChittyRegistry is the **universal service registry and discovery platform** for the ChittyOS ecosystem. It provides tool/script registration, intelligent search, duplicate detection, and ChittyChat integration for AI-driven development workflows.

## Scope

### IS Responsible For
- Universal tool/script registration and catalog
- Multi-dimensional search (query, category, capability)
- Intelligent AI-driven recommendations based on intent
- Duplicate detection and prevention across ecosystem
- ChittyChat integration for contextual recommendations
- Category and capability taxonomy management
- Registry statistics and analytics
- Certified service directory (post-ChittyRegister approval)

### IS NOT Responsible For
- Service compliance validation (ChittyRegister)
- Runtime service discovery (ChittyDiscovery)
- Identity generation (ChittyID)
- Token provisioning (ChittyAuth)
- Certificate signing (ChittyCert)

## Key Distinction

| Service | Role | Purpose |
|---------|------|---------|
| **ChittyRegister** | Gatekeeper | Compliance validation before listing |
| **ChittyRegistry** | Directory | Authoritative service/tool catalog |
| **ChittyDiscovery** | Runtime | Real-time service location |

## Dependencies

| Type | Service | Purpose |
|------|---------|---------|
| Upstream | ChittyRegister | Receives certified services |
| Upstream | ChittyAuth | Write operation authentication |
| Peer | ChittyDiscovery | Provides authoritative lookups |
| Peer | ChittyChat | Recommendation integration |
| Peer | ChittyRouter | Route handling |
| Storage | Cloudflare KV | Tool/service metadata |

## API Contract

**Base URL**: https://registry.chitty.cc

### Health & Status
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/api/v1/stats` | GET | Registry statistics |

### Search & Discovery
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/search` | GET | Search registry (q, category, capability, limit) |
| `/api/v1/recommendations` | GET | Intelligent recommendations |
| `/api/v1/duplicates` | GET | Find duplicate tools |
| `/api/v1/categories` | GET | List all categories |

### Tool Management
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/tools` | GET | List tools (optional category filter) |
| `/api/v1/tools` | POST | Register new tool (requires auth) |
| `/api/v1/tools/{toolId}` | GET | Get specific tool |

### ChittyChat Integration
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/chittychat/recommendations` | POST | Session-aware recommendations |
| `/api/v1/chittychat/prevent-duplication` | POST | Check for existing tools |

### Authentication
- **Read Operations**: No authentication required
- **Write Operations**: Requires `Authorization` or `X-ChittyID-Token` header

## Storage

### KV Namespaces
| Binding | Purpose |
|---------|---------|
| `REGISTRY_CACHE` | Query result caching |
| `REGISTRY_STORE` | Tool/script metadata storage |

## Ownership

| Role | Owner |
|------|-------|
| Service Owner | ChittyOS |
| Technical Lead | @chittyos-infrastructure |
| Contact | registry@chitty.cc |

## Compliance

- [ ] Service registered in ChittyRegistry (self)
- [ ] Health endpoint operational at /health
- [ ] CLAUDE.md development guide present
- [ ] KV namespaces configured
- [ ] ChittyChat integration active
- [ ] Duplicate detection operational

## Integration Notes

### Used by ChittyChat
- Recommends existing tools before creating new ones
- Prevents duplication across development sessions
- Provides context-aware suggestions

### Used by ChittyCheck
- Validates registry service health
- Verifies service metadata registration

### Used by ChittyRouter
- Routes `registry.chitty.cc` requests

---
*Charter Version: 1.0.0 | Last Updated: 2026-01-13*
