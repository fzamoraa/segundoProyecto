document.addEventListener('DOMContentLoaded', () => {
    cargarContenidoAcercaDe();
});

async function cargarContenidoAcercaDe() {
    try {
        const response = await fetch('./json/acerca-de.json');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        
        const autorData = data.find(item => item.id === 'autor');
        // El contexto se puede mostrar o no, si decides que la misión ya está en el HTML estático
        // const contextoData = data.find(item => item.id === 'contexto'); 

        if (autorData) {
            renderizarAutor(autorData);
        }
        // if (contextoData) {
        //     renderizarContexto(contextoData); // Si quieres renderizar más del contexto dinámicamente
        // }

    } catch (error) {
        console.error("Error al cargar o parsear el JSON:", error);
        const autorContainer = document.getElementById('autor-info');
        autorContainer.innerHTML = `
            <div class="card bg-dark text-warning border-0 text-center shadow">
                <div class="card-body py-5">
                    <h5 class="card-title text-uppercase mb-3">DESARROLLADOR DEL SITIO</h5>
                    <i class="fas fa-camera fa-5x text-warning mb-4"></i>
                    <p class="card-text text-danger">No se pudo cargar la información del autor.</p>
                </div>
            </div>
        `;
    }
}

function renderizarAutor(autor) {
    const autorContainer = document.getElementById('autor-info');
    // Mantenemos la estructura de la imagen que me enviaste
    autorContainer.innerHTML = `
        <div class="card bg-dark text-warning border-0 text-center shadow">
            <div class="card-body py-5">
                <h5 class="card-title text-uppercase mb-3">DESARROLLADOR DEL SITIO</h5>
                ${autor.foto_url ? `<img src="${autor.foto_url}" class="rounded-circle mb-4" alt="Foto del Autor" style="width: 120px; height: 120px; object-fit: cover; border: 3px solid #FFD700;">` : `<i class="fas fa-camera fa-5x text-warning mb-4"></i>`}
                <p class="card-text d-none" id="autor-bio">${autor.descripcion_corta}</p> <button class="btn btn-outline-warning mt-3" id="btn-bio">BIO</button>
            </div>
        </div>
    `;
    
    // 💡 Implementación de la Interacción Sencilla: Mostrar/Ocultar BIO
    const btnBio = document.getElementById('btn-bio');
    const autorBio = document.getElementById('autor-bio');

    btnBio.addEventListener('click', () => {
        if (autorBio.classList.contains('d-none')) {
            autorBio.classList.remove('d-none');
            autorBio.classList.add('d-block');
            btnBio.textContent = 'Ocultar BIO';
        } else {
            autorBio.classList.remove('d-block');
            autorBio.classList.add('d-none');
            btnBio.textContent = 'BIO';
        }
    });
}

// Puedes eliminar la función renderizarContexto si el texto de la misión va a ser estático en el HTML
// function renderizarContexto(contexto) { ... }