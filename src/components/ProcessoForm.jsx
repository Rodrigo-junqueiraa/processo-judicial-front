import { useState, useEffect } from 'react';
import { UFS } from '../utils/ufs';

// Valores iniciais do formulário
const INITIAL_FORM = {
  numero_processo: '',
  data_abertura: '',
  descricao: '',
  cliente: '',
  advogado: '',
  uf: '',
};

/**
 * Formulário de cadastro/edição de processo.
 *
 * FIX aplicado:
 * - Cada campo tem seu próprio onChange isolado usando o name do input.
 * - Usa inputs "controlled" com value sempre vinculado ao state.
 * - Nenhum elemento posicionado sobre os inputs para evitar o bug de clique.
 */
export default function ProcessoForm({ processo, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  // Preenche o formulário quando estiver editando
  useEffect(() => {
    if (processo) {
      setForm({
        numero_processo: processo.numero_processo || '',
        data_abertura:   processo.data_abertura   || '',
        descricao:       processo.descricao       || '',
        cliente:         processo.cliente         || '',
        advogado:        processo.advogado        || '',
        uf:              processo.uf              || '',
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setErrors({});
  }, [processo]);

  // Handler único para todos os campos — usa o atributo name do input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Remove erro do campo ao começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validação no frontend antes de enviar
  const validate = () => {
    const newErrors = {};
    if (!form.numero_processo.trim()) newErrors.numero_processo = 'O número do processo é obrigatório.';
    if (!form.data_abertura)          newErrors.data_abertura   = 'A data de abertura é obrigatória.';
    if (!form.descricao.trim())       newErrors.descricao       = 'A descrição é obrigatória.';
    if (!form.cliente.trim())         newErrors.cliente         = 'O cliente é obrigatório.';
    if (!form.advogado.trim())        newErrors.advogado        = 'O advogado é obrigatório.';
    if (!form.uf)                     newErrors.uf              = 'Selecione a UF.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-grid">

        {/* Número do Processo */}
        <div className="form-group">
          <label htmlFor="numero_processo">Número do Processo *</label>
          <input
            type="text"
            id="numero_processo"
            name="numero_processo"
            value={form.numero_processo}
            onChange={handleChange}
            className={errors.numero_processo ? 'error' : ''}
            placeholder="Ex: 0001234-56.2024.8.13.0001"
            autoComplete="off"
          />
          {errors.numero_processo && <span className="error-text">{errors.numero_processo}</span>}
        </div>

        {/* Data de Abertura */}
        <div className="form-group">
          <label htmlFor="data_abertura">Data de Abertura *</label>
          <input
            type="date"
            id="data_abertura"
            name="data_abertura"
            value={form.data_abertura}
            onChange={handleChange}
            className={errors.data_abertura ? 'error' : ''}
          />
          {errors.data_abertura && <span className="error-text">{errors.data_abertura}</span>}
        </div>

        {/* Cliente */}
        <div className="form-group">
          <label htmlFor="cliente">Cliente *</label>
          <input
            type="text"
            id="cliente"
            name="cliente"
            value={form.cliente}
            onChange={handleChange}
            className={errors.cliente ? 'error' : ''}
            placeholder="Nome do cliente"
            autoComplete="off"
          />
          {errors.cliente && <span className="error-text">{errors.cliente}</span>}
        </div>

        {/* Advogado */}
        <div className="form-group">
          <label htmlFor="advogado">Advogado *</label>
          <input
            type="text"
            id="advogado"
            name="advogado"
            value={form.advogado}
            onChange={handleChange}
            className={errors.advogado ? 'error' : ''}
            placeholder="Nome do advogado"
            autoComplete="off"
          />
          {errors.advogado && <span className="error-text">{errors.advogado}</span>}
        </div>

        {/* UF */}
        <div className="form-group">
          <label htmlFor="uf">UF *</label>
          <select
            id="uf"
            name="uf"
            value={form.uf}
            onChange={handleChange}
            className={errors.uf ? 'error' : ''}
          >
            <option value="">Selecione o estado...</option>
            {UFS.map(uf => (
              <option key={uf.sigla} value={uf.sigla}>
                {uf.sigla} — {uf.nome}
              </option>
            ))}
          </select>
          {errors.uf && <span className="error-text">{errors.uf}</span>}
        </div>

        {/* Descrição — ocupa linha inteira */}
        <div className="form-group full-width">
          <label htmlFor="descricao">Descrição *</label>
          <textarea
            id="descricao"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            className={errors.descricao ? 'error' : ''}
            placeholder="Descreva o processo judicial..."
            rows={4}
          />
          {errors.descricao && <span className="error-text">{errors.descricao}</span>}
        </div>

      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-success"
          disabled={loading}
        >
          {loading ? 'Salvando...' : (processo ? 'Atualizar Processo' : 'Cadastrar Processo')}
        </button>
      </div>
    </form>
  );
}
