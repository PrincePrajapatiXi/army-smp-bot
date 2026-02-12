/* ============================================
   ARMY SMP BOT — DASHBOARD SCRIPTS
   Particles, Counters, Reveals, Nav
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavbar();
    initScrollReveal();
    initSmoothScroll();
    fetchStats();
    fetchCommands();
    setInterval(fetchStats, 60000);
});

/* --- Particle Background --- */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0, mouseY = 0;
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.hue = Math.random() > 0.5 ? 260 : 220; // purple or blue
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Gentle mouse interaction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                this.x -= dx * 0.005;
                this.y -= dy * 0.005;
            }

            if (this.x < 0 || this.x > canvas.width ||
                this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 70%, 70%, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    const count = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(124, 58, 237, ${0.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        animationId = requestAnimationFrame(animate);
    }

    animate();
}

/* --- Navbar Scroll Effect --- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close menu on link click
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* --- Smooth Scroll --- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/* --- Scroll Reveal (Intersection Observer) --- */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('[data-reveal]').forEach(el => {
        observer.observe(el);
    });
}

/* --- Animated Counter --- */
function animateCounter(element, target, suffix = '') {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * (target - start) + start);

        element.textContent = current.toLocaleString() + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/* --- Fetch Stats --- */
async function fetchStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();

        const serversEl = document.getElementById('stat-servers');
        const usersEl = document.getElementById('stat-users');
        const commandsEl = document.getElementById('stat-commands');
        const uptimeEl = document.getElementById('stat-uptime');

        if (serversEl) animateCounter(serversEl, data.serverCount || 0);
        if (usersEl) animateCounter(usersEl, data.userCount || 0);
        if (commandsEl) animateCounter(commandsEl, data.commandCount || 0);
        if (uptimeEl) uptimeEl.textContent = data.uptime || '99.9%';

    } catch (error) {
        console.error('Stats fetch failed:', error);
    }
}

/* --- Fetch Commands --- */
async function fetchCommands() {
    const list = document.getElementById('commands-list');
    if (!list) return;

    try {
        const response = await fetch('/api/commands');
        const data = await response.json();

        if (data.commands && data.commands.length > 0) {
            list.innerHTML = data.commands.map(cmd => `
                <div class="command-item" data-reveal>
                    <span class="command-name">/${cmd.name}</span>
                    <span class="command-desc">${cmd.description}</span>
                </div>
            `).join('');

            // Re-observe new elements
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            list.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
        } else {
            list.innerHTML = `
                <div class="command-item">
                    <span class="command-name">/badge</span>
                    <span class="command-desc">View and manage your server badges</span>
                </div>
            `;
        }
    } catch (error) {
        console.error('Commands fetch failed:', error);
        // Fallback
        list.innerHTML = `
            <div class="command-item">
                <span class="command-name">/kick</span>
                <span class="command-desc">Kick a member from the server</span>
            </div>
        `;
    }
}

