// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Crear efecto de partículas holográficas
    createParticles();
    
    // Configurar modales
    setupModal('termsModal', 'termsLink');
    setupModal('privacyModal', 'privacyLink');
    
    // Manejar cambios en el método de pago
    const metodoPago = document.getElementById('metodo_pago');
    const bankDataGroup = document.getElementById('bankDataGroup');
    const mobileTransferInfo = document.getElementById('mobileTransferInfo');
    const cashInfo = document.getElementById('cashInfo');
    
    // Ocultar grupos de información inicialmente
    bankDataGroup.style.display = 'none';
    mobileTransferInfo.style.display = 'none';
    cashInfo.style.display = 'none';
    
    metodoPago.addEventListener('change', function() {
        const selectedMethod = this.value;
        
        // Ocultar todos los grupos primero
        bankDataGroup.style.display = 'none';
        mobileTransferInfo.style.display = 'none';
        cashInfo.style.display = 'none';
        
        // Mostrar el grupo correspondiente
        if (selectedMethod === 'Transferencia bancaria') {
            bankDataGroup.style.display = 'block';
        } else if (selectedMethod === 'Transferencia móvil') {
            mobileTransferInfo.style.display = 'block';
        } else if (selectedMethod === 'Efectivo') {
            cashInfo.style.display = 'block';
        }
    });
    
    // Manejar navegación entre pasos
    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', function() {
            navigateToStep(this, 'next');
        });
    });
    
    document.querySelectorAll('.prev-step').forEach(button => {
        button.addEventListener('click', function() {
            navigateToStep(this, 'prev');
        });
    });
    
    // Configurar el envío del formulario
    document.getElementById('submitBtn').addEventListener('click', submitForm);
    
    // Mejorar la experiencia de usuario en campos del formulario
    setupFormFieldInteractions();
    
    // Configurar observador de intersección para animaciones
    setupIntersectionObserver();
});

/**
 * Crea partículas holográficas para el fondo
 */
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    
    // Limitar la creación de partículas en dispositivos móviles para mejorar el rendimiento
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const actualParticleCount = isMobile ? Math.floor(particleCount / 2) : particleCount;
    
    for (let i = 0; i < actualParticleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Posición aleatoria
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Tamaño aleatorio
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Opacidad aleatoria
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        
        // Color aleatorio (entre azul y morado)
        const hue = Math.random() * 60 + 240; // Entre 240 (azul) y 300 (morado)
        particle.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
        
        // Animación con retraso aleatorio
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        
        particlesContainer.appendChild(particle);
    }
}

/**
 * Muestra una notificación en pantalla
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación (success, error, warning)
 * @param {number} duration - Duración en milisegundos (opcional, default: 5000)
 */
