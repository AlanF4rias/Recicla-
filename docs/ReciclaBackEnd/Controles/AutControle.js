const pool = require('../ConfigBD/BD.js');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = '55753566449173'; 

// Função para gerar o token
const gerarToken = (id, tipo) => {
    return jwt.sign({ id, tipo }, JWT_SECRET, { expiresIn: '8h' });
};

// Registrar CPF
exports.registrarCPF = async (req, res) => {
    const { nome, email, cpf, telefone, senha } = req.body;
    try {
        const hashDaSenha = await bcrypt.hash(senha, 10);
        const [result] = await pool.query(
            "INSERT INTO UsuarioCPF (Nome, Email, CPF, Telefone, SenhaHash) VALUES (?, ?, ?, ?, ?)",
            [nome, email, cpf, telefone, hashDaSenha]
        );
        res.status(201).json({ mensagem: "Usuário CPF criado!", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: "Erro ao registrar CPF", erro: error.code });
    }
};

// Registrar CNPJ (com transação)
exports.registrarCNPJ = async (req, res) => {
    const { razaoSocial, nomeFantasia, cnpj, email, telefone, senha } = req.body;

    try {
        // 2. Criptografa a senha
        const hashDaSenha = await bcrypt.hash(senha, 10);

        // 3. Insere diretamente na tabela UsuarioCNPJ
        const [result] = await pool.query(
            "INSERT INTO UsuarioCNPJ (RazaoSocial, NomeFantasia, CNPJ, Email, Telefone, SenhaHash) VALUES (?, ?, ?, ?, ?, ?)",
            [razaoSocial, nomeFantasia, cnpj, email, telefone, hashDaSenha]
        );

        res.status(201).json({ mensagem: "Usuário CNPJ criado com sucesso!", id: result.insertId });

    } catch (error) {
        // Trata erros (ex: email ou CNPJ duplicado)
        console.error(error);
        res.status(500).json({ mensagem: "Erro ao registrar CNPJ", erro: error.code });
    }
};

// Login Unificado
exports.login = async (req, res) => {
    const { email, senha } = req.body;
    try {
        let usuario = null;
        let tipo = null;

        // 1. Procura na tabela CPF
        const [cpfRows] = await pool.query("SELECT * FROM UsuarioCPF WHERE Email = ?", [email]);
        if (cpfRows.length > 0) {
            usuario = cpfRows[0];
            tipo = 'cpf';
        } else {
            // 2. Se não achar, procura na tabela CNPJ
            const [cnpjRows] = await pool.query("SELECT * FROM UsuarioCNPJ WHERE Email = ?", [email]);
            if (cnpjRows.length > 0) {
                usuario = cnpjRows[0];
                tipo = 'cnpj';
            }
        }

        // 3. Se não achou em nenhuma, erro
        if (!usuario) {
            return res.status(401).json({ mensagem: "Email não encontrado." });
        }

        // 4. Verifica a senha
        const senhaValida = await bcrypt.compare(senha, usuario.SenhaHash);
        if (!senhaValida) {
            return res.status(401).json({ mensagem: "Senha inválida." });
        }

        // 5. Gera o token com o ID e o TIPO do usuário
        const token = gerarToken(usuario.ID, tipo);
        res.json({ mensagem: "Login bem-sucedido!", token:token, tipo:tipo, nome: usuario.Nome || usuario.NomeFantasia, pontos: usuario.Pontos || 0 });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: "Erro no servidor durante o login" });
    }
};

// Recuperar senha (gera token e, em produção, enviaria por e-mail)
exports.recuperarSenha = async (req, res) => {
    const { email } = req.body;
    try {
        // Busca em UsuarioCPF
        const [cpfRows] = await pool.query("SELECT ID, Nome FROM UsuarioCPF WHERE Email = ?", [email]);
        if (cpfRows.length === 0) {
            // Busca em UsuarioCNPJ
            const [cnpjRows] = await pool.query("SELECT ID, RazaoSocial, NomeFantasia FROM UsuarioCNPJ WHERE Email = ?", [email]);
            if (cnpjRows.length === 0) {
                return res.status(404).json({ mensagem: "E-mail não encontrado no sistema." });
            }
        }

        // Gera token temporário (apenas para ambiente de desenvolvimento)
        const token = crypto.randomBytes(20).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

        // Aqui você deveria persistir o token em uma tabela de recuperação e enviar por e-mail.
        // Como implementação mínima, retornamos o token na resposta (apenas para desenvolvimento).
        console.log(`Token de recuperação gerado para ${email}: ${token} (expira em ${expiresAt.toISOString()})`);

        return res.json({ mensagem: 'Token de recuperação gerado. Em produção envie este token por e-mail.', token, expiresAt });
    } catch (error) {
        console.error(error);
        // Tratamento mais claro para falha de conexão com o BD
        if (error && error.code === 'ECONNREFUSED') {
            return res.status(503).json({ mensagem: 'Serviço de banco de dados indisponível. Verifique se o MySQL está em execução.' });
        }
        return res.status(500).json({ mensagem: 'Erro ao gerar token de recuperação.' });
    }
};