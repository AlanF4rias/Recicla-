const pool = require('../config/db');

// CNPJ dá pontos para um CPF
exports.darPontos = async (req, res) => {
    const { emailCpf, pontos, descricao } = req.body;
    const cnpjId = req.usuario.id;

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1. Encontrar o ID do usuário CPF pelo email
        const [cpfRows] = await connection.query("SELECT ID FROM UsuarioCPF WHERE Email = ?", [emailCpf]);
        if (cpfRows.length === 0) {
            throw new Error("Usuário CPF não encontrado com este email.");
        }
        const cpfId = cpfRows[0].ID;

        // 2. Atualizar os pontos do usuário CPF
        await connection.query(
            "UPDATE UsuarioCPF SET Pontos = Pontos + ? WHERE ID = ?",
            [pontos, cpfId]
        );

        // 3. Registrar a transação em RecebePontos
        await connection.query(
            "INSERT INTO RecebePontos (UsuarioCPF_ID, UsuarioCNPJ_ID, PontosRecebidos, Descricao) VALUES (?, ?, ?, ?)",
            [cpfId, cnpjId, pontos, descricao]
        );

        await connection.commit();
        res.json({ mensagem: `${pontos} pontos adicionados com sucesso a ${emailCpf}` });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ mensagem: error.message || "Erro ao creditar pontos" });
    } finally {
        if (connection) connection.release();
    }
};

// CPF vê seu extrato
exports.verExtrato = async (req, res) => {
    const cpfId = req.usuario.id;
    try {
        // Busca os pontos recebidos
        const [recebidos] = await pool.query(
            `SELECT r.DataRecebimento, r.PontosRecebidos, r.Descricao, u.NomeFantasia 
             FROM RecebePontos r
             JOIN UsuarioCNPJ u ON r.UsuarioCNPJ_ID = u.ID
             WHERE r.UsuarioCPF_ID = ? ORDER BY r.DataRecebimento DESC`,
            [cpfId]
        );

        // Busca os pontos gastos
        const [gastos] = await pool.query(
            `SELECT r.DataResgate, r.PontosGastos, p.Nome AS Produto
             FROM ResgateProduto r
             JOIN Produto p ON r.Produto_ID = p.ID
             WHERE r.UsuarioCPF_ID = ? ORDER BY r.DataResgate DESC`,
            [cpfId]
        );

        // Busca o saldo atual
        const [saldoRows] = await pool.query("SELECT Pontos FROM UsuarioCPF WHERE ID = ?", [cpfId]);

        res.json({ 
            saldo: saldoRows[0].Pontos,
            entradas: recebidos, 
            saidas: gastos 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: "Erro ao buscar extrato" });
    }
};