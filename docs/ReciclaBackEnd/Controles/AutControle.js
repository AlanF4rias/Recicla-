const pool = require('../config/db');
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
    // O body da requisição deve conter o usuário e o endereço
    const { razaoSocial, nomeFantasia, cnpj, email, telefone, senha, endereco } = req.body;
    const { rua, numero, complemento, bairro, cidade, estado, cep } = endereco;

    let connection;
    try {
        connection = await pool.getConnection(); // Pega uma conexão do pool
        await connection.beginTransaction(); // Inicia a transação

        // 1. Insere o Endereço
        const [enderecoResult] = await connection.query(
            "INSERT INTO Endereco (Rua, Numero, Complemento, Bairro, Cidade, Estado, CEP) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [rua, numero, complemento, bairro, cidade, estado, cep]
        );
        const enderecoId = enderecoResult.insertId;

        // 2. Insere o UsuarioCNPJ com o ID do endereço
        const hashDaSenha = await bcrypt.hash(senha, 10);
        await connection.query(
            "INSERT INTO UsuarioCNPJ (RazaoSocial, NomeFantasia, CNPJ, Email, Telefone, SenhaHash, Endereco_ID) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [razaoSocial, nomeFantasia, cnpj, email, telefone, hashDaSenha, enderecoId]
        );

        await connection.commit(); // Confirma a transação
        res.status(201).json({ mensagem: "Usuário CNPJ e Endereço criados!" });

    } catch (error) {
        if (connection) await connection.rollback(); // Desfaz tudo se der erro
        console.error(error);
        res.status(500).json({ mensagem: "Erro ao registrar CNPJ", erro: error.code });
    } finally {
        if (connection) connection.release(); // Libera a conexão de volta pro pool
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
        res.json({ mensagem: "Login bem-sucedido!", token, tipo, nome: usuario.Nome || usuario.NomeFantasia });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: "Erro no servidor durante o login" });
    }
};