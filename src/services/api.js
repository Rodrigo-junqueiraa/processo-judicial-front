import axios from 'axios';

// Instância única do axios com baseURL da API Laravel
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ─── PROCESSOS ─────────────────────────────────────────────────────────────

export const listarProcessos = () =>
  api.get('/processos');

export const buscarProcesso = (id) =>
  api.get(`/processos/${id}`);

export const criarProcesso = (dados) =>
  api.post('/processos', dados);

export const atualizarProcesso = (id, dados) =>
  api.put(`/processos/${id}`, dados);

export const excluirProcesso = (id) =>
  api.delete(`/processos/${id}`);

// ─── ANDAMENTOS ────────────────────────────────────────────────────────────

export const listarAndamentos = (processoId) =>
  api.get(`/processos/${processoId}/andamentos`);

export const criarAndamento = (processoId, dados) =>
  api.post(`/processos/${processoId}/andamentos`, dados);

export const atualizarAndamento = (processoId, andamentoId, dados) =>
  api.put(`/processos/${processoId}/andamentos/${andamentoId}`, dados);

export const excluirAndamento = (processoId, andamentoId) =>
  api.delete(`/processos/${processoId}/andamentos/${andamentoId}`);

export default api;
