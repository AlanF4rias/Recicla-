function atualizarDisplayPontosGlobal() {
    const pontosSalvos = localStorage.getItem('pontosUsuario');
    const pontosParaExibir = pontosSalvos || 0;

    // Atualiza os pontos na página home.html (se existir)
    const elementoPontosHome = document.getElementById('pontosHome');
    if (elementoPontosHome) {
        elementoPontosHome.innerText = pontosParaExibir;
    }

    // Atualiza os pontos na página premios.html (se existir)
    const elementoPontosPremios = document.getElementById('pontos-usuario'); 
    if (elementoPontosPremios) {
        elementoPontosPremios.innerText = `${pontosParaExibir} pts`;
    }

    // Retorna o valor numérico dos pontos para outros scripts usarem
    return parseInt(pontosParaExibir);
}

// Executa a função assim que a página carregar
document.addEventListener('DOMContentLoaded', atualizarDisplayPontosGlobal);