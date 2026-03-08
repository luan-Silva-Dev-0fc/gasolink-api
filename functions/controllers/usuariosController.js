const admin = require("firebase-admin");
const db = admin.firestore();

// Função genérica para retornar todos usuários (opcional)
exports.getUsuarios = async (req, res) => {
  try {
    const snapshot = await db.collection("usuarios").get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cadastro de usuário
exports.cadastrarUsuario = async (req, res) => {
  const { nome, email, telefone, senha } = req.body;
  if (!nome || !email || !telefone || !senha) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios" });
  }

  try {
    const novoUsuario = await db
      .collection("usuarios")
      .add({ nome, email, telefone, senha });
    res.json({ status: "criado", id: novoUsuario.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
