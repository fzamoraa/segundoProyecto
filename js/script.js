// ==========================================================
// PROYECTO ISW-512: ASISVIAL
// Archivo JavaScript principal para todas las interacciones dinámicas.
// ==========================================================
// Variable global para almacenar la respuesta correcta del Captcha
let respuestaCaptchaCorrecta; 
/**
 * Función genérica para cargar datos desde un archivo JSON local.
 * @param {string} ruta - La ruta relativa al archivo JSON.
 * @returns {Promise<Array>} - Una promesa que resuelve con los datos del JSON.
 */
async function cargarDatosJSON(ruta) {
    try {
        const respuesta = await fetch(ruta);
        if (!respuesta.ok) {
            throw new Error(`Error al cargar el archivo JSON: ${respuesta.statusText}`);
        }
        return await respuesta.json();
    } catch (error) {
        console.error("Error en cargarDatosJSON:", error);
        return [];
    }
}

// ==========================================================
// 1. LÓGICA DE LA PÁGINA DE INICIO (index.html)
// Requisito: Contenido dinámico cargado desde un archivo JSON [cite: 38]
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
    // Solo ejecutar lógica de inicio si estamos en la página de inicio
    if (document.getElementById('planes-cards')) {
        mostrarPlanesEnInicio();
        inicializarInteraccionesInicio(); 
    }
});

/**
 * Muestra los 3 planes principales en el index.html usando el JSON.
 */
async function mostrarPlanesEnInicio() {
    const planes = await cargarDatosJSON('data/planes.json');
    const contenedor = document.getElementById('planes-cards');

    if (!contenedor) return; 

    // Mapear los planes a tarjetas de Bootstrap
    planes.forEach(plan => {
        const tarjetaHTML = `
            <div class="col">
                <div class="card h-100 shadow ${plan.destacado ? 'border-warning border-3' : ''}">
                    <div class="card-body text-center">
                        <h4 class="card-title">${plan.nombre}</h4>
                        <p class="card-text lead text-success">
                            $${plan.precio_mensual} / mes
                        </p>
                        <ul class="list-unstyled text-start mx-auto" style="max-width: 250px;">
                            ${plan.beneficios.map(b => `<li>✅ ${b}</li>`).join('')}
                        </ul>
                        <button class="btn btn-primary mt-3 btn-inicio-info" 
                                data-plan-nombre="${plan.nombre}"
                                onclick="window.location.href='planes.html'">
                                Ver Detalles
                        </button>
                    </div>
                </div>
            </div>
        `;
        contenedor.innerHTML += tarjetaHTML;
    });
}


/**
 * Inicializa las interacciones mínimas de JavaScript para la página de Inicio.
 * Requisitos: Mínimo 2 interacciones con JavaScript[cite: 39].
 */
function inicializarInteraccionesInicio() {
    // 1. Interacción: Cambio de color en botón "Ver Detalles" (Retroalimentación visual simple)
    const botonesInfo = document.querySelectorAll('.btn-inicio-info');
    botonesInfo.forEach(btn => {
        // Al pasar el mouse, cambia el color a un estilo de advertencia.
        btn.addEventListener('mouseover', () => {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-warning');
        });
        // Al quitar el mouse, vuelve al color original.
        btn.addEventListener('mouseout', () => {
            btn.classList.remove('btn-warning');
            btn.classList.add('btn-primary');
        });
    });

    // 2. Interacción: Contador animado de Clientes Satisfechos (Efecto dinámico)
    // Agrega un elemento <p id="contador-clientes" class="display-4 text-primary">0</p> 
    // en tu index.html para que esto funcione.
    const elementoContador = document.getElementById('contador-clientes');
    if (elementoContador) {
        let count = 0;
        const target = 5280; // Número ficticio de clientes
        const duration = 2000; // 2 segundos
        const step = target / (duration / 10); // Cálculo del paso
        
        const timer = setInterval(() => {
            count += step;
            if (count > target) {
                count = target;
                clearInterval(timer);
            }
            elementoContador.textContent = Math.floor(count).toLocaleString('es-CR') + '+';
        }, 10);
    }
}