function showNotification(message, type = 'success', duration = 5000) {
    const notification = document.getElementById('notification');
    
    // Cambiar icono según el tipo
    let iconClass;
    switch(type) {
        case 'success':
            iconClass = 'fas fa-check-circle';
            break;
        case 'error':
            iconClass = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            iconClass = 'fas fa-exclamation-triangle';
            break;
        default:
            iconClass = 'fas fa-info-circle';
    }
    
    // Actualizar contenido
    notification.innerHTML = `<i class="${iconClass}"></i><span id="notification-message">${message}</span>`;
    
    // Establecer clase de tipo
    notification.className = `notification ${type} show`;
    
    // Ocultar después del tiempo especificado
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

/**
 * Configura un modal para mostrarse/ocultarse
 * @param {string} modalId - ID del modal
 * @param {string} triggerId - ID del elemento que activa el modal
 */
function setupModal(modalId, triggerId) {
    const modal = document.getElementById(modalId);
    const trigger = document.getElementById(triggerId);
    const closeBtn = modal.querySelector('.modal-close');
    
    // Abrir modal al hacer clic en el trigger
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
    
    // Cerrar modal con el botón de cerrar
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
    
    // Cerrar modal con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Navega entre pasos del formulario
 * @param {HTMLElement} button - Botón que activó la navegación
 * @param {string} direction - Dirección de navegación (next/prev)
 */
function navigateToStep(button, direction) {
    const currentStep = button.closest('.form-step');
    const targetStepNum = button.getAttribute(`data-${direction}`);
    const targetStep = document.querySelector(`.form-step[data-step="${targetStepNum}"]`);
    
    // Validar campos antes de avanzar
    if (direction === 'next' && targetStepNum === '2' && !validateStep1()) {
        return;
    }
    
    if (direction === 'next' && targetStepNum === '3' && !validateStep2()) {
        return;
    }
    
    // Actualizar progreso
    updateProgress(targetStepNum);
    
    // Cambiar pasos
    currentStep.classList.remove('active');
    targetStep.classList.add('active');
    
    // Si es el paso 3, llenar la revisión
    if (targetStepNum === '3') {
        fillReviewSection();
    }
    
    // Desplazarse al inicio del formulario
    targetStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Valida los campos del paso 1 del formulario
 * @returns {boolean} - True si la validación es exitosa
 */
function validateStep1() {
    let isValid = true;
    const requiredFields = ['nombre', 'telefono'];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.style.borderColor = 'var(--danger)';
            isValid = false;
            
            // Agregar animación de error
            field.classList.add('animate__animated', 'animate__headShake');
            setTimeout(() => {
                field.classList.remove('animate__animated', 'animate__headShake');
            }, 1000);
        }
    });
    
    // Validar formato de teléfono
    const telefono = document.getElementById('telefono').value.trim();
    if (telefono && !/^[\+]?[\d\s\-\(\)]{8,}$/.test(telefono)) {
        document.getElementById('telefono').style.borderColor = 'var(--danger)';
        showNotification('Por favor ingresa un número de teléfono válido', 'error');
        isValid = false;
    }
    
    // Validar formato de email si está presente
    const email = document.getElementById('email').value.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('email').style.borderColor = 'var(--danger)';
        showNotification('Por favor ingresa un correo electrónico válido', 'error');
        isValid = false;
    }
    
    if (!isValid) {
        showNotification('Por favor completa los campos obligatorios correctamente', 'error');
        return false;
    }
    
    return true;
}

/**
 * Valida los campos del paso 2 del formulario
 * @returns {boolean} - True si la validación es exitosa
 */
function validateStep2() {
    const metodoPago = document.getElementById('metodo_pago').value;
    const datosPago = document.getElementById('datos_pago').value.trim();
    
    if (!metodoPago) {
        document.getElementById('metodo_pago').style.borderColor = 'var(--danger)';
        showNotification('Por favor selecciona un método de pago', 'error');
        return false;
    }
    
    if (metodoPago === 'Transferencia bancaria' && !datosPago) {
        document.getElementById('datos_pago').style.borderColor = 'var(--danger)';
        showNotification('Por favor ingresa tus datos bancarios', 'error');
        return false;
    }
    
    return true;
}

/**
 * Actualiza la barra de progreso del formulario
 * @param {string} currentStep - Paso actual del formulario
 */
function updateProgress(currentStep) {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active', 'completed');
        
        const stepNum = parseInt(step.getAttribute('data-step'));
        if (stepNum < currentStep) {
            step.classList.add('completed');
        } else if (stepNum == currentStep) {
            step.classList.add('active');
        }
    });
}

/**
 * Llena la sección de revisión con los datos del formulario
 */
function fillReviewSection() {
    document.getElementById('review-nombre').textContent = document.getElementById('nombre').value.trim();
    document.getElementById('review-telefono').textContent = document.getElementById('telefono').value.trim();
    
    const email = document.getElementById('email').value.trim();
    document.getElementById('review-email').textContent = email || 'No proporcionado';
    
    const ubicacion = document.getElementById('ubicacion').value.trim();
    document.getElementById('review-ubicacion').textContent = ubicacion || 'No proporcionada';
    
    const metodoPago = document.getElementById('metodo_pago').value;
    document.getElementById('review-metodo_pago').textContent = metodoPago;
    
    const referencia = document.getElementById('referencia').value;
    document.getElementById('review-referencia').textContent = referencia || 'No especificado';
    
    // Mostrar datos bancarios solo si es transferencia bancaria
    const datosPagoContainer = document.getElementById('review-datos_pago-container');
    if (metodoPago === 'Transferencia bancaria') {
        document.getElementById('review-datos_pago').textContent = document.getElementById('datos_pago').value.trim();
        datosPagoContainer.style.display = 'block';
    } else {
        datosPagoContainer.style.display = 'none';
    }
}

