import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("🚀 Iniciando aplicação FirmeInvest...");
console.log("📍 Base URL:", import.meta.env.BASE_URL);
console.log("🔧 Modo estático:", import.meta.env.VITE_STATIC_SITE);

const rootElement = document.getElementById("root");
console.log("📦 Elemento root encontrado:", !!rootElement);

if (!rootElement) {
  console.error("❌ Elemento root não encontrado!");
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
      <h1 style="color: red;">❌ Erro: Elemento root não encontrado</h1>
      <p>O elemento com ID 'root' não foi encontrado no DOM.</p>
    </div>
  `;
} else {
  try {
    console.log("✅ Criando root React...");
    const root = createRoot(rootElement);
    console.log("✅ Renderizando App...");
    root.render(<App />);
    console.log("🎉 Aplicação renderizada com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao renderizar aplicação:", error);
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
        <h1 style="color: red;">❌ Erro na aplicação</h1>
        <p>Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}</p>
        <pre style="text-align: left; background: #f5f5f5; padding: 10px; border-radius: 5px;">${error instanceof Error ? error.stack : ''}</pre>
      </div>
    `;
  }
}
