const { onRequest } = require('firebase-functions/v2/https');
const { setGlobalOptions } = require('firebase-functions/v2');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

setGlobalOptions({ maxInstances: 10 });
admin.initializeApp();

const app = express();
app.use(cors());
app.use(express.json());

// Importando rotas
const postosRoutes = require('./routes/postos');
const usuariosRoutes = require('./routes/usuarios');

// Registrando rotas
app.use('/postos', postosRoutes);
app.use('/usuarios', usuariosRoutes);

exports.api = onRequest(app);