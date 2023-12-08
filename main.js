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
        socket.emit("message", { id: socket.id, location: [position.coords.latitude, position.coords.longitude] });

        // Recibir ubicaciones de otros clientes
        socket.on("message", function (message) {
          console.log(message);
          const [latitude, longitude] = message.location;
          if (!markers[message.id]) {
            markers[message.id] = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
          } else {
            markers[message.id].setLatLng([latitude, longitude]);
          }
        });

        // Actualizar la ubicación cuando el cliente se mueve
        navigator.geolocation.watchPosition((newPosition) => {
          const newLocation = [newPosition.coords.latitude, newPosition.coords.longitude];
          socket.emit("message", { id: socket.id, location: newLocation });
        });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  });
})();
