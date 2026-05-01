import { useState, useEffect, useCallback } from 'react';
import {
  listarProcessos,
  criarProcesso,
  atualizarProcesso,
  excluirProcesso,
} from '../services/api';
import Modal from '../components/Modal';
import ProcessoForm from '../components/ProcessoForm';
import ConfirmDialog from '../components/ConfirmDialog';

export default function ProcessosPage({ addToast }) {
  const [processos, setProcessos]           = useState([]);
  const [loadingList, setLoadingList]       = useState(true);
  const [loadingForm, setLoadingForm]       = useState(false);

  // Modal de cadastro/edição
  const [modalOpen, setModalOpen]           = useState(false);
  const [processoEditando, setProcessoEditando] = useState(null);

  // Diálogo de confirmação de exclusão
  const [confirmOpen, setConfirmOpen]       = useState(false);
  const [processoParaExcluir, setProcessoParaExcluir] = useState(null);

  // ── Carrega a lista ──────────────────────────────────────────────────────
  const carregarProcessos = useCallback(async () => {
    try {
      setLoadingList(true);
      const res = await listarProcessos();
      setProcessos(res.data);
    } catch (err) {
      addToast('Erro ao carregar processos. Verifique se a API está rodando.', 'error');
    } finally {
      setLoadingList(false);
    }
  }, [addToast]);

  useEffect(() => {
    carregarProcessos();
  }, [carregarProcessos]);

  // ── Abrir modal para novo processo ───────────────────────────────────────
  const handleNovo = () => {
    setProcessoEditando(null);
    setModalOpen(true);
  };

  // ── Abrir modal para editar ──────────────────────────────────────────────
  const handleEditar = (processo) => {
    setProcessoEditando(processo);
    setModalOpen(true);
  };

  // ── Submit do formulário (criar ou atualizar) ────────────────────────────
  const handleSubmit = async (dados) => {
    setLoadingForm(true);
    try {
      if (processoEditando) {
        // Edição
        const res = await atualizarProcesso(processoEditando.id, dados);
        addToast(res.data.message, 'success');
      } else {
        // Criação — exibe mensagem de negócio (MG ou fora de MG)
        const res = await criarProcesso(dados);
        addToast(res.data.message, 'success');
      }
      setModalOpen(false);
      carregarProcessos();
    } catch (err) {
      // Exibe erros de validação do backend
      if (err.response?.data?.errors) {
        const msgs = Object.values(err.response.data.errors).flat();
        addToast(msgs[0], 'error');
      } else {
        addToast(err.response?.data?.message || 'Erro ao salvar processo.', 'error');
      }
    } finally {
      setLoadingForm(false);
    }
  };

  // ── Confirmar exclusão ───────────────────────────────────────────────────
  const handleExcluirClick = (processo) => {
    setProcessoParaExcluir(processo);
    setConfirmOpen(true);
  };

  const handleExcluirConfirm = async () => {
    try {
      await excluirProcesso(processoParaExcluir.id);
      addToast('Processo excluído com sucesso.', 'success');
      setConfirmOpen(false);
      setProcessoParaExcluir(null);
      carregarProcessos();
    } catch {
      addToast('Erro ao excluir processo.', 'error');
    }
  };

  // ── Formata data para exibição ───────────────────────────────────────────
  const formatarData = (data) => {
    if (!data) return '-';
    // data vem como YYYY-MM-DD da API
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h2>⚖️ Processos Judiciais</h2>
          <button className="btn btn-primary" onClick={handleNovo}>
            + Novo Processo
          </button>
        </div>

        {loadingList ? (
          <div className="loading">Carregando processos...</div>
        ) : processos.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum processo cadastrado ainda.</p>
            <p>Clique em <strong>+ Novo Processo</strong> para começar.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nº do Processo</th>
                  <th>Data Abertura</th>
                  <th>Cliente</th>
                  <th>Advogado</th>
                  <th>UF</th>
                  <th>Andamentos</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {processos.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.numero_processo}</strong></td>
                    <td>{formatarData(p.data_abertura)}</td>
                    <td>{p.cliente}</td>
                    <td>{p.advogado}</td>
                    <td>
                      <span className={`badge-uf ${p.uf === 'MG' ? 'mg' : ''}`}>
                        {p.uf}
                      </span>
                    </td>
                    <td>{p.andamentos_count || 0}</td>
                    <td>
                      <div className="actions-cell">
                        <a
                          href={`/processos/${p.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          Andamentos
                        </a>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEditar(p)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleExcluirClick(p)}
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

      {/* Modal de cadastro/edição */}
      <Modal
        isOpen={modalOpen}
        title={processoEditando ? 'Editar Processo' : 'Novo Processo'}
        onClose={() => !loadingForm && setModalOpen(false)}
      >
        <ProcessoForm
          processo={processoEditando}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          loading={loadingForm}
        />
      </Modal>

      {/* Diálogo de confirmação de exclusão */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Excluir Processo"
        message={`Tem certeza que deseja excluir o processo "${processoParaExcluir?.numero_processo}"? Os andamentos também serão excluídos.`}
        onConfirm={handleExcluirConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