// ==========================================================
// 2. LÓGICA DE LA PÁGINA ACERCA DE (acerca-de.html)
// Requisito: Contenido dinámico desde JSON, Interacción JS sencilla.
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    // ... (Tu código de index.html, contacto.html y planes.html va aquí) ...

    // Solo ejecutar lógica de autores si estamos en la página acerca-de.html
    if (document.getElementById('autores-container')) {
        mostrarAutores();
    }
});

/**
 * Carga los datos de los autores desde autores.json y los muestra en tarjetas.
 * (Requisito: Cargar parte del contenido dinámicamente desde JSON)
 */
async function mostrarAutores() {
    // Asegúrate de que tienes el archivo data/autores.json creado.
    const autores = await cargarDatosJSON('data/autores.json');
    const contenedor = document.getElementById('autores-container');

    if (!contenedor) return;

    autores.forEach(autor => {
        const tarjetaHTML = `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 text-center shadow-sm autor-card" 
                    data-correo="${autor.correo}" 
                    style="cursor: pointer;">
                    <img src="${autor.foto || 'img/placeholder.jpg'}" 
                        class="card-img-top mx-auto mt-3 rounded-circle" 
                        alt="Foto de ${autor.nombre}" 
                        style="width: 150px; height: 150px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${autor.nombre}</h5>
                        <p class="text-muted">Desarrollador ISW-512</p>
                        <p class="card-text small">${autor.descripcion}</p>
                        <div id="tooltip-${autor.nombre.replace(/\s/g, '-')}" class="alert alert-info py-1 mt-3 d-none">
                            ${autor.correo}
                        </div>
                    </div>
                </div>
            </div>
        `;
        contenedor.innerHTML += tarjetaHTML;
    });
    
    // Una vez cargadas las tarjetas, asignamos el evento de interacción.
    asignarInteraccionAutores();
}

/**
 * Asigna el evento de clic a las tarjetas de autores para mostrar el correo.
 * (Requisito: Interacción sencilla con JavaScript)
 */
function asignarInteraccionAutores() {
    const tarjetas = document.querySelectorAll('.autor-card');

    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('click', function() {
            const correo = this.getAttribute('data-correo');
            const tooltipId = `tooltip-${this.querySelector('.card-title').textContent.replace(/\s/g, '-')}`;
            const tooltip = document.getElementById(tooltipId);

            // 1. Mostrar/Ocultar el correo (Interacción Toggle)
            if (tooltip.classList.contains('d-none')) {
                tooltip.classList.remove('d-none'); // Muestra el correo
                // Opcional: Ocultarlo después de 3 segundos
                setTimeout(() => {
                    tooltip.classList.add('d-none');
                }, 3000);
            } else {
                tooltip.classList.add('d-none'); // Oculta el correo
            }
        });
    });
}


// ==========================================================
// 3. LÓGICA DE LA PÁGINA DE CONTACTO (contacto.html)
// Requisito: Formulario funcional, Validación JS intermedia, Captcha.
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    // ... (Tu código de index.html y planes.html va aquí) ...

    // Solo ejecutar lógica de contacto si estamos en la página contacto.html
    if (document.getElementById('formulario-contacto')) {
        inicializarContacto();
    }
});

/**
 * Inicializa la funcionalidad del formulario de contacto.
 */
function inicializarContacto() {
    generarCaptcha();
    const form = document.getElementById('formulario-contacto');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Detener el envío por defecto
        validarFormulario(form);
    });
}

/**
 * Genera una pregunta matemática simple para el Captcha.
 * @param {string} idPregunta - ID del elemento donde se muestra la pregunta.
 * @param {string} idRespuesta - ID del elemento donde se ingresa la respuesta.
 */
