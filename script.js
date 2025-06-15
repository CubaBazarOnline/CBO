// Clase mejorada para manejar notificaciones
class NotificationSystem {
    constructor() {
        this.container = document.getElementById('notificationContainer');
        this.notificationCount = 0;
        this.queue = [];
        this.isShowing = false;
    }

    show({ title, message, type = 'info', duration = 5000 }) {
        const notification = document.createElement('div');
        notification.className = `notification ${type} fade-in`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'assertive');
        
        const icons = {
            info: 'fas fa-info-circle',
            success: 'fas fa-check-circle',
            warning: 'fas fa-exclamation-circle',
            error: 'fas fa-times-circle'
        };

        notification.innerHTML = `
            <div class="notification-icon">
                <span class="${icons[type] || icons.info}" aria-hidden="true"></span>
            </div>
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="notification-close" aria-label="Cerrar notificación">
                <span class="fas fa-times" aria-hidden="true"></span>
            </button>
        `;

        const showNotification = () => {
            this.container.appendChild(notification);
            this.notificationCount++;
            this.isShowing = true;

            setTimeout(() => {
                notification.classList.add('show');
            }, 10);

            const closeNotification = () => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                    this.notificationCount--;
                    this.isShowing = false;
                    this.checkQueue();
                }, 400);
            };

            notification.querySelector('.notification-close').addEventListener('click', closeNotification);

            if (duration > 0) {
                setTimeout(closeNotification, duration);
            }
        };

        if (this.isShowing) {
            this.queue.push(showNotification);
        } else {
            showNotification();
        }
    }

    checkQueue() {
        if (this.queue.length > 0 && !this.isShowing) {
            const nextNotification = this.queue.shift();
            nextNotification();
        }
    }
}

// Clase mejorada para manejar las pestañas
class TabSystem {
    constructor() {
        this.tabsContainer = document.getElementById('tabs');
        this.tabButtons = document.querySelectorAll('.tab-nav button');
        this.currentTab = 0;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.init();
    }

    init() {
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabIndex = parseInt(button.dataset.tab);
                this.goToTab(tabIndex);
            });
            
            // Mejora de accesibilidad con teclado
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const tabIndex = parseInt(button.dataset.tab);
                    this.goToTab(tabIndex);
                }
            });
        });

        // Eventos táctiles para móviles
        this.tabsContainer.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.tabsContainer.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });

        // Eventos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.goToTab(this.currentTab - 1);
            } else if (e.key === 'ArrowRight') {
                this.goToTab(this.currentTab + 1);
            }
        });

        // Inicializar primera pestaña
        this.goToTab(0);
    }

    handleSwipe() {
        const threshold = 50;
        const difference = this.touchStartX - this.touchEndX;
        
        if (difference > threshold) {
            this.goToTab(this.currentTab + 1);
        } else if (difference < -threshold) {
            this.goToTab(this.currentTab - 1);
        }
    }

    goToTab(index) {
        const tabCount = this.tabButtons.length;
        
        if (index < 0) index = 0;
        if (index >= tabCount) index = tabCount - 1;
        
        this.tabsContainer.scrollTo({
            left: this.tabsContainer.clientWidth * index,
            behavior: 'smooth'
        });
        
        this.updateActiveTab(index);
    }

    updateActiveTab(index) {
        if (index === this.currentTab) return;
        
        this.currentTab = index;
        
        // Actualizar botones
        this.tabButtons.forEach((btn, i) => {
            const isActive = i === index;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive);
            btn.setAttribute('tabindex', isActive ? '0' : '-1');
        });
        
        // Actualizar contenido
        document.querySelectorAll('.tab').forEach((tab, i) => {
            if (i === index) {
                tab.removeAttribute('hidden');
                tab.setAttribute('tabindex', '0');
            } else {
                tab.setAttribute('hidden', 'true');
                tab.setAttribute('tabindex', '-1');
            }
        });
    }
}

// Clase mejorada para manejar el tema
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = localStorage.getItem('theme') || 
                           (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Escuchar cambios en las preferencias del sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
}

// Clase mejorada para compartir
class ShareSystem {
    constructor() {
        this.notificationSystem = new NotificationSystem();
        this.init();
    }

    init() {
        document.querySelectorAll('.share-btn').forEach(button => {
            if (button.id !== 'copyLinkBtn') {
                button.addEventListener('click', () => {
                    const social = button.dataset.social;
                    this.shareOnSocial(social);
                });
            }
        });

        document.getElementById('copyLinkBtn').addEventListener('click', this.copyLink.bind(this));
    }

    async shareOnSocial(social) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        let shareUrl = '';

        try {
            if (navigator.share) {
                await navigator.share({
                    title: document.title,
                    text: 'Echa un vistazo a esta plataforma para emprendedores cubanos',
                    url: window.location.href
                });
                return;
            }
        } catch (err) {
            console.log('Error al usar la API de compartir:', err);
        }

        switch(social) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent("Echa un vistazo a esta plataforma para emprendedores cubanos: ")}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'noopener,noreferrer');
            this.notificationSystem.show({
                title: 'Compartir',
                message: `Redirigiendo a ${social.charAt(0).toUpperCase() + social.slice(1)}...`,
                type: 'info'
            });
        }
    }

    async copyLink() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            this.notificationSystem.show({
                title: 'Enlace copiado',
                message: 'El enlace se ha copiado al portapapeles.',
                type: 'success',
                duration: 3000
            });
        } catch (err) {
            this.notificationSystem.show({
                title: 'Error',
                message: 'No se pudo copiar el enlace. Por favor, inténtalo manualmente.',
                type: 'error'
            });
        }
    }
}

// Clase optimizada para partículas
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particlesCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.frameId = null;
        this.init();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', this.debounce(this.resizeCanvas.bind(this), 200);
        this.createParticles();
        this.animate();
    }

    debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles();
    }

    createParticles() {
        const particleCount = Math.min(Math.floor(window.innerWidth / 10), 100);
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: `rgba(0, 247, 255, ${Math.random() * 0.3 + 0.1})`
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            p.x += p.speedX;
            p.y += p.speedY;
            
            if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;
            
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.frameId = requestAnimationFrame(this.animate.bind(this));
    }

    destroy() {
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
        }
    }
}

// Inicialización optimizada
document.addEventListener('DOMContentLoaded', () => {
    // Actualizar año
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Inicializar sistemas
    const notificationSystem = new NotificationSystem();
    new TabSystem();
    new ThemeManager();
    new ShareSystem();
    const particles = new ParticleSystem();
    
    // Mostrar notificación de bienvenida
    setTimeout(() => {
        notificationSystem.show({
            title: 'Bienvenido a CBO', 
            message: 'Explora nuestras herramientas para emprendedores cubanos.', 
            type: 'success',
            duration: 5000
        });
    }, 1000);
    
    // Limpiar al salir
    window.addEventListener('beforeunload', () => {
        particles.destroy();
    });
    
    // Animación de entrada
    const animateElements = () => {
        const elements = document.querySelectorAll('header, .tabs-container, footer');
        elements.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.animation = `fadeIn 0.5s ease forwards ${i * 0.15}s`;
        });
    };
    
    animateElements();
});