/**
 * Envía el formulario y redirige a WhatsApp
 */
function submitForm() {
    if (!validateStep1() || !validateStep2()) {
        showNotification('Por favor completa todos los campos obligatorios correctamente', 'error');
        return;
    }
    
    // Mostrar indicador de carga
    document.getElementById('loading').classList.add('show');
    
    // Obtener valores del formulario
    const formData = {
        nombre: document.getElementById('nombre').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        email: document.getElementById('email').value.trim() || 'No proporcionado',
        ubicacion: document.getElementById('ubicacion').value.trim() || 'No proporcionada',
        metodo_pago: document.getElementById('metodo_pago').value,
        datos_pago: document.getElementById('datos_pago').value.trim() || 'No requerido',
        referencia: document.getElementById('referencia').value || 'No especificado',
        fecha: new Date().toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    // Crear mensaje estructurado para WhatsApp
    let mensaje = `*SOLICITUD PROGRAMA AFILIADOS HOLOGRÁFICO*%0A%0A` +
                   `*📅 Fecha:* ${formData.fecha}%0A%0A` +
                   `*👤 Datos Personales*%0A` +
                   `• *Nombre:* ${encodeURIComponent(formData.nombre)}%0A` +
                   `• *Teléfono:* ${encodeURIComponent(formData.telefono)}%0A` +
                   `• *Email:* ${encodeURIComponent(formData.email)}%0A` +
                   `• *Ubicación:* ${encodeURIComponent(formData.ubicacion)}%0A%0A` +
                   `*💰 Datos de Pago*%0A` +
                   `• *Método preferido:* ${encodeURIComponent(formData.metodo_pago)}%0A`;
    
    // Agregar datos bancarios solo si es transferencia bancaria
    if (formData.metodo_pago === 'Transferencia bancaria') {
        mensaje += `• *Datos para pago:* ${encodeURIComponent(formData.datos_pago)}%0A%0A`;
    } else {
        mensaje += `%0A`;
    }
    
    mensaje += `*🔎 Referencia*%0A` +
               `• *Cómo nos conoció:* ${encodeURIComponent(formData.referencia)}%0A%0A` +
               `¡Quiero unirme al programa de afiliados holográfico y empezar a ganar el 10%!`;
    
    // URL de WhatsApp
    const whatsappUrl = `https://wa.me/5350369270?text=${mensaje}`;
    
    // Mostrar notificación de éxito
    showNotification('¡Registro completado! Redirigiendo a WhatsApp...');
    
    // Ocultar carga y redirigir después de breve retraso
    setTimeout(() => {
        document.getElementById('loading').classList.remove('show');
        
        // Abrir en nueva pestaña después de breve retraso
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
            document.getElementById('promotorForm').reset();
            
            // Resetear el formulario a paso 1
            document.querySelectorAll('.form-step').forEach(step => {
                step.classList.remove('active');
            });
            document.querySelector('.form-step[data-step="1"]').classList.add('active');
            updateProgress(1);
        }, 500);
    }, 1500);
}

/**
 * Configura interacciones para los campos del formulario
 */
function setupFormFieldInteractions() {
    document.querySelectorAll('input, select').forEach(field => {
        // Resaltar campo al enfocar
        field.addEventListener('focus', function() {
            this.style.borderColor = 'var(--primary)';
            this.style.boxShadow = '0 0 0 3px rgba(0, 247, 255, 0.3)';
        });
        
        // Quitar resaltado al perder foco
        field.addEventListener('blur', function() {
            this.style.borderColor = 'var(--border)';
            this.style.boxShadow = 'none';
        });
        
        // Validación en tiempo real para campos requeridos
        if (field.required) {
            field.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.style.borderColor = 'var(--border)';
                }
            });
        }
    });
    
    // Mejorar accesibilidad del formulario
    document.getElementById('promotorForm').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            const formElements = Array.from(this.elements);
            const currentIndex = formElements.indexOf(e.target);
            
            if (currentIndex < formElements.length - 1) {
                formElements[currentIndex + 1].focus();
            }
        }
    });
}

/**
 * Configura el observador de intersección para animaciones
 */
function setupIntersectionObserver() {
    const animateElements = document.querySelectorAll('.animate__animated');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animation = entry.target.getAttribute('data-animation') || 'fadeInUp';
                entry.target.classList.add(animation);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}