function generarCaptcha(idPregunta = 'captcha-pregunta', idRespuesta = 'inputCaptcha') {
    // ... (Todo el código interno de la función permanece igual) ...

    const num1 = Math.floor(Math.random() * 10) + 1; // Número entre 1 y 10
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operacion = ['+', '-'][Math.floor(Math.random() * 2)]; // Suma o Resta

    let pregunta;
    let respuesta;

    if (operacion === '+') {
        pregunta = `¿Cuánto es ${num1} + ${num2}?`;
        respuesta = num1 + num2;
    } else {
        const mayor = Math.max(num1, num2);
        const menor = Math.min(num1, num2);
        pregunta = `¿Cuánto es ${mayor} - ${menor}?`;
        respuesta = mayor - menor;
    }

    // Usar los IDs dinámicos
    document.getElementById(idPregunta).innerHTML = pregunta;
    respuestaCaptchaCorrecta = respuesta;
    
    document.getElementById(idRespuesta).value = ''; 
    document.getElementById(idRespuesta).classList.remove('is-invalid');
}


/**
 * Valida todos los campos del formulario de contacto.
 * (Requisito: Validación JavaScript Intermedia)
 * @param {HTMLFormElement} form - El formulario a validar.
 */
function validarFormulario(form) {
    let esValido = true;

    // --- 1. Validación de Nombre ---
    const inputNombre = document.getElementById('inputNombre');
    if (inputNombre.value.trim() === '') {
        inputNombre.classList.add('is-invalid');
        esValido = false;
    } else {
        inputNombre.classList.remove('is-invalid');
    }

    // --- 2. Validación de Correo ---
    const inputCorreo = document.getElementById('inputCorreo');
    const regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regexCorreo.test(inputCorreo.value.trim())) {
        inputCorreo.classList.add('is-invalid');
        esValido = false;
    } else {
        inputCorreo.classList.remove('is-invalid');
    }

    // --- 3. Validación de Mensaje ---
    const inputMensaje = document.getElementById('inputMensaje');
    if (inputMensaje.value.trim().length < 10) {
        inputMensaje.classList.add('is-invalid');
        esValido = false;
    } else {
        inputMensaje.classList.remove('is-invalid');
    }

    // --- 4. Validación del Captcha ---
    const inputCaptcha = document.getElementById('inputCaptcha');
    // Convertimos la entrada a número y comparamos
    if (parseInt(inputCaptcha.value.trim()) !== respuestaCaptchaCorrecta) {
        inputCaptcha.classList.add('is-invalid');
        document.getElementById('feedbackCaptcha').textContent = "Respuesta incorrecta. Intenta de nuevo.";
        generarCaptcha(); // Generar un nuevo captcha tras un fallo
        esValido = false;
    } else {
        inputCaptcha.classList.remove('is-invalid');
    }

    // --- 5. Si todo es válido, mostrar el modal de confirmación ---
    if (esValido) {
        mostrarModalConfirmacion(inputNombre.value, inputCorreo.value, inputAsunto.value, inputMensaje.value);
        form.reset(); // Limpiar el formulario
        generarCaptcha(); // Generar un nuevo captcha para la próxima vez
    }
}


/**
 * Muestra un modal de Bootstrap con el resumen de los datos enviados.
 * (Requisito: Mostrar datos en un modal dinámico al enviar)
 */
function mostrarModalConfirmacion(nombre, correo, asunto, mensaje) {
    const modalCuerpo = document.getElementById('modal-cuerpo-contacto');
    
    // Inyectar el resumen de los datos
    modalCuerpo.innerHTML = `
        <p class="text-success lead">¡Gracias por contactarnos, ${nombre}!</p>
        <p>Hemos recibido tu mensaje con la siguiente información (simulada):</p>
        
        <ul class="list-group list-group-flush">
            <li class="list-group-item"><strong>Correo:</strong> ${correo}</li>
            <li class="list-group-item"><strong>Asunto:</strong> ${asunto || 'N/A (Sin asunto)'}</li>
            <li class="list-group-item"><strong>Mensaje:</strong> <em>${mensaje.substring(0, 100)}...</em></li>
        </ul>
        
        <p class="mt-3 small text-muted">Pronto nos pondremos en contacto contigo. Este proceso es una simulación de envío.</p>
    `;

    // Inicializar y mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('confirmacionModal'));
    modal.show();
}

