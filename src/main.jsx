// ═══════════════════════════════════════════════════════════════
// The Owl's Postoffice · React Entry Point
// ═══════════════════════════════════════════════════════════════

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(err, info) {
    console.error("[owl] React crash:", err, info);
    this.setState({ stack: (err?.stack || "") + "\n\nComponent stack:" + (info?.componentStack || "") });
  }
  render() {
    if (this.state.error) {
      return React.createElement("div", {
        style: {
          padding: 32, background: "#1a1208", color: "#f5efe0",
          fontFamily: "monospace", fontSize: 11, lineHeight: 1.6,
          height: "100vh", overflow: "auto",
        },
      },
        React.createElement("h2", { style: { color: "#c0392b", marginBottom: 12 } }, "Press jammed"),
        React.createElement("pre", { style: { whiteSpace: "pre-wrap", color: "#d4c9a8", fontSize: 10 } },
          String(this.state.error?.message || this.state.error)
          + "\n\n" + (this.state.stack || "")),
        React.createElement("button", {
          onClick: () => { localStorage.clear(); location.reload(); },
          style: {
            marginTop: 20, padding: "10px 20px", background: "#c9a227",
            color: "#1a1208", border: "none", cursor: "pointer", fontSize: 13,
          },
        }, "Clear data and reload"),
      );
    }
    return this.props.children;
  }
}

const root = createRoot(document.getElementById("root"));
root.render(
  React.createElement(ErrorBoundary, null,
    React.createElement(AuthProvider, null,
      React.createElement(App)
    )
  )
);

if (window.__dulemeReady) window.__dulemeReady();
