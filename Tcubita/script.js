// Configuración de Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// Configuración de Web App Manifest
if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('La aplicación se está ejecutando en modo standalone');
}

// Actualizar el año del copyright
document.getElementById('current-year').textContent = new Date().getFullYear();

// Optimización de carga de fuentes
document.fonts.ready.then(() => {
    document.body.classList.add('fonts-loaded');
});

// Prefetch para recursos importantes
const prefetchResources = [
    'https://fonts.gstatic.com/s/orbitron/v25/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyxSmxpg.woff2',
    'https://fonts.gstatic.com/s/rajdhani/v15/LDIxapCSOBg7S-QT7p4GM-aUWA.woff2'
];

prefetchResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = resource;
    link.as = 'font';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
});

// Carga diferida de imágenes (si se añaden en el futuro)
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
    
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });
        
        lazyImages.forEach(lazyImage => {
            lazyImageObserver.observe(lazyImage);
        });
    }
});

// Analytics (opcional)
window.addEventListener('load', () => {
    // Aquí se puede añadir código de seguimiento como Google Analytics
    console.log('Página completamente cargada');
});

// Optimización para conexiones lentas
if (navigator.connection) {
    if (navigator.connection.saveData === true || 
        navigator.connection.effectiveType.includes('2g') || 
        navigator.connection.effectiveType.includes('slow-2g')) {
        
        // Reducir animaciones para conexiones lentas
        document.documentElement.style.setProperty('--holographic-glow', 'none');
        document.documentElement.style.setProperty('--holographic-glow-pink', 'none');
        document.documentElement.style.setProperty('--holographic-glow-purple', 'none');
        
        // Desactivar algunas animaciones
        const animatedElements = document.querySelectorAll('[class*="animate-"]');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
        });
    }
}