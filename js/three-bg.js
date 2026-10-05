/**
 * Dental 3D & Particle Canvas Background
 * Interactive constellation of glowing particles & waveform smile arch
 */

class InteractiveBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.numParticles = 60;
    this.mouse = { x: null, y: null, radius: 150 };
    this.time = 0;

    this.init();
    this.bindEvents();
    this.animate();
  }

  init() {
    this.resize();
    this.createParticles();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 30 : this.numParticles;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2 + 1,
        baseX: Math.random() * this.width,
        baseY: Math.random() * this.height,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        color: Math.random() > 0.4 ? 'rgba(0, 240, 181, ' : 'rgba(56, 189, 248, ',
        alpha: Math.random() * 0.5 + 0.15,
        pulseSpeed: Math.random() * 0.02 + 0.005
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  drawWaveform() {
    // Subtle undulating wave representing aesthetic smile arc (Dental Smile Line)
    this.ctx.beginPath();
    this.ctx.lineWidth = 1.5;

    const gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
    gradient.addColorStop(0, 'rgba(0, 240, 181, 0)');
    gradient.addColorStop(0.3, 'rgba(0, 240, 181, 0.08)');
    gradient.addColorStop(0.7, 'rgba(56, 189, 248, 0.08)');
    gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');

    this.ctx.strokeStyle = gradient;

    const centerY = this.height * 0.45;
    const amplitude = 35;
    const frequency = 0.002;

    for (let x = 0; x < this.width; x += 10) {
      const y = centerY + Math.sin(x * frequency + this.time) * amplitude + Math.cos(x * 0.001 - this.time * 0.5) * 15;
      if (x === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.stroke();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.time += 0.015;

    this.drawWaveform();

    // Connect close particles with delicate filaments
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.12;
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(0, 240, 181, ${alpha})`;
          this.ctx.lineWidth = 0.7;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }

    // Draw and update each particle
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around bounds
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      // Mouse interactivity
      if (this.mouse.x !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.x -= (dx / dist) * force * 3;
          p.y -= (dy / dist) * force * 3;
        }
      }

      // Render particle glow
      const currentAlpha = p.alpha + Math.sin(this.time * 2 + i) * 0.1;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color + Math.max(0.05, currentAlpha) + ')';
      this.ctx.fill();
    }

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new InteractiveBackground('canvas-3d');
});
