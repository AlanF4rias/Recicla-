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

    if (form) {
        form.addEventListener('submit', function(event) {
            
            event.preventDefault(); 
            
            console.log("Formulário interceptado! Total de Pontos calculado:", document.getElementById('total-pontos').textContent);
        });
    }
});