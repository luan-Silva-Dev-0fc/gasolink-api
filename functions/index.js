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
  const dados = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
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
