# ML-Powered DeFi Trading Platform

A unified, AI-driven crypto trading and analytics platform integrating:
- **Liquedee**: Real-time multi-chain liquidity analysis and ML-powered token discovery
- **Recall**: Cross-chain trading and competition APIs
- **GAIA**: Natural language AI inference for conversational trading
- **LIT/Vincent**: Permissioned security and user policy enforcement

## Features
- Multi-chain support: Solana, Ethereum, BSC, Polygon, Arbitrum, Avalanche, Base
- Automated ML-driven token scoring and risk assessment
- Cross-chain trading and portfolio management
- Natural language trading via CLI and web UI
- User-controlled, policy-enforced transactions (LIT/Vincent)
- Real-time monitoring, Telegram bot alerts, and analytics

## Project Structure
- `Liquedee/` — Liquidity analysis, ML models, Telegram bot ([README](Liquedee/README.md))
- `gaia-recall-test/` — GAIA agent integration and test scripts
- `cross-chain-test/` — Cross-chain trading logic and tests
- `web-ui/` — Next.js web interface ([README](web-ui/README.md))
- `js-recall/` — Recall JS/TS monorepo ([README](js-recall/README.md))
- `recall-mcp-server/` — MCP server for Recall competitions

## Quick Start
1. **Clone the repo**
2. **Set up Python/Node.js environments**
3. **Install dependencies**
   - Python: `pip install -r Liquedee/requirements.txt`
   - Node.js: `cd web-ui && npm install`
4. **Configure environment variables** (`.env` files as per subproject docs)
5. **Run Liquedee ML/analytics**: `python -m Liquedee.src.core.alpha_scanner`
6. **Start web UI**: `cd web-ui && npm run dev`
7. **Test GAIA agent**: See `gaia-recall-test/README.md`

## Integrations
- **GAIA**: Natural language agent for trading and analytics
- **LIT/Vincent**: Permissioned, policy-based transaction security
- **Recall**: Trading competitions, cross-chain execution
- **Liquedee**: ML-powered liquidity and token discovery

## Contributing
See subproject READMEs for contribution guidelines and development practices.

## License
MIT (see subproject licenses)

---

# .gitignore (recommended)
# Python
__pycache__/
*.pyc
.venv/
.env

# Node.js
node_modules/
dist/
.next/
.env.local

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Jupyter
.ipynb_checkpoints/ 