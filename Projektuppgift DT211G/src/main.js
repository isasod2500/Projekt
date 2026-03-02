"use strict";

/**
 * Eventlyssnare för DOMContent, BreweryDB API och Open-Meteo API
 */
document.addEventListener("DOMContentLoaded", async () => {
   try {
    const callBrewery = await fetch("https://api.openbrewerydb.org/v1/breweries")
    const gotBrewery = await callBrewery.json()
    
    createBrewery(gotBrewery)
    
    const callGeo = await fetch("https://geocoding-api.open-meteo.com/v1/search?")
    const gotGeo = await callGeo.json();

    createMap(gotGeo)

    const callSpace = await fetch("http://api.open-notify.org/iss-now.json")
    const gotSpace = await callSpace.json();

    createSpace(gotSpace)

    console.table(gotBrewery)
    console.log(gotSpace.iss_position)
    console.log(gotGeo)

    document.getElementById("beerBtn").addEventListener("click", searchBrewery)
   } catch(error) {
    console.log(error)
   }
})

function searchBrewery() {

}

async function createBrewery(gotBrewery) {

}


async function createMap(gotGeo) {

}

async function createSpace(gotSpace) {
  
}