function createParticles() {
  const particlesContainer = document.createElement('div');
  particlesContainer.id = 'particles';
  particlesContainer.className = 'holographic-particles';
  document.body.appendChild(particlesContainer);

  const particleCount = window.innerWidth < 768 ? 20 : 40;
  const colors = ['var(--hologram-blue)', 'var(--hologram-pink)', 'var(--hologram-purple)'];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    const size = Math.random() * 5 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.bottom = `-10px`;
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.background = randomColor;
    const duration = Math.random() * 25 + 15;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${Math.random() * 10}s`;
    particlesContainer.appendChild(particle);
  }

  const description = document.querySelector('.page-description');
  if (description) {
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('div');
      particle.classList.add('description-particle');
      particle.style.width = `${Math.random() * 4 + 2}px`;
      particle.style.height = particle.style.width;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.animationDuration = `${Math.random() * 5 + 5}s`;
      description.appendChild(particle);
    }
  }
}

function typeWriterEffect() {
  const title = document.querySelector('h1');
  if (!title) return;
  const text = title.textContent;
  title.textContent = '';
  let i = 0;
  const speed = 100;
  
  const type = () => {
    if (i < text.length) {
      title.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  };
  setTimeout(type, 500);
}

function createButtonConnectors() {
  const buttonContainer = document.querySelector('.button-container');
  if (!buttonContainer) return;
  const buttons = buttonContainer.querySelectorAll('.holographic-button');
  if (buttons.length < 2) return;

  const connector1 = document.createElement('div');
  connector1.classList.add('button-connector');
  buttonContainer.appendChild(connector1);

  const connector2 = document.createElement('div');
  connector2.classList.add('button-connector');
  buttonContainer.appendChild(connector2);

  const updateConnectors = () => {
    const rect1 = buttons[0].getBoundingClientRect();
    const rect2 = buttons[1].getBoundingClientRect();
    const rect3 = buttons[2]?.getBoundingClientRect();

    if (window.innerWidth > 768) {
      connector1.style.width = `${rect2.left - rect1.right}px`;
      connector1.style.top = `${rect1.top + rect1.height / 2}px`;
      connector1.style.left = `${rect1.right}px`;
      
      if (rect3) {
        connector2.style.width = `${rect3.left - rect2.right}px`;
        connector2.style.top = `${rect2.top + rect2.height / 2}px`;
        connector2.style.left = `${rect2.right}px`;
      }
    } else {
      connector1.style.width = `2px`;
      connector1.style.height = `${rect2.top - rect1.bottom}px`;
      connector1.style.top = `${rect1.bottom}px`;
      connector1.style.left = `${rect1.left + rect1.width / 2}px`;
      
      if (rect3) {
        connector2.style.width = `2px`;
        connector2.style.height = `${rect3.top - rect2.bottom}px`;
        connector2.style.top = `${rect2.bottom}px`;
        connector2.style.left = `${rect2.left + rect2.width / 2}px`;
      }
    }
  };

  updateConnectors();
  window.addEventListener('resize', updateConnectors);
}

function createSocialConnectors() {
  const socialLinks = document.querySelector('.social-links');
  if (!socialLinks) return;
  const links = socialLinks.querySelectorAll('.social-link');
  if (links.length < 2) return;

  for (let i = 0; i < links.length - 1; i++) {
    const connector = document.createElement('div');
    connector.classList.add('social-connector');
    socialLinks.appendChild(connector);
  }

  const updateConnectors = () => {
    const connectors = document.querySelectorAll('.social-connector');
    for (let i = 0; i < connectors.length; i++) {
      const rect1 = links[i].getBoundingClientRect();
      const rect2 = links[i + 1].getBoundingClientRect();
      connectors[i].style.width = `${rect2.left - rect1.right}px`;
      connectors[i].style.top = `${rect1.top + rect1.height / 2}px`;
      connectors[i].style.left = `${rect1.right}px`;
    }
  };

  updateConnectors();
  window.addEventListener('resize', updateConnectors);
}

class NotificationSystem {
  constructor() {
    this.toast = document.createElement('div');
    this.toast.className = 'notification-toast';
    this.toast.innerHTML = `
      <div class="notification-icon"><i class="fas fa-info-circle"></i></div>
      <div class="notification-content">
        <div class="notification-title" id="notificationToastTitle"></div>
        <div class="notification-message" id="notificationToastMessage"></div>
      </div>
      <button class="notification-close" id="notificationClose" aria-label="Cerrar notificación">&times;</button>
    `;
    document.body.appendChild(this.toast);
    
    this.toastTitle = document.getElementById('notificationToastTitle');
    this.toastMessage = document.getElementById('notificationToastMessage');
    this.closeButton = document.getElementById('notificationClose');
    
    this.setupEventListeners();
    this.checkNotificationPermission();
    this.showWelcomeNotification();
  }

  setupEventListeners() {
    if (!this.closeButton) return;
    this.closeButton.addEventListener('click', () => {
      this.hideToast();
    });

    document.addEventListener('click', (e) => {
      if (this.toast.classList.contains('show') && !this.toast.contains(e.target)) {
        this.hideToast();
      }
    });
  }

  showToast(title, message, duration = 5000) {
    if (!this.toast || !this.toastTitle || !this.toastMessage) return;
    this.toastTitle.textContent = title;
    this.toastMessage.textContent = message;
    this.toast.classList.add('show');
    
    setTimeout(() => {
      this.hideToast();
    }, duration);
  }

  hideToast() {
    if (this.toast) {
      this.toast.classList.remove('show');
    }
  }

  showWelcomeNotification() {
    setTimeout(() => {
      this.showToast(
        'Bienvenido a CBO',
        'Explora nuestros servicios tecnológicos para Cuba'
      );
    }, 2000);
  }

  checkNotificationPermission() {
    if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.showToast(
            'Notificaciones activadas',
            'Recibirás actualizaciones importantes'
          );
        }
      });
    }
  }

  showBrowserNotification(title, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjMDBmN2ZmIiBkPSJNMjU2IDhDMTE5IDggOCAxMTkgOCAyNTZzMTExIDI0OCAyNDggMjQ4IDI0OC0xMTEgMjQ4LTI0OFMzOTMgOCAyNTZiIDh6bTAgNDQ4Yy0xMTAuNSAwLTIwMC04OS41LTIwMC0yMDBTMTQ1LjUgNTYgMjU2IDU2czIwMCA4OS41IDIwMCAyMDAtODkuNSAyMDAtMjAwIDIwMHptNjIuMi0xNDYuMmMtMTguNyAxOC43LTQ5LjEgMTguNy02Ny45IDBsLTY3LjktNjcuOUwxNTMuMyAyNTZsLTY3LjktNjcuOWMtMTguNy0xOC43LTE4Ny00OS4xIDAtNjcuOSAxOC43LTE4LjcgNDkuMS0xOC43IDY3LjkgMGw2Ny45IDY3LjkgNjcuOS02Ny45YzE4LjctMTguNyA0OS4xLTE4LjcgNjcuOSAwIDE4LjcgMTguNyAxOC43IDQ5LjEgMCA2Ny45TDMyOS4zIDI1Nmw2Ny45IDY3LjljMTguNyAxOC43IDE4NyA0OS4xIDAgNjcuOXoiLz48L3N2Zz4="
      });
    }
  }
}

function sharePage() {
  if (navigator.share) {
    navigator.share({
      title: 'CBO - Soluciones para emprendedores cubanos',
      text: 'Descubre los servicios tecnológicos de CBO para emprendedores en Cuba',
      url: 'https://cubabazaronline.github.io/CBO/'
    }).then(() => {
      new NotificationSystem().showToast('¡Gracias por compartir!', 'Tu apoyo ayuda a otros emprendedores');
    }).catch(err => {
      console.error('Error al compartir:', err);
      new NotificationSystem().showToast('Error al compartir', 'Inténtalo de nuevo más tarde');
    });
  } else {
    const url = 'https://cubabazaronline.github.io/CBO/';
    const text = 'Descubre los servicios tecnológicos de CBO para emprendedores en Cuba: ' + url;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        new NotificationSystem().showToast('Enlace copiado', 'Puedes pegarlo donde quieras compartirlo');
      }).catch(err => {
        console.error('Error al copiar:', err);
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
      });
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    createParticles();
    typeWriterEffect();
    createButtonConnectors();
    createSocialConnectors();
    document.querySelector('.container').style.opacity = '1';
  }, 100);

  new NotificationSystem();

  if ('connection' in navigator && (navigator.connection.saveData || navigator.connection.effectiveType.includes('2g'))) {
    document.querySelectorAll('.particle, .description-particle').forEach(particle => {
      particle.style.display = 'none';
    });
  }

  document.querySelector('.container').style.opacity = '0';
  document.querySelector('.container').style.transition = 'opacity 0.5s ease';
  document.getElementById('share-button').addEventListener('click', sharePage);
});

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
      particlesContainer.innerHTML = '';
      createParticles();
    }
  }, 200);
});

window.addEventListener('load', () => {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    document.documentElement.setAttribute('data-pwa', 'true');
  }
});