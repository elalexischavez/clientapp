import { io } from "socket.io-client";

(() => {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const map = L.map('map', {
                    center: [position.coords.latitude, position.coords.longitude],
                    zoom: 16
                });

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(map);

                const customIcon = L.icon({
                    iconUrl: './bus.png',
                    iconSize: [90, 90],
                    iconAnchor: [50, 50],
                    popupAnchor: [0, -40]
                });

                const markers = {}; // Objeto para almacenar los marcadores de otros clientes

                const socket = io("movility.azurewebsites.net");

                // Añadir el marcador del cliente actual
                const currentMarker = L.marker([position.coords.latitude, position.coords.longitude], { icon: customIcon }).addTo(map);

                // Enviar la ubicación al servidor
                socket.emit("message", [position.coords.latitude, position.coords.longitude]);

                // Recibir ubicaciones de otros clientes
                socket.on("message", function (message) {
                    console.log(message)
                    const [latitude, longitude] = message;
                    if (!markers[message.id]) {
                        markers[message.id] = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
                    } else {
                        markers[message.id].setLatLng([latitude, longitude]);
                    }
                });
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    });
})();


// (()=>{

//     'use strict';
//     // -> load map when DOM is ready
//     document.addEventListener('DOMContentLoaded', () => {
//         if(navigator.geolocation){
//             navigator.geolocation.getCurrentPosition((position) => {
//                 //loadMap(position.coords.latitude, position.coords.longitude);
//                 var map = L.map('map', {
//                     center: [latitude, longitude],
//                     zoom: 16    
//                 });
//                 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//                          attribution: '© OpenStreetMap contributors'
//                 }).addTo(map);
            
//                 const customIcon = L.icon({
//                     iconUrl: './public/bus.png',
//                     iconSize: [90, 90], 
//                     iconAnchor: [50, 50],
//                     popupAnchor: [0, -40] 
//                 })
            
//                 let mark = L.marker([latitude, longitude], {icon: customIcon}).addTo(map);

//                 const socket = io("http://140.84.170.44");

//                 // Enviar un evento al servidor con un mensaje
                
//                 setInterval(() => {
//                     mark.remove()
//                     mark = L.marker([latitude, longitude], {icon: customIcon}).addTo(map);
//                     socket.emit("message", [position.coords.latitude, position.coords.longitude]);
//                 }, 4000)

//                 // Recibir un evento del servidor con un mensaje
//                 socket.on("message", function (mensaje) {
//                 // Mostrar el mensaje en la consola
//                 console.log(mensaje);
                
//                 });
//             });
//         }else{
//             alert("Geolocation is not supported by this browser.");
//         }
        
//     });

// })();


