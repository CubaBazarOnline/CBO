// Variables globales
let currentStep = 1;
const totalSteps = 3;
let formData = {
    nombre: '',
    telefono: '',
    email: '',
    gestor: '',
    plan: 'negocio',
    periodo: 'mensual',
    dominio: '',
    sendMethod: 'whatsapp'
};

// Cache de elementos del DOM
const DOM = {
    nombre: document.getElementById('nombre'),
    telefono: document.getElementById('telefono'),
    email: document.getElementById('email'),
    gestor: document.getElementById('gestor'),
    dominio: document.getElementById('dominio'),
    terminos: document.getElementById('terminos'),
    terminosError: document.getElementById('terminos-error'),
    notification: document.getElementById('notification'),
    summaryPlan: document.getElementById('summary-plan'),
    summaryPeriod: document.getElementById('summary-period'),
    summaryDomain: document.getElementById('summary-domain'),
    summaryTotal: document.getElementById('summary-total')
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar plan negocio por defecto
    selectPlan('negocio');
    selectPeriod('mensual');
    selectSendMethod('whatsapp');
    updateSummary();
    
    // Event listeners para navegación
    document.getElementById('next-1').addEventListener('click', validateStep1);
    document.getElementById('next-2').addEventListener('click', validateStep2);
    document.getElementById('prev-2').addEventListener('click', () => navigateTo(1));
    document.getElementById('prev-3').addEventListener('click', () => navigateTo(2));
    document.getElementById('submit-form').addEventListener('click', submitForm);
    
    // Event listeners para selección de plan y periodo
    document.querySelectorAll('.plan-card').forEach(card => {
        card.addEventListener('click', function() {
            selectPlan(this.dataset.plan);
            updateSummary();
        });
    });
    
    document.querySelectorAll('.period-option').forEach(option => {
        option.addEventListener('click', function() {
            selectPeriod(this.dataset.period);
            updateSummary();
        });
    });
    
    // Event listeners para método de envío
    document.getElementById('send-sms').addEventListener('click', function() {
        selectSendMethod('sms');
    });
    
    document.getElementById('send-email').addEventListener('click', function() {
        selectSendMethod('email');
    });
    
    // Actualizar dominio en resumen
    DOM.dominio.addEventListener('input', function() {
        formData.dominio = this.value;
        updateSummary();
    });
    
    // Campos de formulario
    DOM.nombre.addEventListener('input', function() {
        formData.nombre = this.value.trim();
        clearError(this);
    });
    
    DOM.telefono.addEventListener('input', function() {
        formData.telefono = this.value.trim();
        clearError(this);
    });
    
    DOM.email.addEventListener('input', function() {
        formData.email = this.value.trim();
        clearError(this);
    });
    
    DOM.gestor.addEventListener('input', function() {
        formData.gestor = this.value.trim();
    });
    
    // Términos y condiciones
    document.getElementById('terms-link').addEventListener('click', () => {
        document.getElementById('terms-modal').classList.add('active');
    });
    
    document.getElementById('privacy-link').addEventListener('click', () => {
        document.getElementById('privacy-modal').classList.add('active');
    });
    
    document.getElementById('close-terms-modal').addEventListener('click', () => {
        document.getElementById('terms-modal').classList.remove('active');
    });
    
    document.getElementById('close-privacy-modal').addEventListener('click', () => {
        document.getElementById('privacy-modal').classList.remove('active');
    });
    
    // Cerrar modales al hacer clic fuera
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // Cerrar notificación
    document.querySelector('.notification-close').addEventListener('click', function() {
        DOM.notification.classList.add('hidden');
    });
});