// ==========================================================
// 4. LÓGICA DE LA PÁGINA PLANES (planes.html)
// Requisito: Mini-aplicación / Simulación simple (Cotizador)
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
    // ... (Tu código existente para index.html va aquí) ...

    // Solo ejecutar lógica del cotizador si estamos en la página planes.html
    if (document.getElementById('cotizador-form')) {
        inicializarCotizador();
    }
});

let datosPlanes = []; // Variable global para guardar los datos del JSON

/**
 * Inicializa el cotizador: carga datos, llena el selector y asigna eventos.
 */
async function inicializarCotizador() {
    // 1. Cargar datos del JSON (Consumo de datos)
    datosPlanes = await cargarDatosJSON('data/planes.json');
    const selectPlan = document.getElementById('selectPlan');

    // 2. Llenar el selector de planes
    selectPlan.innerHTML = '<option value="" disabled selected>Elige un plan</option>';
    datosPlanes.forEach(plan => {
        const option = document.createElement('option');
        option.value = plan.id;
        option.textContent = plan.nombre;
        selectPlan.appendChild(option);
    });
    
    // 3. Asignar Eventos de Interacción (Actualización dinámica en tiempo real)
    
    // Calcula la cotización cada vez que cambia el plan o la frecuencia.
    document.getElementById('cotizador-form').addEventListener('change', calcularCotizacion);
    
    // Simulación de Pago
    document.getElementById('btnPagarSimulado').addEventListener('click', simularPago);

    // Ejecutar una cotización inicial para limpiar el mensaje
    calcularCotizacion(); 
}

/**
 * Calcula el costo total basado en la selección del usuario y prepara la redirección al pago.
 */
function calcularCotizacion() {
    const planId = document.getElementById('selectPlan').value;
    const frecuencia = document.querySelector('input[name="frecuencia"]:checked').value;
    const resultadoDiv = document.getElementById('resultadoCotizacion');
    const beneficiosUl = document.getElementById('beneficios-lista');

    // ------------------------------------------------------------------
    // 1. LÓGICA DE VALIDACIÓN Y CÁLCULO
    // ------------------------------------------------------------------
    
    // Si no hay plan seleccionado, limpiar y salir.
    if (!planId) {
        resultadoDiv.innerHTML = '<p class="text-center">Selecciona un plan para comenzar.</p>';
        beneficiosUl.innerHTML = '<li class="list-group-item bg-light text-muted">Aún no hay beneficios seleccionados.</li>';
        
        // Desactivar el botón de pago si no hay plan seleccionado
        const btnPagar = document.getElementById('btnPagarSimulado');
        if (btnPagar) {
            btnPagar.disabled = true;
            btnPagar.textContent = 'Selecciona un Plan para Pagar';
            btnPagar.classList.remove('btn-success', 'btn-warning');
            btnPagar.classList.add('btn-secondary');
        }
        return; 
    }

    // Encontrar el plan seleccionado usando el ID
    const planSeleccionado = datosPlanes.find(p => p.id == planId);

    let costoTotal = 0;
    let mensajeDescuento = '';
    
    if (frecuencia === 'mensual') {
        costoTotal = planSeleccionado.precio_mensual;
        mensajeDescuento = 'Pago mensual.';
    } else if (frecuencia === 'anual') {
        // Fórmula de simulación de descuento (10% de descuento en el pago anual)
        costoTotal = planSeleccionado.precio_anual * 0.90; 
        mensajeDescuento = 'Pago anual con un 10% de ahorro.';
    }

    // Actualizar la lista de beneficios (Variación de estados en pantalla)
    beneficiosUl.innerHTML = planSeleccionado.beneficios.map(b => 
        `<li class="list-group-item bg-light"><i class="bi bi-check-circle-fill text-success me-2"></i>${b}</li>`
    ).join('');


    // Mostrar resultado
    resultadoDiv.innerHTML = `
        <div class="alert alert-primary text-center" role="alert">
            <h2 class="display-5 fw-bold">$${costoTotal.toFixed(2)}</h2>
            <p class="mb-0">${mensajeDescuento}</p>
        </div>
        <p class="text-center text-muted">Costo total por ${frecuencia === 'anual' ? 'el año' : 'mes'} del ${planSeleccionado.nombre}.</p>
    `;
    
    // ------------------------------------------------------------------
    // 2. NUEVA LÓGICA DE BOTÓN Y REDIRECCIÓN
    // ------------------------------------------------------------------
    
    let btnPagar = document.getElementById('btnPagarSimulado');
    
    // 1. Clonar y reemplazar el botón para eliminar cualquier event listener previo
    // Esto asegura que el botón solo tiene una acción de click (la redirección).
    const newBtnPagar = btnPagar.cloneNode(true);
    btnPagar.replaceWith(newBtnPagar);
    btnPagar = newBtnPagar; // Actualiza la referencia al nuevo botón

    // 2. Definir estilos y texto del botón
    btnPagar.disabled = false;
    if (frecuencia === 'anual') {
        btnPagar.classList.remove('btn-warning', 'btn-secondary');
        btnPagar.classList.add('btn-success');
        btnPagar.textContent = '¡Suscribirse Anualmente y Pagar!';
    } else {
        btnPagar.classList.remove('btn-success', 'btn-secondary');
        btnPagar.classList.add('btn-warning');
        btnPagar.textContent = 'Simular Pago Mensual';
    }

    // 3. Asignar el nuevo evento de Clic para redirigir a PAGO.HTML
    const costoFinal = costoTotal.toFixed(2);
    btnPagar.addEventListener('click', () => {
        // Redirigir a pago.html pasando los detalles del plan por URL
        const url = `pago.html?planId=${planSeleccionado.id}&frecuencia=${frecuencia}&costo=${costoFinal}`;
        window.location.href = url;
    });
}

