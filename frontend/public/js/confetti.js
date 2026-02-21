// 🎉 Confetti / Party Popper Animation
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const confettiPieces = [];
const colors = ['#6C63FF','#FF6584','#FFD700','#43e97b','#4facfe','#f7971e','#fa709a','#fee140'];
const shapes = ['circle', 'rect', 'triangle'];

class Confetti {
  constructor() { this.reset(true); }

  reset(initial = false) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height * -1 : -20;
    this.size = Math.random() * 10 + 5;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.shape = shapes[Math.floor(Math.random() * shapes.length)];
    this.speedY = Math.random() * 3 + 2;
    this.speedX = (Math.random() - 0.5) * 3;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 8;
    this.opacity = 1;
    this.gravity = 0.05;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.speedY += this.gravity;
    this.rotation += this.rotationSpeed;
    if (this.y > canvas.height + 20) this.reset();
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    if (this.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.shape === 'rect') {
      ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -this.size / 2);
      ctx.lineTo(this.size / 2, this.size / 2);
      ctx.lineTo(-this.size / 2, this.size / 2);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
}

let animating = false;
let animationId;
let frame = 0;

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiPieces.forEach(p => { p.update(); p.draw(); });
  frame++;
  // Stop after ~4 seconds (240 frames)
  if (frame < 240) {
    animationId = requestAnimationFrame(animate);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiPieces.length = 0;
    animating = false;
    frame = 0;
  }
}

window.fireConfetti = function() {
  if (animating) {
    cancelAnimationFrame(animationId);
    confettiPieces.length = 0;
    frame = 0;
  }
  animating = true;

  // Create 150 pieces
  for (let i = 0; i < 150; i++) {
    confettiPieces.push(new Confetti());
  }

  animate();
};
