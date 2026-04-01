import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./theme.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";
createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <SettingsProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SettingsProvider>
  </AuthProvider>,
);
