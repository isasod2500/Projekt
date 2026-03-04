"use strict";

/**
 * Eventlyssnare för DOMContent, BreweryDB API och Open-Meteo API
 */
document.addEventListener("DOMContentLoaded", async () => {
   var map = L.map("map")
   try {

     

      const callGeo = await fetch("https://geocoding-api.open-meteo.com/v1/search?")
      const gotGeo = await callGeo.json();
      createMap(gotGeo)
      map = await createMap(map)
      
      const callSpace = await fetch("http://api.open-notify.org/iss-now.json")
      const gotSpace = await callSpace.json();
      var spaceCoords = [
         parseFloat(gotSpace.iss_position.latitude), 
         parseFloat(gotSpace.iss_position.longitude)
      ]

       const callBrewery = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_dist=${spaceCoords}&per_page=200`)
      const gotBrewery = await callBrewery.json()
      console.log(gotBrewery)
      var brewCoords = [gotBrewery[0].latitude, gotBrewery[0].longitude]

      document.getElementById("beerBtn").addEventListener("click", () => {
         placeMarkers(spaceCoords, brewCoords, map)
         showMarkers(spaceCoords, brewCoords, map)
      })

      return { spaceCoords, brewCoords, map};

   } catch (error) {
      console.log(error)
   }

})

/**
 * Placerar ut markörer utefter koordinater från fetch av iss-position och OpenBreweryDB
 * @param {int} spaceCoords 
 * @param {int} brewCoords 
 * @param {var} map 
 */
function placeMarkers(spaceCoords, brewCoords, map) {

   var spaceIcon = L.icon({
      iconUrl:"../public/media/ISS.svg",

      iconSize:   [50,50],
      iconAnchor: [25, 25],
      popupAnchor:[-3, -30]
   });

   
   var spaceMarker = L.marker(spaceCoords, {icon: spaceIcon}).addTo(map).bindPopup("Här är du!")
   var brewPopup = L.popup()
   .setLatLng(brewCoords)
      .setContent("Här är ölen!")
      .addTo(map)

   let comboCoords = [
      spaceCoords,
    brewCoords
   ];
   console.log(spaceCoords, brewCoords)
   var path = L.polyline(comboCoords, {color: "#5C4900"}).addTo(map)
}

function showMarkers(spaceCoords, brewCoords, map) {
   var bounds = new L.LatLngBounds(spaceCoords, brewCoords);
   map.fitBounds(bounds, {padding:[50, 50]})
}
/**
 * Skapar karta med Lyndon B Johnson Space Center centrerat.
 */
async function createMap(map) {
   try {
      map.setView([29.558221, -95.088997], 9);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
         maxZoom: 19,
         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      var popup = L.popup()
      .setLatLng([29.558221, -95.088997])
      .setContent("Houston, I am thirsty!!!!")
      .openOn(map);

      var thirstyIcon = L.icon({
      iconUrl:"../public/media/batteryLo.svg",

      iconSize: [35, 35],
      iconAnchor:[19, 3],
      popupAnchor:[-3, 10]
   });

   var thirstyMarker = L.marker([29.558221, -95.088997], {icon: thirstyIcon }).addTo(map)

      return map;
   } catch (error) {
      console.log(error);
   }
}