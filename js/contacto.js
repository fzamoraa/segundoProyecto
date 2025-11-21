document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario-contacto');
    const modalDatos = document.getElementById('modal-datos');
    const modalConfirmacion = new bootstrap.Modal(document.getElementById('modalConfirmacion'));

    // CLAVE ACTUALIZADA: Clave del sitio de reCAPTCHA V3/Enterprise
    const RECAPTCHA_SITE_KEY = '6LcFJxMsAAAAAC8d5iEYdp8HEHCvrV8w-PhSjnRG';
    const RECAPTCHA_ACTION = 'CONTACT_FORM'; // Acción específica para tu formulario

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Detiene el envío normal del formulario

        if (!validarCamposLocales()) {
            form.classList.add('was-validated');
            return;
        }

        form.classList.remove('was-validated');

        // 1. Ejecutar reCAPTCHA V3 para obtener el token
        if (typeof grecaptcha !== 'undefined' && typeof grecaptcha.enterprise !== 'undefined') {
            grecaptcha.enterprise.ready(function() {
                grecaptcha.enterprise.execute(RECAPTCHA_SITE_KEY, { action: RECAPTCHA_ACTION })
                    .then(function(token) {
                        // 2. Colocar el token en el campo oculto
                        document.getElementById('recaptcha-token').value = token;
                        
                        // 3. Proceder con el envío simulado (mostrar modal)
                        mostrarModalExito(form);
                    });
            });
        } else {
            // Si Google no carga, permitir el envío local.
            console.warn("reCAPTCHA no está cargado. Saltando validación de token.");
            mostrarModalExito(form);
        }
    });

    // Función para validar solo los campos locales (Nombre, Correo, Mensaje)
    function validarCamposLocales() {
        let esValido = true;
        
        // 1. Validación de Nombre
        const nombreInput = document.getElementById('nombre');
        if (nombreInput.value.trim().length < 3) {
            nombreInput.classList.add('is-invalid');
            esValido = false;
        } else {
            nombreInput.classList.remove('is-invalid');
        }

        // 2. Validación de Correo
        const correoInput = document.getElementById('correo');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correoInput.value.trim())) {
            correoInput.classList.add('is-invalid');
            esValido = false;
        } else {
            correoInput.classList.remove('is-invalid');
        }

        // 3. Validación de Mensaje
        const mensajeInput = document.getElementById('mensaje');
        if (mensajeInput.value.trim().length < 10) {
            mensajeInput.classList.add('is-invalid');
            esValido = false;
        } else {
            mensajeInput.classList.remove('is-invalid');
        }

        return esValido;
    }

    // Función que maneja el éxito (muestra el modal)
    function mostrarModalExito(form) {
        const nombre = document.getElementById('nombre').value;
        const correo = document.getElementById('correo').value;
        const asunto = document.getElementById('asunto').value || 'Sin Asunto';
        const mensaje = document.getElementById('mensaje').value;

        modalDatos.innerHTML = `
            <p><strong>De:</strong> ${nombre}</p>
            <p><strong>Correo:</strong> ${correo}</p>
            <p><strong>Asunto:</strong> ${asunto}</p>
            <hr>
            <p><strong>Mensaje:</strong></p>
            <p>${mensaje}</p>
        `;

        modalConfirmacion.show();
        form.reset(); 
        document.getElementById('recaptcha-token').value = ''; 
    }
    
    // Para validación en tiempo real (si ya hubo un error)
    const inputs = form.querySelectorAll('input:not([type="submit"]), textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (form.classList.contains('was-validated')) {
                validarCamposLocales();
            }
        });
    });
});