document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Pega os pontos que foram salvos no localStorage
    const pontosSalvos = localStorage.getItem('pontosUsuario');
    const pontosParaExibir = pontosSalvos || 0;

    // Atualiza os pontos na página home.html 
    const elementoPontosHome = document.getElementById('pontos-usuario-home');
    if (elementoPontosHome) {
        elementoPontosHome.innerText = pontosParaExibir;
    }

    // Atualiza os pontos na página premios.html
    const elementoPontosPremios = document.getElementById('pontos-usuario');
    if (elementoPontosPremios) {
        elementoPontosPremios.innerText = `${pontosParaExibir} pts`;
    }

    
});