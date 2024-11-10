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
        })
        .catch(error => console.error('Error al obtener el estado de los LEDs:', error));
}


function getPotentiometerValue() {
    fetch('/potentiometer?' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            // Actualiza el texto con el valor del potenciómetro
            const potentiometerValue = data.potentiometer_value;
            document.getElementById('potenciometer-value').innerHTML = 
                'Valor del potenciómetro: <strong>' + potentiometerValue + '</strong>';
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


// Actualiza el estado cada 1 segundo
setInterval(updateStatus, 1000);
setInterval(getPotentiometerValue, 1000);

// Actualiza el estado inicial al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    updateStatus();
    getPotentiometerValue();
});