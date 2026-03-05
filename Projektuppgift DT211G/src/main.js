"use strict";

/**
 * Eventlyssnare för DOMContent, BreweryDB API och Open-Meteo API
 */
document.addEventListener("DOMContentLoaded", async () => {
   var map = createMap(L.map("map"))

   document.getElementById("beerBtn").addEventListener("click", () =>
      fetchData(map))

})

async function fetchData(map) {
   try {

      const callSpace = await fetch("http://api.open-notify.org/iss-now.json")
      const gotSpace = await callSpace.json();
      var spaceCoords = [
         parseFloat(gotSpace.iss_position.latitude),
         parseFloat(gotSpace.iss_position.longitude)
      ]

      const callBrewery = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_dist=${spaceCoords}&per_page=200`)
      const gotBrewery = await callBrewery.json()
      var brewCoords = [parseFloat(gotBrewery[0].latitude),
      parseFloat(gotBrewery[0].longitude)]

      console.log(brewCoords)
      console.log(spaceCoords)
      placeMarkers(spaceCoords, brewCoords, map)
      showMarkers(spaceCoords, brewCoords, map)
      return { spaceCoords, brewCoords, map };

   } catch (error) {
      console.log(error)
   }

}


/**
 * Placerar ut markörer utefter koordinater från fetch av iss-position och OpenBreweryDB
 * @param {int} spaceCoords 
 * @param {int} brewCoords 
 * @param {var} map 
 */

   var brewMarker;
   var spaceMarker;
   var path;
function placeMarkers(spaceCoords, brewCoords, map) {

   console.log(spaceCoords)

   console.log(brewCoords)

   var spaceIcon = L.icon({
      iconUrl: "../public/media/ISS.svg",

      iconSize: [50, 50],
      iconAnchor: [25, 25],
      popupAnchor: [-3, -30]
   });

   var brewIcon = L.icon({
      iconUrl: "../public/media/beer.png",

      iconSize: [50, 50],
      iconAnchor: [25, 25],
      popupAnchor: [-3, -30]
   });


   if (spaceMarker != undefined || brewMarker != undefined || path != undefined) {
      map.removeLayer(spaceMarker)
      map.removeLayer(brewMarker)
      map.removeLayer(path)
   }
     spaceMarker = L.marker(spaceCoords, { icon: spaceIcon }).addTo(map).bindPopup("Här är du!")
      brewMarker = L.marker(brewCoords, { icon: brewIcon }).addTo(map).bindPopup("Här är ölen!")


   let comboCoords = [
      spaceCoords,
      brewCoords
   ];
   console.log(spaceCoords, brewCoords)
   path = L.polyline(comboCoords, { color: "#5C4900" }).addTo(map)
}

function showMarkers(spaceCoords, brewCoords, map) {
   var bounds = new L.LatLngBounds(spaceCoords, brewCoords);
   map.fitBounds(bounds, { padding: [50, 50] })
}
/**
 * Skapar karta med Lyndon B Johnson Space Center centrerat.
 */
function createMap(map) {

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
      iconUrl: "../public/media/batteryLo.svg",

      iconSize: [35, 35],
      iconAnchor: [19, 3],
      popupAnchor: [-3, 10]
   });

   var thirstyMarker = L.marker([29.558221, -95.088997], { icon: thirstyIcon }).addTo(map)

   return map;
}