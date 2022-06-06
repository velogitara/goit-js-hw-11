import Notiflix from 'notiflix';
const axios = require('axios').default;

const API_KEY = '27573462-7cfd1b03d2f186a851a1b1b26';

const BASIC_URL = 'https://pixabay.com/api/';

let inputValue = '';

const options = {
  key: API_KEY,
  q: `${inputValue}`,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
};

const { key, q, image_type, orientation, safesearch } = options;

const Refs = {
  inputValue: document.querySelector('input[name="searchQuery"]'),
  searchBtn: document.querySelector('.submitBtn'),
  galleryRef: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
Refs.searchBtn.addEventListener('click', onClick);

async function onClick(e) {
  e.preventDefault();
  inputValue = e.target.value.trim();

  try {
    const response = await axios
      .get(`${BASIC_URL}?key=${key}&${q}&${image_type}&${orientation}&${safesearch}`)
      .then(({ data }) => {
        console.log(data);
        return data.hits;
      })
      .then(result => {
        console.log(result);

        Refs.galleryRef.innerHTML = createCard(result);
      });
  } catch (error) {
    console.error(error);
  }
}

function createCard(items) {
  return items
    .map(item => {
      return `<div class="photo-card">
              <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" height="260px />
              <div class="info">
                  <p class="info-item">
                      <b>Likes:${item.likes}</b>
                  </p>
                  <p class="info-item">
                      <b>Views:${item.views}</b>
                  </p>
                  <p class="info-item">
                      <b>Comments:${item.comments}</b>
                  </p>
                  <p class="info-item">
                      <b>Downloads:${item.downloads}</b>
                  </p>
              </div>
          </div>`;
    })
    .join('');
}

// return `<div>
//         <p class="country-info__line"><img src="${item.flags.svg}" alt="${
//         item.name.official
//       }" width='30px' height='20px'>
//         <span class="countryName">${item.name.official}</span></p>
//         <p class="country-info__line"> <span class="keyName">Capital</span>: ${item.capital}</p>
//         <p class="country-info__line"> <span class="keyName">Population</span>: ${
//           item.population
//         }</p>
//         <p class="country-info__line"> <span class="keyName">languages</span>: ${Object.values(
//           item.languages,
//         ).join(', ')}</p>
//     </div>`;
//     })

//   return fetch(
//     `https://pixabay.com/api/?key=${key}&${q}&${image_type}&${orientation}&${safesearch}`
//   )
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(response.status);
//       }
//       return response.json();
//     })
//     .then(data => {
//       console.log(data);
//     })
//     .catch(error => {
//       console.log(error);
//     });
