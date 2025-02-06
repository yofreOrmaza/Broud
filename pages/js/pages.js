document.addEventListener('DOMContentLoaded', function () {
    const roadmapList = document.getElementById('roadmap-list');
  
    // Función para cargar roadmaps desde el archivo JSON
    async function cargarRoadmaps() {
      try {
        const response = await fetch('/pages/data/roadmaps.json');
        if (!response.ok) {
          throw new Error('Error al cargar los roadmaps.');
        }
        const roadmaps = await response.json();
        mostrarRoadmaps(roadmaps);
      } catch (error) {
        console.error('Error:', error);
        roadmapList.innerHTML = '<p>No se pudieron cargar los roadmaps. Por favor, intenta más tarde.</p>';
      }
    }
  
    // Función para mostrar los roadmaps en la página
    function mostrarRoadmaps(roadmaps) {
      roadmapList.innerHTML = ''; // Limpiar el contenedor
  
      if (roadmaps.length === 0) {
        roadmapList.innerHTML = '<p>No hay roadmaps disponibles.</p>';
        return;
      }
  
      roadmaps.forEach((roadmap) => {
        // Crear una fila para el roadmap
        const row = document.createElement('div');
        row.classList.add('roadmap-row');
  
        // Nombre del roadmap como enlace
        const nameLink = document.createElement('span');
        nameLink.textContent = roadmap.nombre;
        nameLink.classList.add('roadmap-name');
        nameLink.title = 'Ver Roadmap';
        nameLink.addEventListener('click', () => {
          window.location.href = `../view-roadmap.html?file=${encodeURIComponent(roadmap.archivo)}`;
        });
  
        // Botón "Ver"
        const viewButton = document.createElement('button');
        viewButton.textContent = 'Ver';
        viewButton.addEventListener('click', () => {
          window.location.href = `view-roadmap.html?file=${encodeURIComponent(roadmap.archivo)}`;
        });
  
        // Fecha de actualización
        const info = document.createElement('div');
        info.classList.add('info');
        const fechaActualizacion = new Date().toLocaleDateString(); // Simulación de fecha de actualización
        info.textContent = `Actualizado: ${fechaActualizacion}`;
  
        // Botón "Descargar"
        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Descargar';
        downloadButton.addEventListener('click', async () => {
          try {
            const response = await fetch(decodeURIComponent(roadmap.archivo));
            const data = await response.json();
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${roadmap.nombre.replace(/\s+/g, '-')}.json`;
            a.click();
            URL.revokeObjectURL(url);
          } catch (error) {
            console.error('Error al descargar el roadmap:', error);
            alert('Hubo un error al descargar el roadmap.');
          }
        });
  
        // Agregar elementos a la fila
        row.appendChild(nameLink);
        row.appendChild(viewButton);
        row.appendChild(info);
        row.appendChild(downloadButton);
  
        // Agregar la fila al contenedor
        roadmapList.appendChild(row);
      });
    }
  
    // Cargar los roadmaps al cargar la página
    cargarRoadmaps();
  });