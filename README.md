# ⚖️ Processo Judicial — Frontend

Interface web do sistema de cadastro e gerenciamento de processos judiciais.

**Stack:** React 18 + Vite + Axios

---

## 📋 Sobre

Frontend desenvolvido em React 18 com Vite responsável pela interface visual do sistema. Consome a API REST do backend para todas as operações.

**Repositório do Backend:** [processo-judicial-api](https://github.com/Rodrigo-junqueiraa/processo-judicial-api)

---

## ✅ Funcionalidades

- Listagem de processos com dados principais
- Cadastro, edição e exclusão de processos
- Gerenciamento de andamentos por processo
- Validação de campos no frontend
- Notificações toast com mensagens de retorno da API
- Confirmação antes de excluir
- Interface responsiva

---

## 🖥️ Como rodar — Local

### Pré-requisitos
- Node.js 18+
- Backend rodando em http://localhost:8000

```bash
# Instalar dependências
npm install

# Iniciar o servidor
npm run dev
# Disponível em http://localhost:5173
```

---

## 🐳 Como rodar — Docker

O Docker é orquestrado pelo backend. Clone o repositório do backend e siga as instruções lá:

[processo-judicial-api](https://github.com/Rodrigo-junqueiraa/processo-judicial-api)

```bash
docker compose up -d --build
docker exec processos_api php artisan migrate --force
```

**Disponível em:** http://localhost:5173

---

## 📁 Estrutura

```
processo-judicial-front/
└── src/
    ├── components/
    │   ├── ProcessoForm.jsx      # Formulário de processo
    │   ├── AndamentoForm.jsx     # Formulário de andamento
    │   ├── Modal.jsx             # Modal reutilizável
    │   ├── ToastContainer.jsx    # Notificações
    │   └── ConfirmDialog.jsx     # Confirmação de exclusão
    ├── pages/
    │   ├── ProcessosPage.jsx     # Tela principal
    │   └── AndamentosPage.jsx    # Tela de andamentos
    ├── services/
    │   └── api.js                # Comunicação com a API
    ├── hooks/
    │   └── useToast.js           # Hook de notificações
    └── utils/
        └── ufs.js                # Lista de estados brasileiros
```

---

## 👤 Autor

**Rodrigo Junqueira**
GitHub: [@Rodrigo-junqueiraa](https://github.com/Rodrigo-junqueiraa)
