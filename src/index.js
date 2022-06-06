import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

import GalleryApiService from './components/gallery-API-service';
const axios = require('axios').default;

const API_KEY = '27573462-7cfd1b03d2f186a851a1b1b26';

const BASIC_URL = 'https://pixabay.com/api/';

let inputValue = '';

// const options = {
//   key: API_KEY,
//   q: inputValue,
//   image_type: 'photo',
//   orientation: 'horizontal',
//   safesearch: true,
// };

// const { key, q, image_type, orientation, safesearch } = options;

const Refs = {
  inputValueRef: document.querySelector('input[name="searchQuery"]'),
  searchBtn: document.querySelector('.submitBtn'),
  galleryRef: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

Refs.searchBtn.addEventListener('click', onClick);
Refs.loadMoreBtn.addEventListener('click', onLoadMore);

const galleryApi = new GalleryApiService();

async function onClick(e) {
  e.preventDefault();

  inputValue = Refs.inputValueRef.value.trim();

  galleryApi.query = Refs.inputValueRef.value.trim();

  if (inputValue === '') {
    Notiflix.Report.warning('Sorry', 'Search field, cannot be empty', 'Okay', {
      messageFontSize: '20px',
      messageMaxLength: 1923,
      plainText: false,
    });
  } else {
    const result = await galleryApi.fetchImages();
    if (result.length === 0) {
      Notiflix.Report.failure('Sorry We did not find anything', {
        messageFontSize: '20px',
        messageMaxLength: 1923,
        plainText: false,
      });
    } else {
      Refs.galleryRef.innerHTML = createCard(result);
    }
  }
}

async function onLoadMore() {
  const result = await galleryApi.loadMore();

  //   axios
  //     .get(
  //       `${BASIC_URL}?key=${API_KEY}&q='${inputValue}'&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&per_page=40`,
  //     )
  //     .then(({ data }) => {
  //       console.log(data);
  //       return data.hits;
  //     });
}

function createCard(items) {
  return items
    .map(item => {
      return `<div class="photo-card">
              <div class="thumb"><img src="${item.webformatURL}" class="image" alt="${item.tags}" loading="lazy" /></div>
              <div class="info">
                  <p class="info-item">
                      <b>Likes:<span class="info-item__value">${item.likes}</span></b>
                  </p>
                  <p class="info-item">
                      <b>Views:<span class="info-item__value">${item.views}</span></b>
                  </p>
                  <p class="info-item">
                      <b>Comments:<span class="info-item__value">${item.comments}</span></b>
                  </p>
                  <p class="info-item">
                      <b>Downloads:<span class="info-item__value">${item.downloads}</span></b>
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
