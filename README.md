# Gasolink API Backend

Este repositório contém o backend do projeto **Gasolink**, feito com **Firebase Cloud Functions (Gen2)**, Node.js 20, Express e Firestore. A API está pronta para receber, atualizar, deletar e listar dados dos postos.

---

## 🔗 URL da API

```
https://us-central1-gasolink.cloudfunctions.net/api
```

Rotas disponíveis:

- `GET /receber/postos` → Retorna todos os postos cadastrados  
- `POST /enviar/postos` → Cadastra um novo posto  
- `PUT /atualizar/postos/:id` → Atualiza um posto pelo ID  
- `DELETE /deletar/postos/:id` → Deleta um posto pelo ID  

---

## 💻 Pré-requisitos

- Node.js >= 20  
- NPM  
- Firebase CLI  
- Conta Firebase com projeto Gasolink  
- Plano Blaze ativo para Cloud Functions Gen2  

---

##  Instalação

1. Clone o repositório:

```bash
git clone <seu-repositorio>
cd gasolink-api
```

2. Entre na pasta `functions` e instale dependências:

```bash
cd functions
npm install
```

---

## ⚙️ Configuração do Firebase

1. Inicialize funções Firebase (caso ainda não tenha feito):

```bash
firebase init functions
```

Escolha:

- Linguagem: **JavaScript**
- ESLint: **Yes**
- Dependências: **Y**

2. Configure `package.json` (exemplo já funcional):

```json
{
  "name": "functions",
  "scripts": {
    "lint": "eslint .",
    "serve": "firebase emulators:start --only functions",
    "shell": "firebase functions:shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "main": "index.js",
  "engines": {
    "node": "20"
  },
  "dependencies": {
    "cors": "^2.8.6",
    "express": "^5.2.1",
    "firebase-admin": "^14.0.0",
    "firebase-functions": "^7.0.0"
  }
}
```

3. Configure `firebase.json` para Gen2 e sem predeploy de lint:

```json
{
  "functions": [
    {
      "source": "functions",
      "codebase": "default",
      "disallowLegacyRuntimeConfig": true,
      "ignore": [
        "node_modules",
        ".git",
        "firebase-debug.log",
        "firebase-debug.*.log",
        "*.local"
      ]
    }
  ]
}
```

---

##  Código principal `functions/index.js`

```javascript
const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

setGlobalOptions({ maxInstances: 10 });

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/receber/postos", async (req, res) => {
  const snapshot = await db.collection("postos").get();
  const dados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(dados);
});

app.post("/enviar/postos", async (req, res) => {
  const novo = await db.collection("postos").add(req.body);
  res.json({ status: "criado", id: novo.id });
});

app.put("/atualizar/postos/:id", async (req, res) => {
  await db.collection("postos").doc(req.params.id).update(req.body);
  res.json({ status: "atualizado" });
});

app.delete("/deletar/postos/:id", async (req, res) => {
  await db.collection("postos").doc(req.params.id).delete();
  res.json({ status: "deletado" });
});

exports.api = onRequest(app);
```

---

## 🚀 Comandos úteis

- Rodar emulador local:

```bash
npm run serve
```

- Rodar shell do Firebase Functions:

```bash
npm run shell
```

- Ver logs da função:

```bash
npm run logs
```

- Deploy do backend:

```bash
firebase deploy
```

---

##  Observações

- Node.js 20 é usado pois Node 18 foi descontinuado.  
- Firebase Functions Gen2 permite maior escalabilidade e não trava como Gen1.  
- API está pronta para receber requisições GET, POST, PUT e DELETE.  

---

##  Licença

MIT License

