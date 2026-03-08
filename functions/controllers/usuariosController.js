const admin = require("firebase-admin");
const db = admin.firestore();

const usuariosController = {
  getUsuarios: async (req, res) => {
    try {
      const snapshot = await db.collection("usuarios").get();
      const usuarios = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.json(usuarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar usuários." });
    }
  },

  cadastrarUsuario: async (req, res) => {
    try {
      const { nome, email, telefone, senha } = req.body;
      if (!nome || !email || !telefone || !senha) {
        return res
          .status(400)
          .json({ message: "Todos os campos são obrigatórios." });
      }

      const snapshot = await db
        .collection("usuarios")
        .where("email", "==", email)
        .get();
      if (!snapshot.empty) {
        return res.status(400).json({ message: "E-mail já cadastrado." });
      }

      const novoUsuario = {
        nome,
        email,
        telefone,
        senha,
        criadoEm: new Date(),
        economiaMes: 0,
        abastecidas: 0,
        status: "Pro",
      };

      const docRef = await db.collection("usuarios").add(novoUsuario);
      res.status(201).json({ id: docRef.id, ...novoUsuario });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao cadastrar usuário." });
    }
  },

  atualizarUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, email, telefone, senha } = req.body;
      const usuarioRef = db.collection("usuarios").doc(id);
      await usuarioRef.update({ nome, email, telefone, senha });
      res.json({ message: "Usuário atualizado com sucesso." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar usuário." });
    }
  },

  deletarUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      await db.collection("usuarios").doc(id).delete();
      res.json({ message: "Usuário deletado com sucesso." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao deletar usuário." });
    }
  },

  loginUsuario: async (req, res) => {
    try {
      const { email, senha } = req.body;
      if (!email || !senha)
        return res
          .status(400)
          .json({ message: "E-mail e senha obrigatórios." });

      const snapshot = await db
        .collection("usuarios")
        .where("email", "==", email)
        .where("senha", "==", senha)
        .get();

      if (snapshot.empty)
        return res
          .status(404)
          .json({ message: "Usuário não encontrado ou senha incorreta." });

      const user = snapshot.docs[0].data();
      res.json({ id: snapshot.docs[0].id, ...user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao realizar login." });
    }
  },

  getUsuarioLogado: async (req, res) => {
    try {
      const { id } = req.query;
      if (!id)
        return res.status(400).json({ message: "ID do usuário obrigatório." });

      const doc = await db.collection("usuarios").doc(id).get();
      if (!doc.exists)
        return res.status(404).json({ message: "Usuário não encontrado." });

      const user = doc.data();
      res.json({ id: doc.id, ...user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar usuário logado." });
    }
  },
};

module.exports = usuariosController;
