document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const file = params.get('file');
  
    if (!file) {
      document.getElementById('json-content').textContent = 'No se especificó ningún roadmap.';
      return;
    }
  
    async function cargarRoadmap() {
      try {
        const response = await fetch(decodeURIComponent(file));
        if (!response.ok) {
          throw new Error('Error al cargar el roadmap.');
        }
        const roadmap = await response.json();
        mostrarJSON(roadmap);
      } catch (error) {
        console.error('Error:', error);
        document.getElementById('json-content').textContent = 'No se pudo cargar el roadmap. Por favor, intenta más tarde.';
      }
    }
  
    // Función para mostrar el JSON formateado
    function mostrarJSON(data) {
      const jsonContent = document.getElementById('json-content');
      const formattedJSON = JSON.stringify(data, null, 2); // Formatear con 2 espacios de indentación
      jsonContent.textContent = formattedJSON; // Insertar el JSON formateado
    }
  
    // Cargar el roadmap al cargar la página
    cargarRoadmap();
  });