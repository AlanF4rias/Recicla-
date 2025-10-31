const express = require('express');
const cors = require('cors');

const AutRotas = require('./Rotas/AutRota');
const ProdutoRotas = require('./Rotas/ProdutoRota');
const PontosRotas = require('./Rotas/PontosRota');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', AutRotas);
app.use('/api/produtos', ProdutoRotas);
app.use('/api/pontos', PontosRotas);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});