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
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "There was an error loading the data. The roadmap will be restarted.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      //alert('There was an error loading the data. The roadmap will be restarted.');
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
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "There was an error saving the data. Please try again.",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
    //alert('There was an error saving the data. Please try again.');
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
  a.download = 'BroudRoadmap.json';
  a.click();
  URL.revokeObjectURL(url);
});

// Cargar archivo JSON
document.getElementById('upload-btn').addEventListener('click', function () {
  const fileInput = document.getElementById('upload-input');
  const file = fileInput.files[0];

  if (!file) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please select a JSON file.",
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true,
    });
    //alert('Please select a JSON file.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      ruta = JSON.parse(e.target.result);
      guardarEnLocalStorage(); // Sincronizar con localStorage
      renderizarRuta();
      Swal.fire({
        position: "top-end",
        icon: "success",
        //title: "...",
        text: "Roadmap successfully loaded.",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: false,
      });
      //alert('Roadmap successfully loaded.');
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error loading the file. Make sure it is a valid JSON file.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      //alert('Error loading the file. Make sure it is a valid JSON file.');
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

// Renderizar la lista completa de pasos en el desplegable
function renderizarListaCompleta() {
  const stepListItems = document.getElementById('step-list-items');
  stepListItems.innerHTML = ''; // Limpiar la lista antes de renderizar

  ruta.forEach((paso, index) => {
    const listItem = document.createElement('li');
    if (paso.completado) listItem.classList.add('completed');

    const emojiSpan = document.createElement('span');
    emojiSpan.textContent = paso.emoji || '?';

    const nameSpan = document.createElement('span');
    nameSpan.textContent = paso.nombre;

    // Botón de eliminar
    const deleteBtn = document.createElement('span');
    deleteBtn.textContent = '❌';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.title = 'Remove step';

    // Agregar evento para eliminar el paso
    deleteBtn.addEventListener('click', function () {
      Swal.fire({
        //title: "Are you sure you want to eliminate this step?",
        text: "Are you sure you want to eliminate this step?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#4635B1",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        // Si el usuario confirma la eliminación
        if (result.isConfirmed) {
          ruta.splice(index, 1); // Eliminar el paso del arreglo
          guardarEnLocalStorage();
          renderizarRuta();
          renderizarListaCompleta();
          mostrarSiguientePaso();

          // Mostrar mensaje de éxito
          Swal.fire({
            //title: "Deleted!",
            text: "Your step has been deleted.",
            icon: "success"
          });
        }})
      })
    
    
    
    /*deleteBtn.addEventListener('click', function () {
      if (confirm('Are you sure you want to eliminate this step?')) {
        ruta.splice(index, 1); // Eliminar el paso del arreglo
        guardarEnLocalStorage();
        renderizarRuta();
        renderizarListaCompleta();
        mostrarSiguientePaso();
      }
    });*/

    listItem.appendChild(emojiSpan);
    listItem.appendChild(nameSpan);
    listItem.appendChild(deleteBtn); // Agregar el botón de eliminar
    stepListItems.appendChild(listItem);
  });

  // Agregar el botón para eliminar TODOS los pasos
  const deleteAllButton = document.createElement('button');
  deleteAllButton.textContent = 'Delete All Steps';
  deleteAllButton.classList.add('delete-all-btn'); // Clase para estilizar

  // Crear un contenedor para el botón y alinearlo a la derecha
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('button-container'); // Clase para Flexbox
  buttonContainer.appendChild(deleteAllButton);

  // Agregar evento para eliminar todos los pasos
  deleteAllButton.addEventListener('click', function () {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete ALL steps and cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#4635B1",
      confirmButtonText: "Yes, delete all!"
    }).then((result) => {
      if (result.isConfirmed) {
        ruta = []; // Vaciar el arreglo de pasos
        guardarEnLocalStorage(); // Guardar el estado vacío en localStorage
        renderizarRuta(); // Actualizar la interfaz
        renderizarListaCompleta();
        mostrarSiguientePaso();

        // Mostrar mensaje de éxito
        Swal.fire({
          title: "Deleted!",
          text: "All steps have been deleted.",
          icon: "success"
        });
      }
    });
  });

  // Agregar el botón al contenedor de la lista
  stepListItems.appendChild(buttonContainer);
}

