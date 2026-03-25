const quadro1 = document.querySelector('.quadro-esquerdo');
const quadro2 = document.querySelector('.quadro-direito');
const imagem = document.querySelector('.imagem');
let subindo = true;
let posicao = 0;

function animarEntradaQuadros() {
  setTimeout(() => {
    quadro1.classList.add('mostrar');
  }, 700);

  setTimeout(() => {
    quadro2.classList.add('mostrar');
  }, 1400);
}

window.addEventListener('load', animarEntradaQuadros);

setInterval(() => {
    if (subindo) {
        posicao -= 0.5;
        if (posicao <= -20) 
          {
            subindo = false;
          }
    } else {
        posicao += 0.5; 
        if (posicao >= 0) 
          {
            subindo = true; 
          }
    }
    
    imagem.style.transform = `translateY(${posicao}px)`;
}, 20);