/**
 * Simula el proceso de pago.
 * (Interacción significativa - Botones que cambian contenidos visibles/animaciones)
 */
// ==========================================================
// 5. LÓGICA DE LA PÁGINA DE PAGO (pago.html)
// Requisito: Simulación de pago, Captcha, Validación de Tarjeta/Banco.
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
    // ... (Tu código de index.html, contacto.html y planes.html va aquí) ...

    // Lógica para la nueva página de Pago
    if (document.getElementById('formulario-pago')) {
        inicializarPago();
    }
});

/**
 * Inicializa la funcionalidad del formulario de pago.
 */
async function inicializarPago() {
    // 1. Obtener parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const planId = params.get('planId');
    const frecuencia = params.get('frecuencia');
    const costo = params.get('costo');

    // 2. Cargar datos y mostrar resumen
    datosPlanes = await cargarDatosJSON('data/planes.json'); // Reutiliza la variable global
    const planSeleccionado = datosPlanes.find(p => p.id == planId);

    if (!planSeleccionado) {
        document.getElementById('resumen-plan-pago').innerHTML = '<p class="text-danger">Error: Plan no encontrado.</p>';
        return;
    }
    
    document.getElementById('resumen-plan-pago').innerHTML = `
        <h4 class="text-primary">${planSeleccionado.nombre} (${frecuencia})</h4>
        <h2 class="text-success display-6 fw-bold">$${costo}</h2>
        <p class="mb-0 small">${frecuencia === 'anual' ? 'Ahorro aplicado por pago anual.' : 'Pago mensual recurrente.'}</p>
    `;

    // 3. Inicializar Captcha de Pago
    generarCaptcha('captcha-pregunta-pago', 'inputCaptchaPago'); 

    // 4. Asignar Eventos al Formulario y Campos
    const inputTarjeta = document.getElementById('inputTarjeta');
    const inputVencimiento = document.getElementById('inputVencimiento');
    
    // a) Mostrar logo del banco al escribir (Interacción dinámica)
    inputTarjeta.addEventListener('input', mostrarLogoBanco);
    
    //Formato de Vencimiento Automático MM/AA
    inputVencimiento.addEventListener('input', formatearVencimiento);

    // b) Validar y Simular Pago al enviar
    document.getElementById('formulario-pago').addEventListener('submit', function(event) {
        event.preventDefault();
        validarFormularioPago(event);
    });
}
// Formatea automáticamente el campo de vencimiento a MM/AA
function formatearVencimiento(event) {
    const input = event.target;
    let valor = input.value.replace(/\D/g, ''); // Eliminar caracteres no numéricos
    
    // Si el usuario borra la barra, valor.length puede ser 2, y se inserta la barra de nuevo
    if (valor.length > 2) {
        valor = valor.slice(0, 2) + '/' + valor.slice(2, 4);
    } else if (valor.length === 2 && event.inputType !== 'deleteContentBackward') {
        // Asegurar que si hay 2 dígitos, se pone la barra si no se está borrando
        valor = valor + '/';
    }

    input.value = valor;
}
/**
 * Muestra el logo del banco dependiendo de los primeros dígitos de la tarjeta (simulación).
 */
