const express = require('express');
const router = express.Router();
const pontosController = require('../controllers/pontosController');
const { autenticarToken, ehCnpj, ehCpf } = require('../middleware/authMiddleware');

// Rota para um CNPJ dar pontos a um CPF
router.post('/dar', [autenticarToken, ehCnpj], pontosController.darPontos);

// Rota para um CPF ver seu extrato de pontos
router.get('/meuextrato', [autenticarToken, ehCpf], pontosController.verExtrato);

module.exports = router;