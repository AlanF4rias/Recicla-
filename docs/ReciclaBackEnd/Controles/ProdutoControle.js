const pool = require('../config/db');

// CNPJ cadastra um produto novo
exports.cadastrarProduto = async (req, res) => {
    const { nome, descricao, pontosPorUnidade, estoque } = req.body;
    // O ID do CNPJ vem do token que o Autmeio validou
    const cnpjId = req.usuario.id; 

    try {
        // 1. Insere o produto na tabela geral 'Produto'
        const [produtoResult] = await pool.query(
            "INSERT INTO Produto (Nome, Descricao, PontosPorUnidade, Estoque) VALUES (?, ?, ?, ?)",
            [nome, descricao, pontosPorUnidade, estoque]
        );
        const produtoId = produtoResult.insertId;

        // 2. Vincula esse produto ao CNPJ que o cadastrou na tabela 'OfertaProduto'
        await pool.query(
            "INSERT INTO OfertaProduto (Produto_ID, UsuarioCNPJ_ID, ValorPontos) VALUES (?, ?, ?)",
            [produtoId, cnpjId, pontosPorUnidade]
        );

        res.status(201).json({ mensagem: "Produto cadastrado e ofertado com sucesso!", produtoId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: "Erro ao cadastrar produto" });
    }
};

// CPF resgata um produto
exports.resgatarProduto = async (req, res) => {
    const { produtoId } = req.body;
    const usuarioCpfId = req.usuario.id; // Vem do token

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1. Busca os dados do produto (pontos e estoque) e os pontos do usuário
        const [produtoRows] = await connection.query("SELECT * FROM Produto WHERE ID = ?", [produtoId]);
        const [usuarioRows] = await connection.query("SELECT * FROM UsuarioCPF WHERE ID = ?", [usuarioCpfId]);

        if (produtoRows.length === 0) throw new Error("Produto não encontrado");
        if (usuarioRows.length === 0) throw new Error("Usuário não encontrado");

        const produto = produtoRows[0];
        const usuario = usuarioRows[0];

        // 2. Valida se o usuário tem pontos e se há estoque
        if (usuario.Pontos < produto.PontosPorUnidade) {
            throw new Error("Pontos insuficientes para o resgate.");
        }
        if (produto.Estoque <= 0) {
            throw new Error("Produto fora de estoque.");
        }

        // 3. Executa as atualizações (perder pontos e diminuir estoque)
        const pontosGastos = produto.PontosPorUnidade;
        await connection.query(
            "UPDATE UsuarioCPF SET Pontos = Pontos - ? WHERE ID = ?",
            [pontosGastos, usuarioCpfId]
        );

        await connection.query(
            "UPDATE Produto SET Estoque = Estoque - 1 WHERE ID = ?",
            [produtoId]
        );

        // 4. Registra a transação em ResgateProduto
        await connection.query(
            "INSERT INTO ResgateProduto (UsuarioCPF_ID, Produto_ID, PontosGastos, StatusResgate) VALUES (?, ?, ?, ?)",
            [usuarioCpfId, produtoId, pontosGastos, 'CONCLUIDO']
        );

        await connection.commit(); // Confirma
        res.json({ mensagem: "Produto resgatado com sucesso!" });

    } catch (error) {
        if (connection) await connection.rollback(); // Desfaz
        console.error(error);
        res.status(500).json({ mensagem: error.message || "Erro ao resgatar produto" });
    } finally {
        if (connection) connection.release();
    }
};

// Lista todos os produtos
exports.listarProdutos = async (req, res) => {
    try {
        const [produtos] = await pool.query(
            `SELECT p.ID, p.Nome, p.Descricao, p.PontosPorUnidade, p.Estoque, u.NomeFantasia AS OfertadoPor
             FROM Produto p
             JOIN OfertaProduto op ON p.ID = op.Produto_ID
             JOIN UsuarioCNPJ u ON op.UsuarioCNPJ_ID = u.ID
             WHERE p.Estoque > 0`
        );
        res.json(produtos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: "Erro ao listar produtos" });
    }
};