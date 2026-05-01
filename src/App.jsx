import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useToast } from './hooks/useToast';
import ToastContainer from './components/ToastContainer';
import ProcessosPage from './pages/ProcessosPage';
import AndamentosPage from './pages/AndamentosPage';
import './index.css';

function App() {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <BrowserRouter>
      {/* Navbar */}
      <nav className="navbar">
        <span style={{ fontSize: '1.5rem' }}>⚖️</span>
        <h1>Sistema de Processos Judiciais</h1>
      </nav>

      {/* Conteúdo principal */}
      <main className="container">
        <Routes>
          <Route path="/"                 element={<ProcessosPage  addToast={addToast} />} />
          <Route path="/processos/:id"    element={<AndamentosPage addToast={addToast} />} />
        </Routes>
      </main>

      {/* Notificações toast (fora do fluxo de layout) */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </BrowserRouter>
  );
}

export default App;
