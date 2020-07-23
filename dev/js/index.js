const sizes = document.querySelectorAll('.size');
const colors = document.querySelectorAll('.color');
const shoes = document.querySelectorAll('.shoe');
const gradients = document.querySelectorAll('.gradient');
const price = document.querySelector('.price h1');

const prices = {
  7: 173.99,
  8: 178.99,
  9: 189.99,
  10: 210.99,
  11: 215.99
};

let prevColor = "blue";
let animationEnd = true;

function changeSize() {
  sizes.forEach(size => size.classList.remove('active'));
  this.classList.add('active');

  price.textContent = prices[this.textContent];
}
sizes.forEach(size => size.addEventListener('click',changeSize));


function changeColor() {
  if(!animationEnd) {
    return;
  }
  let primary = this.getAttribute('primary');
  let color = this.getAttribute('color');
  let gradient = document.querySelector(`.gradient[color="${color}"]`);
  let prevGradient = document.querySelector(`.gradient[color="${prevColor}"]`);
  
  if(color == prevColor) return;

  colors.forEach(color => color.classList.remove('color-active'));
  this.classList.add('color-active');

  document.documentElement.style.setProperty('--color-primary',primary);

  let shoe = document.querySelector(`.shoe[color="${color}"]`);
  shoes.forEach(s => s.classList.remove('shoe-selected'));
  shoe.classList.add('shoe-selected');

  gradients.forEach(g => g.classList.remove('first','second'));
  gradient.classList.add('first');
  prevGradient.classList.add('second');

  prevColor = color;
  animationEnd = false;

  gradient.addEventListener('animationend', () => {
    animationEnd = true;
  })
}
colors.forEach(color => color.addEventListener('click',changeColor));