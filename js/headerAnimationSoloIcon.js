// Animación del header
document.addEventListener('DOMContentLoaded', function () {
    const pageTitle = document.getElementById('page-title');
    const logo = document.getElementById('logo');
  
    // Esperar 2 segundos antes de iniciar la animación
    setTimeout(() => {
      // Ocultar el título gradualmente
      pageTitle.style.opacity = '0';
      pageTitle.style.transform = 'translateY(-20px)'; // Mover hacia arriba
  
      // Mostrar el logo gradualmente
      setTimeout(() => {
        pageTitle.style.display = 'none'; // Ocultar completamente el título
        logo.style.display = 'inline-block'; // Mostrar el logo
        logo.style.opacity = '1'; // Hacer visible el logo
      }, 500); // Duración de la transición
    }, 2000); // Retraso de 2 segundos
  });