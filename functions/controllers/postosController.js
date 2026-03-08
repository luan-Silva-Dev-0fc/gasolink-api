const admin = require("firebase-admin");
const db = admin.firestore();

exports.getPostos = async (req, res) => {
  try {
    const snapshot = await db.collection("postos").get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPosto = async (req, res) => {
  try {
    const novo = await db.collection("postos").add(req.body);
    res.json({ status: "criado", id: novo.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePosto = async (req, res) => {
  try {
    await db.collection("postos").doc(req.params.id).update(req.body);
    res.json({ status: "atualizado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePosto = async (req, res) => {
  try {
    await db.collection("postos").doc(req.params.id).delete();
    res.json({ status: "deletado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
