import React from 'react';
import ReactDOM from 'react-dom/client';
import { DashboardController } from './features/dashboard/DashboardController'; // Caminho corrigido
import './index.css'; // Importa Tailwind CSS
import './styles/fonts.css'; // Importa fontes personalizadas

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    "Failed to find the root element. Make sure an element with id='root' exists in your index.html."
  );
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <DashboardController />
  </React.StrictMode>
);
