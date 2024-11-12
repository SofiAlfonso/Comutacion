// Función para actualizar el estado de todos los LEDs
function updateStatus() {
    fetch('/led_status')
        .then(response => response.json())
        .then(data => {
            // Actualiza el estado de cada LED
            const led1Status = data.LED1 ? 'encendido' : 'apagado';
            const led2Status = data.LED2 ? 'encendido' : 'apagado';
            const led3Status = data.LED3;

            // Actualiza el texto en la página
            document.getElementById('led-1-status').innerHTML = 'LED 1 está <strong>' + led1Status + '</strong>.';
            document.getElementById('led-2-status').innerHTML = 'LED 2 está <strong>' + led2Status + '</strong>.';
            document.getElementById('led-3-status').innerHTML = 'LED 3 está a <strong>' + led3Status + '</strong>% de su intensidad.'; ;

            // Actualiza la gráfica con el valor de LED 3
            updateGaugeChart(led3Status);
        })
        .catch(error => console.error('Error al obtener el estado de los LEDs:', error));
}

function getPotentiometerValue() {
    fetch('/potentiometer?' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            // Actualiza el texto con el valor del potenciómetro
            const value = data.potentiometer_value;
            const progressBar = document.getElementById('progress-bar');
                    const potentiometerValue = document.getElementById('potentiometer-value');

                    // Actualizar la barra de progreso y el texto
                    progressBar.style.width = value + '%';
                    progressBar.setAttribute('aria-valuenow', value);
                    progressBar.textContent = value + '%';
                    potentiometerValue.textContent = 'Valor del potenciómetro: ' + value + '%';
        })
        .catch(error => console.error('Error al obtener el valor del potenciómetro:', error));
}

// Función para controlar los LEDs
function controlLED(led, action) {
    fetch(`/LED_${action}/${led}`)
        .then(response => response.json())
        .then(() => updateStatus())  // Actualizar el estado de los LEDs
        .catch(error => console.error(`Error al ${action} el ${led}:`, error));

}

// Configuración de los botones para controlar cada LED
document.getElementById('led-1-on-btn').addEventListener('click', function(event) {
    event.preventDefault();
    controlLED('LED1', 'ON');
});
document.getElementById('led-1-off-btn').addEventListener('click', function(event) {
    event.preventDefault();
    controlLED('LED1', 'OFF');
});
document.getElementById('led-2-on-btn').addEventListener('click', function(event) {
    event.preventDefault();
    controlLED('LED2', 'ON');
});
document.getElementById('led-2-off-btn').addEventListener('click', function(event) {
    event.preventDefault();
    controlLED('LED2', 'OFF');
});

//barra de progreso



// Inicializar el gráfico de la intensidad del LED 3
let led3GaugeChart;
function initializeGaugeChart() {
    const ctx = document.getElementById('led3Gauge').getContext('2d');
    led3GaugeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Intensidad', ''],
            datasets: [{
                data: [0, 100], // Se actualiza en tiempo real
                backgroundColor: ['#1377cf', '#1377cf'],
                borderWidth: 0
            }]
        },
        options: {
            circumference: Math.PI,
            rotation: Math.PI,
            cutout: '80%',
            plugins: {
                tooltip: { enabled: false },
                legend: { display: false }
            }
        }
    });
}

// Función para actualizar el gráfico de la intensidad del LED 3
function updateGaugeChart(value) {
    if (led3GaugeChart) {
        led3GaugeChart.data.datasets[0].data[0] = (value / 1023) * 100; // Escala el valor de 0 a 100
        led3GaugeChart.data.datasets[0].data[1] = 100 - ((value / 1023) * 100);
        led3GaugeChart.update();
    }
}

// Llama a la inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    updateStatus();
    getPotentiometerValue();
    initializeGaugeChart(); // Inicializa el gráfico
});

// Actualiza el estado cada 1 segundo
setInterval(updateStatus, 1000);
setInterval(getPotentiometerValue, 1000);


function showToast(message, delay = 5000) {
    // Crear el toast
    const toastElement = document.createElement('div');
    toastElement.classList.add('toast', 'fade', 'show');
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
  
    // Contenido del toast
    toastElement.innerHTML = `
      <div class="toast-body">
        ${message}
      </div>
    `;

     // Agregar el toast al contenedor
  document.getElementById('toast-container').appendChild(toastElement);

  // Configurar el cierre automático del toast
  setTimeout(() => {
    toastElement.classList.remove('show');
    toastElement.classList.add('fade');
    toastElement.addEventListener('transitionend', () => {
      toastElement.remove();
    });
  }, delay);
}

// Ejemplo de mostrar diferentes toasts
document.getElementById('led-1-on-btn').addEventListener('click', () => {
    showToast('LED 1 encendido.', 3000);
  });
  
  document.getElementById('led-1-off-btn').addEventListener('click', () => {
    showToast("LED 1 apagado.", 3000);
  });
  
  document.getElementById('led-2-on-btn').addEventListener('click', () => {
    showToast("LED 2 encendido.", 3000);
  });

  document.getElementById('led-2-off-btn').addEventListener('click', () => {
    showToast("LED 2 apagado.", 3000);
  });