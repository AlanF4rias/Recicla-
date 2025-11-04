 
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

recFecha.addEventListener('click', closeRecover);


document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const resposta = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok){
            localStorage.setItem('token', dados.token);
            localStorage.setItem('tipoUsuario', dados.tipo);
            localStorage.setItem('nomeUsuario', dados.nome);
            localStorage.setItem('pontosUsuario', dados.pontos || 0);

            if (dados.tipo === 'cpf') {
                alert('Login realizado com sucesso! Redirecionando para a área do usuário CPF.');
                window.location.href = '../user_area/home.html';
            } else if (dados.tipo === 'cnpj') {
                alert('Login realizado com sucesso! Redirecionando para a área do usuário CNPJ.');
                window.location.href = '../dev_area/dev_area.html';
            } else {
                alert('Tipo de usuário desconhecido.');
                window.location.href = '../index.html';
            }
        }else {
            alert(dados.mensagem || 'Falha no login. Verifique suas credenciais.');
        }
    } catch (erro) {
        console.error('Erro durante o login:', erro);
        alert('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente mais tarde.');
    }
});

// Envio do formulário de recuperação de senha
const recForm = document.getElementById('recForm');
if (recForm) {
    recForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('recEmail').value;
        try {
            const resposta = await fetch('http://localhost:3001/api/auth/recuperarSenha', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const dados = await resposta.json();
            if (resposta.ok) {
                // Em desenvolvimento mostramos o token no alert; em produção envie por e-mail
                alert(dados.mensagem + '\nToken (dev): ' + (dados.token || '---'));
                closeRecover();
            } else {
                alert(dados.mensagem || 'Erro ao solicitar recuperação de senha.');
            }
        } catch (err) {
            console.error('Erro ao solicitar recuperação:', err);
            alert('Erro de conexão com a API.');
        }
    });
}