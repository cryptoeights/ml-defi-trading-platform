# GeckoFit Recall Agent

A unified, cross-chain DeFi trading platform powered by ML/AI, Recall, GAIA, Lit Protocol, and a modern design system.

![Auto-Trading Active](https://img.shields.io/badge/Auto--Trading-Active-brightgreen)
[![Powered by Recall](https://img.shields.io/badge/Powered%20by-Recall-blue)](https://api.competitions.recall.network/api/docs/#/)
[![AI by GAIA](https://img.shields.io/badge/AI%20by-GAIA-green)](https://gaia.domains)
[![Secured by Lit Protocol](https://img.shields.io/badge/Secured%20by-Lit%20Protocol-purple)](https://litprotocol.com)
[![Design by Crypto Eights](https://img.shields.io/badge/Design-Crypto%20Eights-orange)](https://cryptoeights.com)

---

## 🚀 Features

- **ML/AI-Driven Token Scoring:** Automated opportunity detection and scoring.
- **Auto-Trading:** Trades are executed automatically for high-score tokens, with manual override available.
- **Cross-Chain Trading:** Integrates with Recall for seamless multi-chain execution.
- **GAIA AI Agent:** Ask questions about any token and get ML-powered insights.
- **Lit Protocol Consent:** Secure, privacy-preserving access gating using Lit Protocol.
- **Modern UI:** Fully responsive, dark-mode design system (see `design.json`).
- **Trade History:** All trades (auto/manual) are logged and viewable in the dashboard.

---

## 🛠️ Setup & Run

1. **Install dependencies:**
   ```sh
   npm install
   # or
   pnpm install
   ```

2. **Start the app:**
   ```sh
   npm run dev
   # or
   pnpm dev
   ```

3. **Open in your browser:**
   ```
   http://localhost:3000
   ```

---

## 🏗️ Project Structure

```
web-ui/
  src/
    app/
      design-system.css   # Design tokens and theme
      layout.tsx         # App layout and header
    components/
      ScannerDashboard.tsx  # Main dashboard, auto/manual trading, trade history
      AskGaiaModal.tsx      # GAIA AI agent modal
      LitConsentDemo.tsx    # Lit Protocol consent/signature
  README.md
  package.json
  ...
```

---

## 🤝 Sponsor Technologies Used

| Sponsor/Tech      | Where Used in Repo                                                                                  |
|-------------------|----------------------------------------------------------------------------------------------------|
| **Lit Protocol**  | User consent/signature gating before dashboard access. <br> _See:_ `LitConsentDemo.tsx`, `page.tsx` |
| **Recall**        | Automated cross-chain trading, trade execution, and trade history. <br> _See:_ `ScannerDashboard.tsx`, `/api/trade` integration, [Recall API docs](https://api.competitions.recall.network/api/docs/#/) |
| **GAIA**          | AI agent for token analysis and ML-driven trade suggestions. <br> _See:_ `AskGaiaModal.tsx`        |
| **Crypto Eights** | Branding, logo, and design system. <br> _See:_ `design-system.css`, header, and all UI components. |
| **ML/AI Models**  | Token scoring and auto-trading triggers. <br> _See:_ ML score usage in `ScannerDashboard.tsx`      |

---

## ✨ How It Works

1. **User signs in with Lit Protocol** (consent required).
2. **Dashboard loads live scanner data** and ML scores.
3. **Auto-trading**: High-score tokens are traded automatically (with status indicator).
4. **Manual trading**: User can also trade any eligible token via the dashboard.
5. **Ask GAIA**: Click "Ask GAIA" for ML-powered token analysis.
6. **Trade history**: All trades are logged and viewable.

---

## 📦 Design System

- All UI components follow the design tokens in [`design.json`](./design.json) and [`design-system.css`](./web-ui/src/app/design-system.css).
- Colors, fonts, spacing, and component styles are consistent and modern.

---

## 📝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

[MIT](LICENSE) (or your preferred license)

---

## 🙏 Acknowledgements

- [Recall Network](https://recall.network)
- [GAIA Domains](https://gaia.domains)
- [Lit Protocol](https://litprotocol.com)
- [Crypto Eights](https://cryptoeights.com) 
