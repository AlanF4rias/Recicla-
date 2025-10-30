// /middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = '55753566449173';

const autenticarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); // Não autorizado (sem token)
    }

jwt.verify(token, JWT_SECRET, (err, usuario) => {
    if (err) {
        return res.sendStatus(403); // Proibido (token inválido)
    }
    req.usuario = usuario; // Adiciona os dados do usuário à requisição
    next();
});
};

const ehCnpj = (req, res, next) => {
    if (req.usuario.tipo !== 'cnpj') {
        return res.status(403).json({ mensagem: "Acesso restrito a usuários CNPJ." });
    }
    next();
};

const ehCpf = (req, res, next) => {
    if (req.usuario.tipo !== 'cpf') {
        return res.status(403).json({ mensagem: "Acesso restrito a usuários CPF." });
    }
    next();
};

module.exports = { autenticarToken, ehCnpj, ehCpf };