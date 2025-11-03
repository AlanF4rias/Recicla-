
// --- Animação ---
const radPessoa = document.getElementById('radPessoa');
const radEmpresa = document.getElementById('radEmpresa');
const cardPessoa = document.getElementById('cardPessoa');
const cardEmpresa = document.getElementById('cardEmpresa');

function show(section){
  if(section === 'pessoa'){
    animateOutIn(cardEmpresa, cardPessoa);
    radPessoa.setAttribute('aria-checked','true');
    radEmpresa.setAttribute('aria-checked','false');
  } else {
    animateOutIn(cardPessoa, cardEmpresa);
    radPessoa.setAttribute('aria-checked','false');
    radEmpresa.setAttribute('aria-checked','true');
  }
}

function animateOutIn(fromEl, toEl){
  if(!fromEl.classList.contains('hidden')){
    fromEl.classList.add('fade-leave');
    requestAnimationFrame(()=>{
      fromEl.classList.add('fade-leave-active');
      setTimeout(()=>{
        fromEl.classList.add('hidden');
        fromEl.classList.remove('fade-leave','fade-leave-active');
        toEl.classList.remove('hidden');
        toEl.classList.add('fade-enter');
        requestAnimationFrame(()=>{
          toEl.classList.add('fade-enter-active');
          setTimeout(()=>{
            toEl.classList.remove('fade-enter','fade-enter-active');
          }, 300);
        });
      }, 240);
    });
  } else {
    toEl.classList.remove('hidden');
    toEl.classList.add('fade-enter');
    requestAnimationFrame(()=>{
      toEl.classList.add('fade-enter-active');
      setTimeout(()=>{ toEl.classList.remove('fade-enter','fade-enter-active'); }, 300);
    });
  }
}

radPessoa.addEventListener('change', ()=> show('pessoa'));
radEmpresa.addEventListener('change', ()=> show('empresa'));

// --- Envio dos dados para a API ---
document.addEventListener('DOMContentLoaded', () => {
    const formRegistroPessoa = document.getElementById('formPessoa');
    
    formRegistroPessoa.addEventListener('submit', async (evento) => {
        console.log('Evento de submit capturado para Pessoa Física');
        evento.preventDefault();
        // 1. Coleta os dados do formulário
        const nome = document.getElementById('u-nome').value;
        const email = document.getElementById('u-email').value;
        const cpf = document.getElementById('u-cpf').value;
        const telefone = document.getElementById('u-fone').value;
        const senha = document.getElementById('u-senha').value;
        const senhaConf = document.getElementById('u-senhaconf').value;

        // Validação simples de senha
        if (senha.length === 0 || senha !== senhaConf) {
            alert('As senhas não conferem ou estão vazias. Por favor, verifique.');
            return;
        }

        // 2. Monta o objeto JSON
        const dadosUsuario = { nome, email, cpf, telefone, senha, senhaConf };

        try {
            // 3. Envia a requisição para a API
            const resposta = await fetch('http://localhost:3001/api/auth/cadastro/cpf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosUsuario) 
            });

            // 4. Analisa a resposta
            if (resposta.status === 201) {
                alert('Usuário criado com sucesso! Faça o login.');
                window.location.href = '../Login/login.html'; 
            } else {
                const erro = await resposta.json();
                alert(`Erro ao registrar: ${erro.mensagem}`);
            }
        } catch (erro) {
            console.error('Falha na comunicação com a API:', erro);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const formRegistroCNPJ = document.getElementById('formEmpresa');

    formRegistroCNPJ.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        // 1. Coleta os dados do formulário
        const razaoSocial = document.getElementById('e-razao').value;
        const nomeFantasia = document.getElementById('e-fantasia').value;
        const inscEstadual = document.getElementById('e-insc').value;
        const cnpj = document.getElementById('e-cnpj').value;
        const email = document.getElementById('e-email').value;
        const telefone = document.getElementById('e-fone').value;
        const senha = document.getElementById('e-senha').value;
        const senhaConf = document.getElementById('e-senhaconf').value;
        
        // Validação simples de senha
        if (senha.length === 0 || senha !== senhaConf) {
            alert('As senhas não conferem ou estão vazias. Por favor, verifique.');
            return;
        }

        // 2. Monta o objeto JSON
        const dadosUsuario = { 
            razaoSocial, 
            nomeFantasia,
            inscEstadual, 
            cnpj, 
            email, 
            telefone, 
            senha,
            senhaConf 
        };

        try {
            // 3. Envia a requisição para a API
            const resposta = await fetch('http://localhost:3001/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosUsuario)
            });

            // 4. Analisa a resposta
            if (resposta.status === 201) {
                alert('Empresa criada com sucesso! Faça o login.');
                window.location.href = '../Login/login.html'; 
            } else {
                const erro = await resposta.json();
                alert(`Erro ao registrar: ${erro.mensagem}`);
            }
        } catch (erro) {
            console.error('Falha na comunicação com a API:', erro);
        }
    });
});


