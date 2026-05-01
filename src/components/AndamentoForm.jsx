import { useState, useEffect } from 'react';

const INITIAL_FORM = { data: '', descricao: '' };

export default function AndamentoForm({ andamento, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (andamento) {
      setForm({
        data:      andamento.data      || '',
        descricao: andamento.descricao || '',
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setErrors({});
  }, [andamento]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.data)             newErrors.data      = 'A data é obrigatória.';
    if (!form.descricao.trim()) newErrors.descricao = 'A descrição é obrigatória.';
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
      <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>

        <div className="form-group">
          <label htmlFor="and-data">Data *</label>
          <input
            type="date"
            id="and-data"
            name="data"
            value={form.data}
            onChange={handleChange}
            className={errors.data ? 'error' : ''}
          />
          {errors.data && <span className="error-text">{errors.data}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="and-descricao">Descrição *</label>
          <textarea
            id="and-descricao"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            className={errors.descricao ? 'error' : ''}
            placeholder="Descreva o andamento..."
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
          {loading ? 'Salvando...' : (andamento ? 'Atualizar' : 'Adicionar Andamento')}
        </button>
      </div>
    </form>
  );
}
