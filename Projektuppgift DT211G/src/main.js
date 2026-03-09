"use strict";

/**
 * Eventlyssnare för DOMContent, som kallar på funktionen fetchData
 */
document.addEventListener("DOMContentLoaded", () => {
   var map = createMap(L.map("map"))


   document.getElementById("beerBtn").addEventListener("click", () =>
      fetchData(map))

})

/**
 * Funktionen väntar på att kartan skapas i DOMContentLoaded och kör sedan async/await från APIerna.
 * @param {var} map 
 * @returns spaceCoords (ISS position), brewCoords (Närmsta bryggeri), map(kartan), brewName (Bryggeriets namn), brewCity (Bryggeriets stad), HTML-element för listan av platser.
 */
async function fetchData(map) {
   try {
      //Variabler för funktionen addToList.
      let locationInfoEl = document.getElementById("locationInfoList")
      let locationInfoSpace = document.createElement("li")
      let locationInfoBrew = document.createElement("li")
      locationInfoEl.innerHTML = "";
      locationInfoSpace.innerHTML = "Laddar..."
      locationInfoEl.appendChild(locationInfoSpace);
      locationInfoSpace.style.animation = "loading-text 4s infinite"

      const callSpace = await fetch("https://api.wheretheiss.at/v1/satellites/25544")
      const gotSpace = await callSpace.json();
      var spaceCoords = [
         parseFloat(gotSpace.latitude),
         parseFloat(gotSpace.longitude)
      ]

      const callBrewery = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_dist=${spaceCoords}&per_page=200`, { cache: 'no-store' })
      const gotBrewery = await callBrewery.json()
      var brewCoords = [parseFloat(gotBrewery[0].latitude),
      parseFloat(gotBrewery[0].longitude)]

      var brewName = gotBrewery[0].name;
      var brewCity = gotBrewery[0].city;

      placeMarkers(spaceCoords, brewCoords, map)
      showMarkers(spaceCoords, brewCoords, map)
      addToList(locationInfoSpace, spaceCoords, locationInfoBrew, brewName, brewCity, locationInfoEl)


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

   //Custom-markers
   var spaceIcon = L.icon({
      iconUrl: "media/ISS.svg",


      iconSize: [50, 50],
      iconAnchor: [25, 25],
      popupAnchor: [-3, -30]
   });

   var brewIcon = L.icon({
      iconUrl: "media/beer.png",

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
   path = L.polyline(comboCoords, { color: "#5C4900" }).addTo(map)


}

/**
 * Flyttar kartan till markörernas plats.
 * @param {float} spaceCoords 
 * @param {float} brewCoords 
 * @param {var} map 
 */
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
      iconUrl: "media/batteryLo.svg",

      iconSize: [35, 35],
      iconAnchor: [19, 3],
      popupAnchor: [-3, 10]
   });

   var thirstyMarker = L.marker([29.558221, -95.088997], { icon: thirstyIcon }).addTo(map)

   return map;
}



/**
 * Lägger till koordinaterna i en lista, ovanför kartan.
 * @param {string} spaceCoords 
 * @param {string} brewName 
 * @param {string} brewCity 
 */
function addToList(locationInfoSpace, spaceCoords, locationInfoBrew, brewName, brewCity, locationInfoEl) {
   locationInfoSpace.style.animation = "";
   locationInfoSpace.innerHTML = `Rymdstationens lat och lng: ${spaceCoords}`
   locationInfoBrew.innerHTML = `Närmsta bryggeri är: ${brewName}, ${brewCity}!`
   locationInfoEl.appendChild(locationInfoSpace);
   locationInfoEl.appendChild(locationInfoBrew);
}