const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Serve os arquivos estáticos gerados pelo build do Expo Web
app.use(express.static(path.join(__dirname, '../dist')));

// Redireciona para o index.html, deixando o Expo Router gerenciar a navegação interna.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

module.exports = app;