// Alternar la visibilidad del desplegable
document.getElementById('toggle-step-list').addEventListener('click', function () {
  const stepList = document.getElementById('step-list');
  if (stepList.style.display === 'block') {
    stepList.style.display = 'none';
    this.textContent = 'View all the steps ▲';
  } else {
    stepList.style.display = 'block';
    this.textContent = 'Hide Step List ▼';
    renderizarListaCompleta(); // Renderizar la lista cuando se abre el desplegable
  }
});

document.addEventListener('DOMContentLoaded', function () {
  // Inicializar SortableJS
  const stepListItems = document.getElementById('step-list-items');
  const sortable = new Sortable(stepListItems, {
    animation: 150,
    onEnd: function (evt) {
      const { oldIndex, newIndex } = evt;

      // Reordenar la ruta en el arreglo
      const movedStep = ruta.splice(oldIndex, 1)[0];
      ruta.splice(newIndex, 0, movedStep);

      // Guardar los cambios en localStorage
      guardarEnLocalStorage();

      // Actualizar la interfaz
      renderizarRuta();
      renderizarListaCompleta();
      mostrarSiguientePaso();
    }
  });
});

// Función para habilitar la edición de un paso
function habilitarEdicionPaso(li, paso, index) {
  // Crear un contenedor temporal para los campos de edición
  const inputEmoji = document.createElement('input');
  inputEmoji.type = 'text';
  inputEmoji.classList.add('editable');
  inputEmoji.value = paso.emoji || '?';
  inputEmoji.maxLength = 2; // Limitar a 2 caracteres para emojis

  const inputNombre = document.createElement('input');
  inputNombre.type = 'text';
  inputNombre.classList.add('editable');
  inputNombre.value = paso.nombre;

  // Botón para guardar los cambios
  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.classList.add('save-btn'); // Agregar la clase para estilizar
  saveBtn.style.marginLeft = '0.5rem';

  // Limpiar el contenido del elemento <li> y agregar los campos de edición
  li.innerHTML = '';
  li.appendChild(inputEmoji);
  li.appendChild(inputNombre);
  li.appendChild(saveBtn);

  // Enfocar el campo de nombre
  inputNombre.focus();

  // Función para guardar los cambios
  function guardarCambios() {
    const nuevoNombre = inputNombre.value.trim();
    const nuevoEmoji = inputEmoji.value.trim();

    if (nuevoNombre && nuevoEmoji) {
      ruta[index].nombre = nuevoNombre;
      ruta[index].emoji = nuevoEmoji;
      guardarEnLocalStorage();
      renderizarRuta();
      renderizarListaCompleta();
      mostrarSiguientePaso();
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please provide a valid name and emoji.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      //alert('Please provide a valid name and emoji.');
    }
  }

  // Guardar cambios al presionar "Enter" en cualquiera de los campos
  inputNombre.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      guardarCambios();
    }
  });

  inputEmoji.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      guardarCambios();
    }
  });

  // Guardar cambios al hacer clic en el botón "Guardar"
  saveBtn.addEventListener('click', guardarCambios);

  // Cancelar edición si el usuario hace clic fuera del elemento <li>
  li.addEventListener('blur', function () {
    setTimeout(() => {
      if (!li.contains(document.activeElement)) {
        guardarCambios();
      }
    }, 0);
  });
}

// Agregar eventos de doble clic a los elementos de la lista
document.getElementById('step-list-items').addEventListener('dblclick', function (e) {
  const li = e.target.closest('li');
  if (li) {
    const index = Array.from(li.parentNode.children).indexOf(li);
    const paso = ruta[index];
    habilitarEdicionPaso(li, paso, index);
  }
});

// Ventana modal para información sobre Broud, y enlace a Official Roadmaps
document.getElementById('logo').addEventListener('click', function () {
  Swal.fire({
    title: "BroudAdmin",
    text: "Information about Broud coming soon",
    imageUrl: "/data/img/broudadmin.jpg",
    imageWidth: 400,
    imageHeight: 200,
    imageAlt: "Broud Admin",
    footer: '<a target="_blank" href="/pages/roadmaps.html">Official Roadmaps ↗</a>'
  });
});