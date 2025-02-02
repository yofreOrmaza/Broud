let ruta = [];

// Cargar datos desde localStorage
function cargarDesdeLocalStorage() {
  const storedData = localStorage.getItem('ruta');
  if (storedData) {
    try {
      ruta = JSON.parse(storedData);
      console.log('Data loaded from localStorage:', ruta); // Depuración
      renderizarRuta(); // Renderizar los datos en la interfaz
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      alert('There was an error loading the data. The roadmap will be restarted.');
      ruta = [];
    }
  } else {
    console.log('No data in localStorage. Initializing empty roadmap.'); // Depuración
    ruta = [];
  }
}

// Guardar datos en localStorage
function guardarEnLocalStorage() {
  try {
    localStorage.setItem('ruta', JSON.stringify(ruta));
    console.log('Data stored in localStorage:', ruta); // Depuración
  } catch (error) {
    console.error('Error saving data in localStorage:', error);
    alert('There was an error saving the data. Please try again.');
  }
}

// Renderizar la ruta en la interfaz
function renderizarRuta() {
  console.log('Rendering roadmap:', ruta); // Depuración
  const routeContainer = document.getElementById('route');
  routeContainer.innerHTML = ''; // Limpiar el contenedor antes de renderizar

  ruta.forEach((paso, index) => {
    // Crear el círculo con el emoji
    const circle = document.createElement('div');
    circle.classList.add('circle');
    if (paso.completado) circle.classList.add('completed');
    circle.textContent = paso.emoji || '?'; // Mostrar el emoji o un símbolo por defecto si no hay emoji

    // Agregar la línea conectora (excepto para el último paso)
    if (index < ruta.length - 1) {
      const line = document.createElement('div');
      line.classList.add('line');
      circle.appendChild(line);
    }

    // Agregar el círculo al contenedor principal
    routeContainer.appendChild(circle);
  });

  // Actualizar el siguiente paso
  mostrarSiguientePaso();
}

// Agregar un nuevo paso
document.getElementById('step-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const stepName = document.getElementById('step-name').value.trim();
  const stepEmoji = document.getElementById('step-emoji').value.trim();

  if (stepName && stepEmoji) {
    ruta.push({ nombre: stepName, emoji: stepEmoji, completado: false });
    guardarEnLocalStorage();
    renderizarRuta();
    document.getElementById('step-name').value = '';
    document.getElementById('step-emoji').value = '';
  }
});

// Marcar un paso como completado
document.getElementById('route').addEventListener('click', function (e) {
  const circle = e.target.closest('.circle');
  if (circle) {
    const index = Array.from(circle.parentNode.children).indexOf(circle);
    ruta[index].completado = !ruta[index].completado;
    guardarEnLocalStorage();
    renderizarRuta();
  }
});

// Descargar archivo JSON
document.getElementById('download-btn').addEventListener('click', function () {
  const blob = new Blob([JSON.stringify(ruta)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'OFF-2Roadmap.json';
  a.click();
  URL.revokeObjectURL(url);
});

// Cargar archivo JSON
document.getElementById('upload-btn').addEventListener('click', function () {
  const fileInput = document.getElementById('upload-input');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select a JSON file.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      ruta = JSON.parse(e.target.result);
      guardarEnLocalStorage(); // Sincronizar con localStorage
      renderizarRuta();
      alert('Roadmap successfully loaded.');
    } catch (error) {
      alert('Error loading the file. Make sure it is a valid JSON file.');
    }
  };
  reader.readAsText(file);
});

// Inicializar la aplicación
cargarDesdeLocalStorage();

// Guardar datos en localStorage
function guardarEnLocalStorage() {
    localStorage.setItem('ruta', JSON.stringify(ruta));
}
  
// Agregar un nuevo paso
document.getElementById('step-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const stepName = document.getElementById('step-name').value.trim();
  
    if (stepName) {
      ruta.push({ nombre: stepName, completado: false });
      guardarEnLocalStorage(); // Guardar en localStorage
      renderizarRuta();
      document.getElementById('step-name').value = '';
    }
});
  
// Marcar un paso como completado
document.getElementById('route').addEventListener('click', function (e) {
    const circle = e.target.closest('.circle');
    if (circle) {
      const index = Array.from(circle.parentNode.children).indexOf(circle);
      ruta[index].completado = !ruta[index].completado;
      guardarEnLocalStorage(); // Guardar en localStorage
      renderizarRuta();
    }
});

// Mostrar el siguiente paso en el contenedor dedicado
function mostrarSiguientePaso() {
  const nextStep = ruta.find(paso => !paso.completado); // Buscar el primer paso no completado
  const nextStepEmoji = document.getElementById('next-step-emoji');
  const nextStepText = document.getElementById('next-step-text');

  if (nextStep) {
    nextStepEmoji.textContent = nextStep.emoji;
    nextStepText.textContent = nextStep.nombre;
  } else {
    nextStepEmoji.textContent = '🎉'; // Emoji de celebración si no hay más pasos
    nextStepText.textContent = 'You\'ve completed all the steps!';
  }
}

// Marcar un paso como completado
document.getElementById('route').addEventListener('click', function (e) {
  const circle = e.target.closest('.circle');
  if (circle) {
    const index = Array.from(circle.parentNode.children).indexOf(circle);
    ruta[index].completado = !ruta[index].completado;
    guardarEnLocalStorage();
    renderizarRuta();
  }
});