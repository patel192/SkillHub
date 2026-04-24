import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./theme.css";
import {store} from "./redux/store.js";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";
import { Provider } from "react-redux";
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
  <AuthProvider>
    <SettingsProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SettingsProvider>
  </AuthProvider>,
  </Provider>
);
