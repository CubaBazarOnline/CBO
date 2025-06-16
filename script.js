document.addEventListener('DOMContentLoaded', function() {
  // Configuración inicial
  initTheme();
  initParticles();
  initTabs();
  initShareButtons();
  updateCopyrightYear();
  addHolographicEffects();
  initAnalytics();
  initSmoothScrolling();
  initLazyLoading();
  initPerformanceMonitoring();
});

// Sistema de temas
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Comprobar preferencia del sistema o almacenamiento local
  const currentTheme = localStorage.getItem('theme') || 
                      (prefersDarkScheme.matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  // Actualizar icono según el tema
  updateThemeIcon(currentTheme);
  
  // Escuchar cambios en las preferencias del sistema
  prefersDarkScheme.addListener(e => {
    const newTheme = e.matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
  
  // Manejar el botón de alternar tema
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    showNotification(`Modo ${newTheme === 'dark' ? 'oscuro' : 'claro'} activado`);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#themeToggle i');
  icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Sistema de partículas
function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const particleCount = window.innerWidth < 768 ? 50 : 100;
  
  // Crear partículas
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: Math.random() * 1 - 0.5,
      speedY: Math.random() * 1 - 0.5,
      color: `rgba(66, 153, 225, ${Math.random() * 0.5 + 0.1})`
    });
  }
  
  // Animación de partículas
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      // Actualizar posición
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Rebotar en los bordes
      if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      
      // Dibujar partícula
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
      
      // Dibujar conexiones
      particles.forEach(other => {
        const distance = Math.sqrt(
          Math.pow(particle.x - other.x, 2) + 
          Math.pow(particle.y - other.y, 2)
        );
        
        if (distance < 100) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(66, 153, 225, ${1 - distance/100})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(animateParticles);
  }
  
  animateParticles();
  
  // Redimensionar canvas
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Sistema de pestañas
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-nav button');
  const tabContents = document.querySelectorAll('.tab');
  
  tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      // Actualizar botones
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
        btn.setAttribute('tabindex', '-1');
      });
      
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');
      button.removeAttribute('tabindex');
      
      // Actualizar contenido
      tabContents.forEach(content => {
        content.hidden = true;
      });
      
      const selectedTab = document.querySelector(`.tab[data-tab-content="${index}"]`);
      selectedTab.hidden = false;
      
      // Efecto de transición
      selectedTab.style.animation = 'none';
      setTimeout(() => {
        selectedTab.style.animation = 'fadeIn 0.5s ease forwards';
      }, 10);
    });
    
    // Navegación con teclado
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
      
      // Navegación con flechas
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (index + 1) % tabButtons.length;
        tabButtons[nextIndex].focus();
        tabButtons[nextIndex].click();
      }
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (index - 1 + tabButtons.length) % tabButtons.length;
        tabButtons[prevIndex].focus();
        tabButtons[prevIndex].click();
      }
    });
  });
  
  // Activar la primera pestaña por defecto
  if (tabButtons.length > 0) {
    tabButtons[0].click();
  }
}

// Botones para compartir
function initShareButtons() {
  const shareButtons = document.querySelectorAll('.share-btn');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const pageUrl = window.location.href;
  
  // Compartir en redes sociales
  shareButtons.forEach(button => {
    if (button.id !== 'copyLinkBtn') {
      button.addEventListener('click', () => {
        const social = button.getAttribute('data-social');
        let shareUrl;
        
        switch(social) {
          case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
            break;
          case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent('Descubre la plataforma CBO para emprendedores cubanos')}`;
            break;
        }
        
        window.open(shareUrl, '_blank', 'width=600,height=400');
      });
    }
  });
  
  // Copiar enlace
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(pageUrl).then(() => {
        showNotification('Enlace copiado al portapapeles');
      }).catch(err => {
        console.error('Error al copiar: ', err);
        showNotification('Error al copiar el enlace', 'error');
      });
    });
  }
}

// Notificaciones
function showNotification(message, type = 'success') {
  const container = document.getElementById('notificationContainer');
  if (!container) return;
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  container.appendChild(notification);
  
  // Eliminar después de animación
  setTimeout(() => {
    notification.remove();
  }, 3500);
}

// Año de copyright
function updateCopyrightYear() {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Efectos holográficos adicionales
function addHolographicEffects() {
  const elements = document.querySelectorAll('.cta-button, .tab-nav button, .social-link');
  
  elements.forEach(el => {
    el.classList.add('neon-effect');
    
    // Efecto de hover adicional
    el.addEventListener('mouseenter', () => {
      el.style.transform = 'scale(1.05)';
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

// Analytics
function initAnalytics() {
  if (typeof gtag !== 'undefined') {
    // Track page views
    gtag('config', 'G-XXXXXX', {
      'page_title': document.title,
      'page_location': window.location.href,
      'page_path': window.location.pathname
    });
    
    // Track interactions
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('click', () => {
        gtag('event', 'click', {
          'event_category': 'Interaction',
          'event_label': el.textContent.trim() || el.getAttribute('aria-label') || 'Unknown'
        });
      });
    });
  }
}

// Desplazamiento suave
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Carga diferida de imágenes
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.removeAttribute('loading');
          observer.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }
}

// Monitoreo de rendimiento
function initPerformanceMonitoring() {
  if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log(`[Performance] ${entry.name}: ${entry.duration.toFixed(2)}ms`);
      }
    });
    
    perfObserver.observe({ entryTypes: ['measure', 'resource', 'navigation', 'paint'] });
    
    // Medir tiempo de carga inicial
    performance.mark('pageLoaded');
    performance.measure('Page Load Time', 'navigationStart', 'pageLoaded');
  }
  
  // Reportar errores no capturados
  window.addEventListener('error', (event) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        'description': event.message,
        'fatal': true
      });
    }
  });
}