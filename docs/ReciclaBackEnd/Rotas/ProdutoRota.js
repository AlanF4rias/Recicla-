const express = require('express');
const router = express.Router();
const produtoController = require('../Controles/ProdutoControle');
const { autenticarToken, ehCnpj, ehCpf } = require('../AutenticacaoMeio/AutMeio');

// Rota para um CNPJ cadastrar um NOVO produto no catálogo geral
// (autenticarToken E ehCnpj garantem que só um CNPJ logado pode fazer isso)
router.post('/cadastrar', [autenticarToken, ehCnpj], produtoController.cadastrarProduto);

// Rota para um CPF resgatar um produto
router.post('/resgatar', [autenticarToken, ehCpf], produtoController.resgatarProduto);

// Rota para listar todos os produtos disponíveis
router.get('/listar', autenticarToken, produtoController.listarProdutos);

module.exports = router;