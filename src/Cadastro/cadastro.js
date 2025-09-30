
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
