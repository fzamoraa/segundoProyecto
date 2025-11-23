// ==========================================================
// PROYECTO ISW-512: ASISVIAL
// Archivo JavaScript principal para todas las interacciones dinámicas.
// ==========================================================

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
                                data-plan-nombre="${plan.nombre}">
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
// Se implementará más adelante.
// Requisito: Incorporar una interacción sencilla con JavaScript[cite: 44].
// ==========================================================


// ==========================================================
// 3. LÓGICA DE LA PÁGINA DE CONTACTO (contacto.html)
// Se implementará más adelante.
// Requisito: Formulario funcional con validación JavaScript intermedia[cite: 47].
// ==========================================================


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
 * Calcula el costo total basado en la selección del usuario.
 * (Cálculo o guía interactiva - Requisito: Funcionalidades mínimas)
 */
function calcularCotizacion() {
    const planId = document.getElementById('selectPlan').value;
    const frecuencia = document.querySelector('input[name="frecuencia"]:checked').value;
    const resultadoDiv = document.getElementById('resultadoCotizacion');
    const beneficiosUl = document.getElementById('beneficios-lista');

    // Si no hay plan seleccionado, limpiar y salir.
    if (!planId) {
        resultadoDiv.innerHTML = '<p class="text-center">Selecciona un plan para comenzar.</p>';
        beneficiosUl.innerHTML = '<li class="list-group-item bg-light text-muted">Aún no hay beneficios seleccionados.</li>';
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
    
    // Ejemplo de retroalimentación visual: cambiar color del botón si es anual
    const btnPagar = document.getElementById('btnPagarSimulado');
    if (frecuencia === 'anual') {
        btnPagar.classList.remove('btn-warning');
        btnPagar.classList.add('btn-success');
        btnPagar.textContent = '¡Suscribirse Anualmente y Ahorrar!';
    } else {
        btnPagar.classList.remove('btn-success');
        btnPagar.classList.add('btn-warning');
        btnPagar.textContent = 'Simular Pago Mensual';
    }
}


/**
 * Simula el proceso de pago.
 * (Interacción significativa - Botones que cambian contenidos visibles/animaciones)
 */
function simularPago() {
    const planId = document.getElementById('selectPlan').value;
    if (!planId) {
        alert("Por favor, selecciona un plan primero.");
        return;
    }

    const planSeleccionado = datosPlanes.find(p => p.id == planId);
    const frecuencia = document.querySelector('input[name="frecuencia"]:checked').value;
    const costo = document.getElementById('resultadoCotizacion').querySelector('h2').textContent;
    
    // Crear el modal de simulación de pago (si no existe)
    if (!document.getElementById('simulacionModal')) {
        const modalHTML = `
            <div class="modal fade" id="simulacionModal" tabindex="-1" aria-labelledby="simulacionModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title" id="simulacionModalLabel">¡Pago Simulado Exitoso!</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" id="modal-cuerpo-cotizador">
                            </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // Actualizar el contenido dinámico del modal
    const modalCuerpo = document.getElementById('modal-cuerpo-cotizador');
    modalCuerpo.innerHTML = `
        <p class="lead">Felicitaciones, has simulado la activación del **${planSeleccionado.nombre}**.</p>
        <p><strong>Frecuencia:</strong> ${frecuencia === 'anual' ? 'Anual' : 'Mensual'}</p>
        <p><strong>Monto simulado:</strong> ${costo}</p>
        <hr>
        <p class="small text-success">
            ✅ Gracias por confiar en ASISVial. ¡En un proyecto real, ahora recibirías tu confirmación de pago!
        </p>
    `;

    // Mostrar el modal
    const simulacionModal = new bootstrap.Modal(document.getElementById('simulacionModal'));
    simulacionModal.show();
}