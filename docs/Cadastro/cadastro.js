
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

// --- Validação de senhas PESSOA ---
const formPessoa = document.getElementById('formPessoa');
const senhaInputPessoa = document.getElementById('u-senha');
const senhaConfInputPessoa = document.getElementById('u-senhaconf');
const submitPessoaBtn = formPessoa.querySelector('button[type="submit"]');

const erroSenhaElPessoa = document.createElement('p');
erroSenhaElPessoa.textContent = 'As senhas não conferem ou estão vazias. Por favor, verifique.';
erroSenhaElPessoa.className = 'text-red-600 text-sm md:col-span-2 hidden'; 

const buttonContainerPessoa = submitPessoaBtn.parentElement;
formPessoa.insertBefore(erroSenhaElPessoa, buttonContainerPessoa);

formPessoa.addEventListener('submit', function(event) {
    const senha = senhaInputPessoa.value;
    const confirmacao = senhaConfInputPessoa.value;

    if (senha.length === 0 || senha !== confirmacao) {
        event.preventDefault();
        erroSenhaElPessoa.classList.remove('hidden'); 
    } else {
        erroSenhaElPessoa.classList.add('hidden'); 
    }
});

function esconderErroAoDigitarPessoa() {
    if (!erroSenhaElPessoa.classList.contains('hidden')) {
        erroSenhaElPessoa.classList.add('hidden');
    }
}
senhaInputPessoa.addEventListener('input', esconderErroAoDigitarPessoa);
senhaConfInputPessoa.addEventListener('input', esconderErroAoDigitarPessoa);


// --- Validação de senhas EMPRESA ---
const formEmpresa = document.getElementById('formEmpresa');
const senhaInputEmpresa = document.getElementById('e-senha');
const senhaConfInputEmpresa = document.getElementById('e-senhaconf');
const submitBtnEmpresa = formEmpresa.querySelector('button[type="submit"]');

const erroSenhaElEmpresa = document.createElement('p');
erroSenhaElEmpresa.textContent = 'As senhas não conferem ou estão vazias. Por favor, verifique.';
erroSenhaElEmpresa.className = 'text-red-600 text-sm md:col-span-2 hidden'; 


const buttonContainerEmpresa = submitBtnEmpresa.parentElement;
formEmpresa.insertBefore(erroSenhaElEmpresa, buttonContainerEmpresa);

formEmpresa.addEventListener('submit', function(event) {
  
    const senha = senhaInputEmpresa.value;
    const confirmacao = senhaConfInputEmpresa.value;

    if (senha.length === 0 || senha !== confirmacao) {
        event.preventDefault(); 
        erroSenhaElEmpresa.classList.remove('hidden'); 
    } else {
        erroSenhaElEmpresa.classList.add('hidden'); 
    }
});

function esconderErroAoDigitarEmpresa() {
    if (!erroSenhaElEmpresa.classList.contains('hidden')) {
        erroSenhaElEmpresa.classList.add('hidden');
    }
}

senhaInputEmpresa.addEventListener('input', esconderErroAoDigitarEmpresa);
senhaConfInputEmpresa.addEventListener('input', esconderErroAoDigitarEmpresa);


