import { io } from "socket.io-client";

(()=>{

    'use strict';
    // -> load map when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((position) => {
                loadMap(position.coords.latitude, position.coords.longitude);
                const socket = io("http://140.84.170.44");

                // Enviar un evento al servidor con un mensaje
                socket.emit("message", [position.coords.latitude, position.coords.longitude]);

                // Recibir un evento del servidor con un mensaje
                socket.on("message", function (mensaje) {
                // Mostrar el mensaje en la consola
                console.log(mensaje);
                });
            });
        }else{
            alert("Geolocation is not supported by this browser.");
        }
        
    });

})();


function loadMap(latitude, longitude){
 
    var map = L.map('map', {
        center: [latitude, longitude],
        zoom: 16    
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
             attribution: '© OpenStreetMap contributors'
    }).addTo(map);


    L.marker([latitude, longitude]).addTo(map);
}

