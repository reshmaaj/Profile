document.addEventListener("DOMContentLoaded", () => {
  const avatar = document.querySelector(".avatar");
  const homeText = document.querySelector(".home-text");

  // Step 1: Show avatar from bottom
  setTimeout(() => {
    avatar.classList.add("show-avatar");
  }, 300);

  // Step 2: Move avatar to right, then show text
  setTimeout(() => {
    avatar.classList.add("move-avatar-right");
  }, 1300);

  setTimeout(() => {
    homeText.classList.add("show-text");
  }, 2500);
});

// Reusable observer function
function createObserver(targets, showClass, delay = 0, hideClass = true) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add(showClass);
        }, delay);
      } else if (hideClass) {
        entry.target.classList.remove(showClass);
      }
    });
  }, { threshold: 0.3 });

  targets.forEach(target => observer.observe(target));
}

// About Section
const aboutAvatar = document.querySelector(".avatar-left");
const aboutText = document.querySelector(".about-text");

createObserver([aboutAvatar], "move-avatar-left", 0);
createObserver([aboutText], "show-about-text", 800);

// Projects
const projects = document.querySelectorAll(".project-container");
createObserver(projects, "show-project", 0);


// const workItems = document.querySelectorAll(".work-item");

// const workObserver = new IntersectionObserver((entries) => {
//   entries.forEach(entry => {
//     if (entry.isIntersecting) {
//       entry.target.classList.add("show-work");
//     } else {
//       entry.target.classList.remove("show-work");
//     }
//   });
// }, { threshold: 0.4 });

// workItems.forEach(item => workObserver.observe(item));

// const timeline = document.querySelector(".timeline-container");
// timeline.addEventListener("wheel", (evt) => {
//   evt.preventDefault();
//   timeline.scrollLeft += evt.deltaY;
// });


(() => {
  const canvas = document.getElementById('bg-dots');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  const COLORS = ['#7f93b2', '#d6cfa1', 'rgba(255,255,255,0.6)'];

  const STATE = {
    dpr: Math.max(1, Math.min(2, window.devicePixelRatio || 1)),
    particles: [],
    mouse: { x: 0, y: 0, has: false },
    reduce: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width  = Math.floor(w * STATE.dpr);
    canvas.height = Math.floor(h * STATE.dpr);
    ctx.setTransform(STATE.dpr, 0, 0, STATE.dpr, 0, 0);

    const target = STATE.reduce ? 40 : Math.min(220, Math.floor(w * h * 0.00012));
    spawnOrTrim(target, w, h);
  }

  function spawnOrTrim(target, w, h) {
    if (STATE.particles.length > target) {
      STATE.particles.length = target;
      return;
    }
    while (STATE.particles.length < target) {
      STATE.particles.push(makeParticle(w, h));
    }
  }

  function makeParticle(w, h) {
    const speed = rand(0.05, 0.25);       
    const angle = rand(0, Math.PI * 2);
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: rand(1.2, 2.8),                 
      color: COLORS[(Math.random() * COLORS.length) | 0],
      baseAlpha: rand(0.35, 0.85),
      pulseSpeed: rand(0.002, 0.008),
      t: Math.random() * 1000
    };
  }

  function tick() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    ctx.clearRect(0, 0, w, h);

    for (const p of STATE.particles) {
      if (STATE.mouse.has) {
        const dx = p.x - STATE.mouse.x;
        const dy = p.y - STATE.mouse.y;
        const d2 = dx*dx + dy*dy;
        const influence = Math.min(1, 14000 / (d2 + 5000)); 
        p.vx += (dx / Math.sqrt(d2 + 1)) * 0.0004 * influence;
        p.vy += (dy / Math.sqrt(d2 + 1)) * 0.0004 * influence;
      }

      p.x += p.vx;
      p.y += p.vy;

      // wrap around edges
      if (p.x < -5) p.x = w + 5; else if (p.x > w + 5) p.x = -5;
      if (p.y < -5) p.y = h + 5; else if (p.y > h + 5) p.y = -5;

      // twinkle
      p.t += p.pulseSpeed;
      const alpha = p.baseAlpha * (0.7 + 0.3 * Math.sin(p.t));

      // draw glow
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 12;
      ctx.shadowColor = p.color;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (!STATE.reduce) requestAnimationFrame(tick);
  }

  // utils
  function rand(a, b) { return a + Math.random() * (b - a); }

  // events
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => {
    STATE.mouse.x = e.clientX;
    STATE.mouse.y = e.clientY;
    STATE.mouse.has = true;
  });
  window.addEventListener('mouseleave', () => (STATE.mouse.has = false));

  // init
  resize();
  if (!STATE.reduce) requestAnimationFrame(tick);
  else {
    // Static render for reduced-motion users
    const w = canvas.clientWidth, h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    for (const p of STATE.particles) {
      ctx.save();
      ctx.globalAlpha = p.baseAlpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
})();