// Funciones de navegación
function navigateTo(step) {
    if (step < 1 || step > totalSteps) return;
    
    // Ocultar paso actual
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.getElementById(`step-${currentStep}-indicator`).classList.remove('active');
    
    // Mostrar nuevo paso
    document.getElementById(`step-${step}`).classList.add('active');
    document.getElementById(`step-${step}-indicator`).classList.add('active');
    
    // Actualizar estado de los indicadores
    for (let i = 1; i <= totalSteps; i++) {
        const indicator = document.getElementById(`step-${i}-indicator`);
        if (i < step) {
            indicator.classList.add('completed');
        } else if (i > step) {
            indicator.classList.remove('completed');
        }
    }
    
    currentStep = step;
    
    // Scroll suave al inicio del paso
    document.getElementById(`step-${step}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Funciones de validación
function validateStep1() {
    let isValid = true;
    
    // Validar nombre
    const nombreError = document.getElementById('nombre-error');
    if (!formData.nombre) {
        showError(DOM.nombre, nombreError, 'Por favor ingrese su nombre completo');
        isValid = false;
    } else {
        clearError(DOM.nombre);
    }
    
    // Validar teléfono
    const telefonoError = document.getElementById('telefono-error');
    if (!formData.telefono) {
        showError(DOM.telefono, telefonoError, 'Por favor ingrese su número de teléfono');
        isValid = false;
    } else if (!/^[0-9+]{8,15}$/.test(formData.telefono)) {
        showError(DOM.telefono, telefonoError, 'Por favor ingrese un número de teléfono válido');
        isValid = false;
    } else {
        clearError(DOM.telefono);
    }
    
    // Validar email si está presente
    const emailError = document.getElementById('email-error');
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        showError(DOM.email, emailError, 'Por favor ingrese un correo electrónico válido');
        isValid = false;
    } else {
        clearError(DOM.email);
    }
    
    if (isValid) {
        navigateTo(2);
    } else {
        showNotification('Por favor complete los campos requeridos correctamente', 'error');
        // Scroll al primer error
        document.querySelector('.has-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function validateStep2() {
    navigateTo(3);
}

function showError(input, errorElement, message) {
    errorElement.textContent = message;
    input.parentElement.parentElement.classList.add('has-error');
    errorElement.style.display = 'block';
}

function clearError(input) {
    const formGroup = input.parentElement.parentElement;
    formGroup.classList.remove('has-error');
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) errorElement.style.display = 'none';
}

// Funciones de selección
function selectPlan(plan) {
    formData.plan = plan;
    
    // Actualizar UI
    document.querySelectorAll('.plan-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.plan === plan) {
            card.classList.add('selected');
        }
    });
    
    // Actualizar precios
    updatePrices();
}

function selectPeriod(period) {
    formData.periodo = period;
    
    // Actualizar UI
    document.querySelectorAll('.period-option').forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.period === period) {
            option.classList.add('selected');
        }
    });
    
    // Actualizar precios
    updatePrices();
}

function selectSendMethod(method) {
    formData.sendMethod = method;
    
    // Actualizar UI
    document.querySelectorAll('.send-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    const submitBtn = document.getElementById('submit-form');
    
    if (method === 'sms') {
        document.getElementById('send-sms').classList.add('selected');
        submitBtn.innerHTML = '<i class="fas fa-sms"></i> Enviar por SMS';
    } else if (method === 'email') {
        document.getElementById('send-email').classList.add('selected');
        submitBtn.innerHTML = '<i class="fas fa-envelope"></i> Enviar por Email';
    } else {
        submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Enviar Solicitud';
    }
}

function updatePrices() {
    const priceElements = document.querySelectorAll('.plan-price');
    
    priceElements.forEach(element => {
        const plan = element.closest('.plan-card').dataset.plan;
        const monthlyPrice = element.dataset.monthly;
        const annualPrice = element.dataset.annual;
        
        if (formData.periodo === 'anual') {
            element.textContent = `${annualPrice} CUP/año`;
        } else {
            element.textContent = `${monthlyPrice} CUP/mes`;
        }
    });
}

// Actualizar resumen
function updateSummary() {
    let planName;
    switch(formData.plan) {
        case 'emprendedor':
            planName = 'Plan Emprendedor';
            break;
        case 'negocio':
            planName = 'Plan Negocio';
            break;
        case 'tienda online':
            planName = 'Plan Tienda Online';
            break;
        default:
            planName = 'Plan Negocio';
    }
    
    DOM.summaryPlan.textContent = planName;
    
    DOM.summaryPeriod.textContent = 
        formData.periodo === 'mensual' ? 'Mensual' : 'Anual (20% desc.)';
    
    DOM.summaryDomain.textContent = 
        formData.dominio ? `${formData.dominio}.cu` : 'No especificado';
    
    // Calcular total
    let total;
    if (formData.plan === 'emprendedor') {
        total = formData.periodo === 'mensual' ? '250,99 CUP' : '2.409,50 CUP';
    } else if (formData.plan === 'negocio') {
        total = formData.periodo === 'mensual' ? '300,99 CUP' : '2.889,50 CUP';
    } else if (formData.plan === 'tienda online') {
        total = formData.periodo === 'mensual' ? '650,99 CUP' : '6.249,50 CUP';
    } else {
        total = formData.periodo === 'mensual' ? '300,99 CUP' : '2.889,50 CUP';
    }
    
    DOM.summaryTotal.textContent = total;
}

// Enviar formulario
function submitForm() {
    // Validar términos y condiciones
    if (!DOM.terminos.checked) {
        DOM.terminosError.style.display = 'block';
        showNotification('Debe aceptar los términos y condiciones', 'error');
        DOM.terminos.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    
    DOM.terminosError.style.display = 'none';
    
    // Construir mensaje
    let message = `*Nueva solicitud de plan CubaHostPro*\n\n`;
    message += `*📌 Información del cliente*\n`;
    message += `*Nombre:* ${formData.nombre}\n`;
    message += `*Teléfono:* ${formData.telefono}\n`;
    if (formData.email) message += `*Email:* ${formData.email}\n`;
    if (formData.gestor) message += `*Gestor/Referencia:* ${formData.gestor}\n`;
    
    message += `\n*📋 Detalles del plan*\n`;
    message += `*Plan:* ${formData.plan === 'emprendedor' ? 'Emprendedor' : formData.plan === 'negocio' ? 'Negocio' : 'Tienda Online'}\n`;
    message += `*Periodo:* ${formData.periodo === 'mensual' ? 'Mensual' : 'Anual (20% desc.)'}\n`;
    if (formData.dominio) message += `*Dominio solicitado:* ${formData.dominio}.cu\n`;
    
    message += `\n*💳 Total a pagar:*\n`;
    if (formData.plan === 'emprendedor') {
        message += formData.periodo === 'mensual' ? '250,99 CUP/mes' : '2.409,50 CUP/año';
    } else if (formData.plan === 'negocio') {
        message += formData.periodo === 'mensual' ? '300,99 CUP/mes' : '2.889,50 CUP/año';
    } else if (formData.plan === 'tienda online') {
        message += formData.periodo === 'mensual' ? '650,99 CUP/mes' : '6.249,50 CUP/año';
    }
    
    // Enviar según método seleccionado
    if (formData.sendMethod === 'sms') {
        sendBySMS(message);
    } else if (formData.sendMethod === 'email') {
        sendByEmail(message);
    } else {
        sendByWhatsApp(message);
    }
}

function sendByWhatsApp(message) {
    // Codificar mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Abrir WhatsApp
    window.open(`https://wa.me/5350369270?text=${encodedMessage}`, '_blank');
    
    // Mostrar notificación de éxito
    showNotification('Formulario completado. Redirigiendo a WhatsApp...', 'success');
}

function sendBySMS(message) {
    // Crear enlace SMS (no todos los dispositivos lo soportan)
    const phoneNumber = '5350369270';
    const smsUri = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    
    // Intentar abrir aplicación de mensajes
    window.location.href = smsUri;
    
    // Mostrar notificación
    showNotification('Abriendo aplicación de mensajes... Complete el envío manualmente.', 'success');
    
    // Fallback si no se abre la aplicación
    setTimeout(() => {
        if (!document.hidden) {
            showNotification('No se pudo abrir la aplicación de mensajes. Por favor envíe un SMS manualmente al 50369270 con los datos del formulario.', 'error');
        }
    }, 1000);
}

function sendByEmail(message) {
    const email = 'cubabazaronline@gmail.com';
    const subject = 'Nueva solicitud de plan CubaHostPro';
    const mailtoUri = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    
    // Abrir cliente de correo
    window.location.href = mailtoUri;
    
    // Mostrar notificación
    showNotification('Abriendo cliente de correo... Complete el envío manualmente.', 'success');
    
    // Fallback si no se abre el cliente
    setTimeout(() => {
        if (!document.hidden) {
            showNotification('No se pudo abrir el cliente de correo. Por favor envíe un email manualmente a cubabazaronline@gmail.com con los datos del formulario.', 'error');
        }
    }, 1000);
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    const notification = DOM.notification;
    const content = notification.querySelector('.notification-content');
    
    notification.className = `notification ${type}`;
    content.textContent = message;
    notification.classList.remove('hidden');
    
    // Posicionar notificación
    notification.style.bottom = `${document.querySelector('.btn-group')?.offsetHeight + 20}px` || '20px';
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 5000);
}