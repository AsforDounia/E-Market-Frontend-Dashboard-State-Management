import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.jsx";
import store from "./store";

const queryClient = new QueryClient();

// Enable TanStack Query DevTools browser extension debugging
// TypeScript users would add this to their global types:
// declare global {
//   interface Window {
//     __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
//   }
// }
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