/**
 * Muestra el logo del banco dependiendo de los primeros dígitos de la tarjeta (simulación).
 */
function mostrarLogoBanco() {
    const tarjetaInput = document.getElementById('inputTarjeta');
    let numero = tarjetaInput.value.replace(/\s/g, ''); // Limpiar espacios
    const logoDiv = document.getElementById('logo-banco');
    logoDiv.innerHTML = ''; // Limpiar logo anterior

    // Simulación de logos basados en prefijos comunes (sólo para demostración)
    let logoSrc = '';
    let logoAlt = '';

    if (numero.startsWith('4')) {
        logoSrc = './img/Visa.png'; // Asume que tienes un logo de Visa en /img/
        logoAlt = 'Visa';
    } else if (numero.startsWith('5')) {
        logoSrc = './img/Mastercard.png'; // Asume que tienes un logo de Mastercard en /img/
        logoAlt = 'Mastercard';
    } else if (numero.startsWith('34') || numero.startsWith('37')) {
        logoSrc = './img/Amex.png'; // Asume que tienes un logo de AMEX en /img/
        logoAlt = 'American Express';
    } 
    
    if (logoSrc) {
        // INYECCIÓN DEL LOGO
        logoDiv.innerHTML = `<img src="${logoSrc}" alt="${logoAlt}" style="max-width: 100%; height: auto; display: block;">`;
    }
}

/**
 * Valida todos los campos del formulario de pago, incluyendo el Captcha.
 */
