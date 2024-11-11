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
            document.getElementById('led-3-status').innerHTML = 'LED 3 está a <strong>' + led3Status + '</strong>.';

            // Actualiza la gráfica con el valor de LED 3
            updateGaugeChart(led3Status);
        })
        .catch(error => console.error('Error al obtener el estado de los LEDs:', error));
}

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
                backgroundColor: ['#4dc9f6', '#d3d3d3'],
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
