import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
// Removed problematic imports
import Home from "./pages/home";
import AdminPage from "./pages/admin";
import NotFound from "./pages/not-found";

function AppRoutes() {
  console.log("🛣️ Renderizando rotas...");
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
  console.log("🏠 App iniciando...");
  console.log("📍 Base URL configurada:", baseUrl);
  console.log("🌐 URL atual:", window.location.href);
  console.log("📂 Pathname atual:", window.location.pathname);
  
  return (
    <QueryClientProvider client={queryClient}>
      {/* Ensure routing works under Vite base (e.g., /firmeinvest/) */}
      <WouterRouter base={baseUrl}>
        <AppRoutes />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
