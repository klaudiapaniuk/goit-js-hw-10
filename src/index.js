import '/src/css/main.min.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener(
  'input',
  debounce(() => {
    let name = input.value.trim();
    if (!input.value) {
      countryInfo.innerHTML = '';
      countryList.innerHTML = '';
      return;
    }
    fetchCountries(name)
      .then(countriesList)
      .catch(showError)
      .finally(() => name === '');
  }, DEBOUNCE_DELAY)
);

function countriesList(data) {
  if (data.length > 10) {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  } else if (data.length === 1) {
    countryList.innerHTML = '';
    const countryData = data[0];
    countryInfo.innerHTML = `<div>
    <img class="img_info" src="${countryData.flags.svg}" alt="${
      countryData.name.official
    }"></img>
    <p class="country_name"><b>${countryData.name.official}</b></p>
    </div>
    <div>
    <ul>
    <li class="country_info"><b>Capital:</b> ${countryData.capital}</li>
    <li><b>Population:</b> ${countryData.population}</li>
    <li><b>Languages:</b> ${Object.values(countryData.languages).join('')}</li>
    </ul>
    </div>`;
  } else {
    if (input.value) {
      countryList.innerHTML = '';
    }
    for (const el of data) {
      countryInfo.innerHTML = '';
      countryList.insertAdjacentHTML(
        'beforeend',
        `<div>
        <img class="img_list" src="${el.flags.svg}" alt="${el.name.official}">
        </img>
        <p class="list_name">${el.name.official}</p>
        </div>`
      );
    }
  }
}

function showError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
