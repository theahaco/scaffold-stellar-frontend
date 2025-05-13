import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "@stellar/design-system/build/styles.min.css";
import { WalletProvider } from "./providers/WalletProvider.tsx";
import { NotificationProvider } from "./providers/NotificationProvider.tsx"

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <NotificationProvider>
      <WalletProvider>
        <App />
      </WalletProvider>
    </NotificationProvider>
  </StrictMode>
);
