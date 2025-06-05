// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

mobileMenuToggle.addEventListener('click', () => {
    const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');
    
    // Actualizar icono
    const icon = mobileMenuToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('active');
            mobileMenuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
        }
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Desplazamiento suave
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Actualizar URL sin recargar
            if (targetId !== '#pricing') {
                history.pushState(null, null, targetId);
            }
        }
    });
});

// Back to top button
const backToTop = document.querySelector('.back-to-top');

const toggleBackToTop = () => {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
};

window.addEventListener('scroll', toggleBackToTop);
toggleBackToTop(); // Verificar estado inicial

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Plan Selector System
document.querySelectorAll('.plan-period').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.plan-period').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        const period = this.dataset.period;
        updatePlanPrices(period);
        
        // Mostrar notificación
        const periodText = period === 'annual' ? 'anual (con descuento)' : 'mensual';
        showNotification(`Mostrando precios ${periodText}`, 'success');
    });
});

function updatePlanPrices(period) {
    document.querySelectorAll('.price').forEach(priceElement => {
        const monthlyPrice = priceElement.dataset.monthly;
        const annualPrice = priceElement.dataset.annual;
        
        if (period === 'annual') {
            priceElement.innerHTML = `${annualPrice} <span class="currency">CUP/año</span>`;
        } else {
            priceElement.innerHTML = `${monthlyPrice} <span class="currency">CUP/mes</span>`;
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const content = notification.querySelector('.notification-content');
    
    notification.className = `notification ${type}`;
    content.textContent = message;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 5000);
}

document.querySelector('.notification-close').addEventListener('click', () => {
    document.getElementById('notification').classList.add('hidden');
});

// Guide System
function showGuide() {
    const guideShown = localStorage.getItem('guideShown');
    if (!guideShown) {
        setTimeout(() => {
            showNotification('¡Haz clic en el botón de formulario flotante para solicitar tu plan!', 'info');
            localStorage.setItem('guideShown', 'true');
        }, 3000);
    }
}

// Observador de intersección para animaciones
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('scale-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.hologram-effect').forEach(el => {
    observer.observe(el);
});

// Actualizar año en el footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Inicializar sistemas
document.addEventListener('DOMContentLoaded', () => {
    showGuide();
});