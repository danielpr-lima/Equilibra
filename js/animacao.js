const quadros = document.querySelectorAll(".quadro-direito, .quadro-esquerdo");
const estrela = document.querySelector(".estrela");
const logo = document.querySelector(".logo");

const tl = gsap.timeline();

tl.from(".logo", {
  duration: 0.8,
  y: 20,
  opacity: 0,
  stagger: 0.1,
}).from(".texto-logo", {
  duration: 0.7,
  x: -30,
  opacity: 0,
  stagger: 0.1,
}, "=0.4")

gsap.from(quadros, {
  duration: 3,
  y: 100,
  opacity: 0,
  stagger: 1,
  ease: "power3.out"
})

// let tween = gsap.to(".imagem", {duration: 3, y: 10, paused: true});

// setTimeout(() => {
//   tween.play();
// }, 100);

// setTimeout(() => {
//   tween.reverse();
// }, 3500); // 3 segundos de duração + 500ms de folga

gsap.to(".imagem", {
  duration: 3, 
  y: 10,
  repeat: -1, 
  yoyo: true, 
  delay: 0.1 // o seu atraso de 100ms
});