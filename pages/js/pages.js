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
        nameLink.textContent = roadmap.name;
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


// Función para convertir CSV a JSON con soporte para emojis/symbol
function csvToJson(csv) {
  const lines = csv.split('\n'); // Dividir el CSV en líneas
  const headers = lines[0].trim().split(','); // Obtener los encabezados (primera fila)

  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].trim();
    if (currentLine === '') continue; // Ignorar líneas vacías

    const values = currentLine.split(','); // Dividir la línea en valores
    const obj = {};

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j].trim(); // Limpiar espacios en blanco
      let value = values[j]?.trim() || ''; // Manejar valores vacíos

      // Eliminar comillas dobles escapadas si existen
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }

      // Validar y limitar el campo 'symbol' a 2 caracteres
      if (header === 'symbol') {
        value = value.substring(0, 7); // Limitar a los primeros 2 caracteres
      }

      // Asignar el tipo de dato según el encabezado
      if (header === 'name' || header === 'symbol') {
        obj[header] = value; // Mantener como string (los emojis son Unicode)
      } else if (header === 'done') {
        obj[header] = value.toLowerCase() === 'true'; // Convertir a booleano
      } else {
        obj[header] = value; // Por defecto, mantener como string
      }
    }

    result.push(obj); // Agregar el objeto al resultado
  }

  return result;
}

// Función para descargar el archivo JSON
function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Evento para cargar y convertir un archivo CSV
document.getElementById('csv-upload').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No file has been selected",
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true,
    });
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const csvData = event.target.result;
    try {
      const jsonData = csvToJson(csvData);
      downloadJson(jsonData, 'converted-file.json');
      Swal.fire({
        position: "top-end",
        icon: "success",
        text: "File successfully converted and downloaded.",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error converting CSV file. Make sure it is in a valid format.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };
  reader.readAsText(file);
});