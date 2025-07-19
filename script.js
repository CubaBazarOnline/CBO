document.addEventListener('DOMContentLoaded', function() {
  // Configuración inicial
  try {
    initTheme();
    initParticles();
    initTabs();
    initShareButton();
    updateCopyrightYear();
    initContactButton();
    initInstallPrompt();
    animateStats();
  } catch (error) {
    console.error('Error en la inicialización:', error);
    showNotification('Error al cargar la aplicación', 'error');
  }
});

// Sistema de temas
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  const currentTheme = localStorage.getItem('theme') || 
                      (prefersDarkScheme.matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  updateThemeIcon(currentTheme);
  
  // Actualizar estado ARIA del botón
  themeToggle.setAttribute('aria-pressed', currentTheme === 'dark');
  
  prefersDarkScheme.addListener(e => {
    const newTheme = e.matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    themeToggle.setAttribute('aria-pressed', newTheme === 'dark');
  });
  
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    themeToggle.setAttribute('aria-pressed', newTheme === 'dark');
    showNotification(`Modo ${newTheme === 'dark' ? 'oscuro' : 'claro'} activado`);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#themeToggle i');
  icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Sistema de partículas con manejo de errores
function initParticles() {
  try {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      canvas.style.display = 'none';
      return;
    }
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = window.innerWidth < 768 ? 50 : 100;
    
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
    
    function animateParticles() {
      try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
          particle.x += particle.speedX;
          particle.y += particle.speedY;
          
          if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
          
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
      } catch (error) {
        console.error('Error en animación de partículas:', error);
        canvas.style.display = 'none';
      }
    }
    
    animateParticles();
    
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  } catch (error) {
    console.error('Error al inicializar partículas:', error);
    const canvas = document.getElementById('particlesCanvas');
    if (canvas) canvas.style.display = 'none';
  }
}

// Sistema de pestañas con mejor accesibilidad
function initTabs() {
  try {
    const tabButtons = document.querySelectorAll('.tab-nav button');
    const tabContents = document.querySelectorAll('.tab');
    
    if (tabButtons.length === 0 || tabContents.length === 0) return;
    
    tabButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        setActiveTab(index);
      });
      
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          button.click();
        }
        
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
        
        if (e.key === 'Home') {
          e.preventDefault();
          tabButtons[0].focus();
          tabButtons[0].click();
        }
        
        if (e.key === 'End') {
          e.preventDefault();
          tabButtons[tabButtons.length - 1].focus();
          tabButtons[tabButtons.length - 1].click();
        }
      });
    });
    
    function setActiveTab(index) {
      tabButtons.forEach((btn, i) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
        btn.setAttribute('tabindex', '-1');
      });
      
      tabButtons[index].classList.add('active');
      tabButtons[index].setAttribute('aria-selected', 'true');
      tabButtons[index].removeAttribute('tabindex');
      
      tabContents.forEach(content => {
        content.hidden = true;
      });
      
      const selectedTab = document.querySelector(`.tab[data-tab-content="${index}"]`);
      if (selectedTab) {
        selectedTab.hidden = false;
        selectedTab.style.animation = 'none';
        setTimeout(() => {
          selectedTab.style.animation = 'fadeIn 0.5s ease forwards';
        }, 10);
        selectedTab.focus();
      }
    }
    
    // Activar primera pestaña por defecto
    setActiveTab(0);
  } catch (error) {
    console.error('Error en sistema de pestañas:', error);
  }
}

// Botón para compartir con mejor manejo de errores
function initShareButton() {
  try {
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    if (!copyLinkBtn) return;
    
    const pageUrl = window.location.href;
    
    copyLinkBtn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: 'Plataforma CBO',
          text: 'Conectando emprendedores cubanos con oportunidades globales',
          url: pageUrl
        }).catch(err => {
          console.log('Error al compartir:', err);
          fallbackCopy();
        });
      } else {
        fallbackCopy();
      }
    });
    
    function fallbackCopy() {
      navigator.clipboard.writeText(pageUrl).then(() => {
        showNotification('Enlace copiado al portapapeles');
      }).catch(err => {
        console.error('Error al copiar: ', err);
        // Fallback más antiguo para navegadores que no soportan clipboard API
        const textarea = document.createElement('textarea');
        textarea.value = pageUrl;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          showNotification('Enlace copiado al portapapeles');
        } catch (err) {
          showNotification('Error al copiar el enlace', 'error');
        }
        document.body.removeChild(textarea);
      });
    }
  } catch (error) {
    console.error('Error en botón de compartir:', error);
  }
}

// Botón de contacto
function initContactButton() {
  try {
    const contactBtn = document.getElementById('contactBtn');
    if (!contactBtn) return;
    
    contactBtn.addEventListener('click', () => {
      window.location.href = 'mailto:cubabazaronline@gmail.com?subject=Consulta%20sobre%20CBO&body=Hola%20equipo%20CBO,%20me%20gustaría%20saber%20más%20sobre...';
    });
  } catch (error) {
    console.error('Error en botón de contacto:', error);
  }
}

// Instalación como PWA con mejor manejo
function initInstallPrompt() {
  try {
    let deferredPrompt;
    const installBtn = document.getElementById('installBtn');
    const installFooterBtn = document.getElementById('installBtnFooter');
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      if (installBtn) {
        installBtn.style.display = 'flex';
        installBtn.addEventListener('click', showInstallPrompt);
      }
      if (installFooterBtn) {
        installFooterBtn.style.display = 'flex';
        installFooterBtn.addEventListener('click', showInstallPrompt);
      }
    });
    
    function showInstallPrompt() {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            showNotification('¡Aplicación instalada con éxito!');
          } else {
            showNotification('Instalación cancelada', 'info');
          }
          deferredPrompt = null;
          
          if (installBtn) installBtn.style.display = 'none';
          if (installFooterBtn) installFooterBtn.style.display = 'none';
        });
      } else {
        showNotification('La aplicación ya está instalada o no es compatible', 'info');
      }
    }
    
    window.addEventListener('appinstalled', () => {
      if (installBtn) installBtn.style.display = 'none';
      if (installFooterBtn) installFooterBtn.style.display = 'none';
      showNotification('¡Gracias por instalar nuestra aplicación!');
    });
    
    // Verificar si ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      if (installBtn) installBtn.style.display = 'none';
      if (installFooterBtn) installFooterBtn.style.display = 'none';
    }
  } catch (error) {
    console.error('Error en instalación PWA:', error);
  }
}

// Animación de estadísticas
function animateStats() {
  try {
    const projectsCount = document.getElementById('projectsCount');
    const usersCount = document.getElementById('usersCount');
    
    if (projectsCount && usersCount) {
      animateValue(projectsCount, 0, 50, 2000);
      animateValue(usersCount, 0, 100, 2000);
    }
  } catch (error) {
    console.error('Error en animación de estadísticas:', error);
  }
}

function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value + '+';
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Notificaciones mejoradas
function showNotification(message, type = 'success') {
  try {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    
    container.appendChild(notification);
    
    // Eliminar notificación después de 3.5 segundos
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(20px)';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3500);
  } catch (error) {
    console.error('Error al mostrar notificación:', error);
    // Fallback simple para navegadores muy antiguos
    alert(message);
  }
}

// Año de copyright
function updateCopyrightYear() {
  try {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  } catch (error) {
    console.error('Error al actualizar año de copyright:', error);
  }
}