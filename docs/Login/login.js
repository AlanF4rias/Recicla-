 
const recSenha = document.getElementById('recSenha');
const recAbre  = document.getElementById('recAbre');
const recFecha = document.getElementById('recFecha');
const recEmail = document.getElementById('recEmail');

function openRecover() {
    recAbre.classList.remove('hidden');
    recAbre.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => recEmail && recEmail.focus(), 250);
    recSenha.textContent = 'Fechar recuperação';
}

function closeRecover() {
    recAbre.classList.add('hidden');
    recSenha.textContent = 'Esqueceu a senha?';
    recSenha.focus();
}

recSenha.addEventListener('click', () => {
    const isHidden = recAbre.classList.contains('hidden');
    if (isHidden) openRecover(); else closeRecover();
});