// script.js
const planetsContainer = document.getElementById('planetsContainer');
const paginationContainer = document.getElementById('pagination');

let nextPageURL = 'https://swapi.dev/api/planets/?format=json';

async function fetchPlanets(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    nextPageURL = data.next;

    displayPlanets(data.results);
    displayPagination();
  } catch (error) {
    console.error('Error fetching planets:', error);
  }
}

function displayPlanets(planets) {
  planetsContainer.innerHTML = '';
  planets.forEach(planet => {
    const card = document.createElement('div');
    card.classList.add('planet-card');
    card.innerHTML = `
      <h2>${planet.name}</h2>
      <p><strong>Climate:</strong> ${planet.climate}</p>
      <p><strong>Population:</strong> ${planet.population}</p>
      <p><strong>Terrain:</strong> ${planet.terrain}</p>
      <h3>Residents:</h3>
      <ul class="residents-list" id="residents${planet.name}"></ul>
    `;
    planetsContainer.appendChild(card);
    fetchResidents(planet.residents, `residents${planet.name}`);
  });
}

async function fetchResidents(residentURLs, residentsListID) {
  const residentsList = document.getElementById(residentsListID);
  residentsList.innerHTML = ''; // Clear previous residents if any

  for (const residentURL of residentURLs) {
    try {
      const response = await fetch(residentURL);
      const resident = await response.json();
      const listItem = document.createElement('li');
      listItem.classList.add('resident-item');
      listItem.innerHTML = `${resident.name} - Height: ${resident.height}, Mass: ${resident.mass}, Gender: ${resident.gender}`;
      residentsList.appendChild(listItem);
    } catch (error) {
      console.error('Error fetching resident:', error);
    }
  }
}

function displayPagination() {
  paginationContainer.innerHTML = '';
  if (nextPageURL) {
    const button = document.createElement('button');
    button.classList.add('pagination-button');
    button.innerText = 'Next Info';
    button.addEventListener('click', () => {
      fetchPlanets(nextPageURL);
    });
    paginationContainer.appendChild(button);
  }
}

// Initial fetch
fetchPlanets(nextPageURL);
