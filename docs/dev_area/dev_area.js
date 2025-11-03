function calcularPontos() {
    const valores = {
        pet: 5,        
        lata: 10,      
        eletronicos: 50, 
        papelao: 2     
    };

    const qtdePet = parseInt(document.getElementById('pet').value) || 0;
    const qtdeLata = parseInt(document.getElementById('lata').value) || 0;
    const qtdeEletronicos = parseInt(document.getElementById('eletronicos').value) || 0;
    const qtdePapelao = parseInt(document.getElementById('papelao').value) || 0;

    const pontosPet = qtdePet * valores.pet;
    const pontosLata = qtdeLata * valores.lata;
    const pontosEletronicos = qtdeEletronicos * valores.eletronicos;
    const pontosPapelao = qtdePapelao * valores.papelao;

    const totalPontos = pontosPet + pontosLata + pontosEletronicos + pontosPapelao;

    document.getElementById('total-pontos').textContent = totalPontos;
}
    
document.addEventListener('DOMContentLoaded', () => {
    calcularPontos(); 
    
    const campos = ['pet', 'lata', 'eletronicos', 'papelao'];

    campos.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', calcularPontos);
        }
    });

    const form = document.getElementById('form-coleta');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const emailUsuario = document.getElementById('emailPontos').value;
        const totalPontos = parseInt(document.getElementById('total-pontos').textContent);
        const token = localStorage.getItem('token'); // Pega o token do CNPJ/Dev logado

        if (!token) {
            alert('Erro: Você não está logado.');
            return;
        }
        if (!emailUsuario || totalPontos <= 0) { 
            alert('Por favor, preencha o email do usuário e adicione materiais.');
            return;
        }

        const dadosParaEnviar = {
            emailUsuario: emailUsuario,
            pontos: totalPontos,
            descricao: 'Pontos adicionados via Coleta'
        };

        try {
            const resposta = await fetch('http://localhost:3001/api/pontos/dar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dadosParaEnviar)
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                alert(resultado.mensagem);
                form.reset(); 
                calcularPontos(); 
            } else {
                alert(`Erro: ${resultado.mensagem}`);
            }

        } catch (erro) {
            console.error('Erro ao enviar pontos:', erro);
            alert('Erro de conexão com a API.');
        }
    });
});