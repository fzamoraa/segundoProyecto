document.addEventListener('DOMContentLoaded', () => {
    cargarPosts();
    // Asocia el evento 'change' para el FILTRADO por categoría
    document.getElementById('filtro-categoria').addEventListener('change', filtrarPosts);
});

let postsGlobal = []; // Almacena todos los posts cargados globalmente

async function cargarPosts() {
    const contenedorPosts = document.getElementById('contenedor-posts');
    const estadoCarga = document.getElementById('estado-carga');
    
    try {
        // 1. Obtener los datos del JSON (blog.json)
        const response = await fetch('./data/blog.json'); 
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        postsGlobal = await response.json();
        
        if (postsGlobal.length === 0) {
            estadoCarga.textContent = 'No hay publicaciones disponibles en este momento.';
            return;
        }

        // 2. Inicializar filtros de categoría
        inicializarFiltros(postsGlobal);

        // 3. Renderizar todos los posts inicialmente
        renderizarPosts(postsGlobal);
        estadoCarga.classList.add('d-none'); // Ocultar el mensaje de carga
        
    } catch (error) {
        console.error("Error al cargar o parsear el JSON de blog:", error);
        contenedorPosts.innerHTML = `<p class="text-danger col-12 text-center">Error: No se pudieron cargar las publicaciones del blog.</p>`;
    }
}

function inicializarFiltros(posts) {
    const filtroSelect = document.getElementById('filtro-categoria');
    
    // Obtener categorías únicas y ordenarlas alfabéticamente
    const categorias = [...new Set(posts.map(post => post.categoria))].sort();
    
    // Añadir las opciones de filtro dinámicamente
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        filtroSelect.appendChild(option);
    });
}


function filtrarPosts() {
    const categoriaSeleccionada = document.getElementById('filtro-categoria').value;
    let postsFiltrados = [];

    if (categoriaSeleccionada === 'todos') {
        postsFiltrados = postsGlobal;
    } else {
        // Lógica de filtrado por categoría
        postsFiltrados = postsGlobal.filter(post => post.categoria === categoriaSeleccionada);
    }

    renderizarPosts(postsFiltrados);
}


function renderizarPosts(posts) {
    const contenedorPosts = document.getElementById('contenedor-posts');
    contenedorPosts.innerHTML = ''; // Limpiar el contenedor

    if (posts.length === 0) {
        contenedorPosts.innerHTML = `<p class="text-center text-muted col-12">No se encontraron publicaciones que coincidan con el filtro.</p>`;
        return;
    }

    posts.forEach(post => {
        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = `
            <div class="card h-100 bg-dark-blog card-blog text-white shadow-sm" data-post-id="${post.id}">
                <img src="${post.imagen_url || 'images/default-blog.jpg'}" class="card-img-top" alt="Imagen para ${post.titulo}">
                <div class="card-body d-flex flex-column">
                    <span class="badge bg-warning text-dark mb-2">${post.categoria}</span>
                    <h5 class="card-title text-warning">${post.titulo}</h5>
                    <p class="card-text flex-grow-1">${post.resumen}</p>
                    <p class="card-text mt-auto"><small class="text-muted">Publicado el ${post.fecha}</small></p>
                    <button class="btn btn-outline-warning mt-2 btn-ver-detalle" data-id="${post.id}">Leer Artículo Completo</button>
                </div>
            </div>
        `;
        contenedorPosts.appendChild(col);
    });
    
    // Asignar el listener al botón para abrir el modal
    document.querySelectorAll('.btn-ver-detalle').forEach(button => {
        button.addEventListener('click', mostrarDetallePost);
    });
}

// Función para mostrar el detalle de la publicación en un Modal (Interacción Avanzada)
function mostrarDetallePost(event) {
    // Usamos parseInt ya que los IDs en el JSON son números
    const postId = parseInt(event.target.getAttribute('data-id')); 
    const post = postsGlobal.find(p => p.id === postId);

    if (post) {
        document.getElementById('modalDetallePostLabel').textContent = post.titulo;
        document.getElementById('post-imagen').src = post.imagen_url || 'images/default-blog.jpg';
        document.getElementById('post-fecha').textContent = post.fecha;
        document.getElementById('post-categoria').textContent = post.categoria;
        
        // Cargar el contenido completo, reemplazando saltos de línea con párrafos HTML
        const contenidoFormateado = post.contenido_completo.split('\n').map(p => `<p>${p}</p>`).join('');
        document.getElementById('post-contenido').innerHTML = contenidoFormateado; 

        // Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById('modalDetallePost'));
        modal.show();
    } else {
        alert('Error: Publicación no encontrada.');
    }
}