const express = require('express');
const router = express.Router();
const autControle = require('../Controles/AutControle');

// Rota para cadastro de usuárioCPF
router.post('/cadastro/cpf', autControle.registrarCPF);

// Rota para cadastro de usuárioCNPJ
router.post('/cadastro/cnpj', autControle.registrarCNPJ);

// Rota para login unificado
router.post('/login', autControle.login);

// Rota para recuperação de senha
router.post('/recuperarSenha', autControle.recuperarSenha);

module.exports = router;