import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  buscarProcesso,
  listarAndamentos,
  criarAndamento,
  atualizarAndamento,
  excluirAndamento,
} from '../services/api';
import Modal from '../components/Modal';
import AndamentoForm from '../components/AndamentoForm';
import ConfirmDialog from '../components/ConfirmDialog';

export default function AndamentosPage({ addToast }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [processo, setProcesso]           = useState(null);
  const [andamentos, setAndamentos]       = useState([]);
  const [loadingPage, setLoadingPage]     = useState(true);
  const [loadingForm, setLoadingForm]     = useState(false);

  const [modalOpen, setModalOpen]         = useState(false);
  const [andamentoEditando, setAndamentoEditando] = useState(null);

  const [confirmOpen, setConfirmOpen]     = useState(false);
  const [andamentoParaExcluir, setAndamentoParaExcluir] = useState(null);

  // ── Carrega processo + andamentos ────────────────────────────────────────
  const carregarDados = useCallback(async () => {
    try {
      setLoadingPage(true);
      const [resProcesso, resAndamentos] = await Promise.all([
        buscarProcesso(id),
        listarAndamentos(id),
      ]);
      setProcesso(resProcesso.data);
      setAndamentos(resAndamentos.data);
    } catch {
      addToast('Processo não encontrado.', 'error');
      navigate('/');
    } finally {
      setLoadingPage(false);
    }
  }, [id, addToast, navigate]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // ── Submit do formulário ─────────────────────────────────────────────────
  const handleSubmit = async (dados) => {
    setLoadingForm(true);
    try {
      if (andamentoEditando) {
        const res = await atualizarAndamento(id, andamentoEditando.id, dados);
        addToast(res.data.message, 'success');
      } else {
        const res = await criarAndamento(id, dados);
        addToast(res.data.message, 'success');
      }
      setModalOpen(false);
      carregarDados();
    } catch (err) {
      if (err.response?.data?.errors) {
        const msgs = Object.values(err.response.data.errors).flat();
        addToast(msgs[0], 'error');
      } else {
        addToast(err.response?.data?.message || 'Erro ao salvar andamento.', 'error');
      }
    } finally {
      setLoadingForm(false);
    }
  };

  // ── Exclusão ─────────────────────────────────────────────────────────────
  const handleExcluirConfirm = async () => {
    try {
      await excluirAndamento(id, andamentoParaExcluir.id);
      addToast('Andamento excluído com sucesso.', 'success');
      setConfirmOpen(false);
      setAndamentoParaExcluir(null);
      carregarDados();
    } catch {
      addToast('Erro ao excluir andamento.', 'error');
    }
  };

  const formatarData = (data) => {
    if (!data) return '-';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  if (loadingPage) return <div className="loading">Carregando...</div>;

  return (
    <>
      {/* Informações do processo */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2>⚖️ {processo?.numero_processo}</h2>
            <p style={{ fontSize: '0.85rem', color: '#6c757d', marginTop: 4 }}>
              Detalhes do processo
            </p>
          </div>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            ← Voltar
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <strong style={{ fontSize: '0.8rem', color: '#6c757d', display: 'block' }}>Cliente</strong>
            {processo?.cliente}
          </div>
          <div>
            <strong style={{ fontSize: '0.8rem', color: '#6c757d', display: 'block' }}>Advogado</strong>
            {processo?.advogado}
          </div>
          <div>
            <strong style={{ fontSize: '0.8rem', color: '#6c757d', display: 'block' }}>Data de Abertura</strong>
            {formatarData(processo?.data_abertura)}
          </div>
          <div>
            <strong style={{ fontSize: '0.8rem', color: '#6c757d', display: 'block' }}>UF</strong>
            <span className={`badge-uf ${processo?.uf === 'MG' ? 'mg' : ''}`}>
              {processo?.uf}
            </span>
          </div>
        </div>

        {processo?.descricao && (
          <div style={{ marginTop: 16 }}>
            <strong style={{ fontSize: '0.8rem', color: '#6c757d', display: 'block', marginBottom: 4 }}>Descrição</strong>
            <p style={{ fontSize: '0.9rem', color: '#444', lineHeight: 1.5 }}>{processo.descricao}</p>
          </div>
        )}
      </div>

      {/* Andamentos */}
      <div className="card">
        <div className="card-header">
          <h2>📋 Andamentos ({andamentos.length})</h2>
          <button
            className="btn btn-primary"
            onClick={() => { setAndamentoEditando(null); setModalOpen(true); }}
          >
            + Novo Andamento
          </button>
        </div>

        {andamentos.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum andamento registrado.</p>
            <p>Clique em <strong>+ Novo Andamento</strong> para adicionar.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 130 }}>Data</th>
                  <th>Descrição</th>
                  <th style={{ width: 150 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {andamentos.map(a => (
                  <tr key={a.id}>
                    <td><strong>{formatarData(a.data)}</strong></td>
                    <td>{a.descricao}</td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => { setAndamentoEditando(a); setModalOpen(true); }}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => { setAndamentoParaExcluir(a); setConfirmOpen(true); }}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        title={andamentoEditando ? 'Editar Andamento' : 'Novo Andamento'}
        onClose={() => !loadingForm && setModalOpen(false)}
      >
        <AndamentoForm
          andamento={andamentoEditando}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          loading={loadingForm}
        />
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Excluir Andamento"
        message="Tem certeza que deseja excluir este andamento?"
        onConfirm={handleExcluirConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
