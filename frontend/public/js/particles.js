// Floating particles background
(function() {
  const container = document.getElementById('particles');
  if (!container) return;

  const colors = ['#6C63FF', '#FF6584', '#43e97b', '#f7971e', '#4facfe'];
  const count = 25;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size = Math.random() * 8 + 3;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 8;
    const delay = Math.random() * 10;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${left}%;
      bottom: -10px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      box-shadow: 0 0 ${size * 2}px ${color};
    `;

    container.appendChild(p);
  }
})();