function validarFormularioPago(event) {
    event.preventDefault(); // Asegurarse de prevenir el envío por defecto
    let esValido = true;
    const form = event.target;

    // Obtener elementos
    const inputNombreTarjeta = document.getElementById('inputNombreTarjeta');
    const inputTarjeta = document.getElementById('inputTarjeta');
    const inputVencimiento = document.getElementById('inputVencimiento');
    const inputCVC = document.getElementById('inputCVC');
    const inputCaptcha = document.getElementById('inputCaptchaPago');
    const feedbackCaptcha = document.getElementById('feedbackCaptchaPago'); // Para el mensaje de error

    // Función auxiliar para aplicar el feedback visual de Bootstrap
    const aplicarFeedback = (inputElement, condition) => {
        if (condition) {
            inputElement.classList.remove('is-invalid');
            inputElement.classList.add('is-valid');
        } else {
            inputElement.classList.remove('is-valid');
            inputElement.classList.add('is-invalid');
            esValido = false;
        }
    };
    
    // ----------------------------------------------------------------------
    // 1. Validación de Nombre (Requerido)
    aplicarFeedback(inputNombreTarjeta, inputNombreTarjeta.value.trim() !== '');

    // ----------------------------------------------------------------------
    // 2. Validación de Tarjeta (16 dígitos)
    const numeroTarjetaLimpio = inputTarjeta.value.replace(/\s/g, '');
    aplicarFeedback(inputTarjeta, numeroTarjetaLimpio.length === 16);

    // ----------------------------------------------------------------------
    // 3. Validación de Vencimiento (MM/AA, 5 caracteres, y no vencida)
    const esFormatoValido = inputVencimiento.value.match(/^(0[1-9]|1[0-2])\/\d{2}$/);
    
    // Validación adicional de fecha de vencimiento (simulación básica)
    let estaVencida = false;
    if (esFormatoValido) {
        const [mes, anio] = inputVencimiento.value.split('/').map(n => parseInt(n));
        const anioActual = new Date().getFullYear() % 100;
        const mesActual = new Date().getMonth() + 1; // Enero = 1

        if (anio < anioActual || (anio === anioActual && mes < mesActual)) {
            estaVencida = true;
        }
    }
    
    let vencimientoOK = esFormatoValido && !estaVencida;
    aplicarFeedback(inputVencimiento, vencimientoOK);
    
    if (inputVencimiento.classList.contains('is-invalid')) {
        // Personalizar mensaje de error
        document.getElementById('inputVencimiento').nextElementSibling.textContent = 
            estaVencida ? "La tarjeta está vencida." : "Formato debe ser MM/AA.";
    }


    // ----------------------------------------------------------------------
    // 4. Validación de CVC (3 o 4 dígitos)
    const cvcLimpio = inputCVC.value.replace(/\D/g, '');
    aplicarFeedback(inputCVC, cvcLimpio.length >= 3 && cvcLimpio.length <= 4);

    // ----------------------------------------------------------------------
    // 5. Validación de Captcha de Pago
    if (parseInt(inputCaptcha.value.trim()) !== respuestaCaptchaCorrecta) {
    // Si la respuesta es INCORRECTA
    inputCaptcha.classList.remove('is-valid');
    inputCaptcha.classList.add('is-invalid'); // <-- Esto pone el campo en rojo
    feedbackCaptcha.textContent = "Respuesta incorrecta. Por favor, intenta de nuevo."; 
    generarCaptcha('captcha-pregunta-pago', 'inputCaptchaPago'); // Regenerar Captcha
    esValido = false; // Marcar como no válido
    } else {
    // Si la respuesta es CORRECTA
    inputCaptcha.classList.remove('is-invalid'); // <-- Quitar el rojo si se corrige
    inputCaptcha.classList.add('is-valid');
}

    // ----------------------------------------------------------------------
    // --- Simular Pago Exitoso ---
    if (esValido) {
        // ... (Tu lógica de mostrar el modal de éxito se mantiene aquí) ...
        const params = new URLSearchParams(window.location.search);
        const planSeleccionado = datosPlanes.find(p => p.id == params.get('planId'));
        
        const modalCuerpo = document.getElementById('modal-cuerpo-pago');
        modalCuerpo.innerHTML = `
            <p class="lead text-success fw-bold">Se ha procesado el pago de $${params.get('costo')}.</p>
            <p><strong>Plan Adquirido:</strong> ${planSeleccionado.nombre}</p>
            <p><strong>Frecuencia:</strong> ${params.get('frecuencia')}</p>
            <hr>
            <p class="small text-muted">Esta transacción es simulada. Gracias por usar nuestro prototipo.</p>
        `;
        
        const modal = new bootstrap.Modal(document.getElementById('pagoConfirmacionModal'));
        modal.show();
        form.reset(); // Limpiar formulario después de la simulación
        generarCaptcha('captcha-pregunta-pago', 'inputCaptchaPago'); // Nuevo captcha
        // Cargar y vincular la función de redirección al nuevo botón Aceptar
        document.getElementById('btnModalAceptar').addEventListener('click', redirigirAPlanes);
    }
}
/**
 * Redirige al usuario a la página de planes.
 * Esta función será llamada por el botón del modal de confirmación.
 */
function redirigirAPlanes() {
    window.location.href = 'planes.html';
}