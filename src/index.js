import Notiflix from 'notiflix';
const axios = require('axios').default;

const API_KEY = '27573462-7cfd1b03d2f186a851a1b1b26';

const BASIC_URL = 'https://pixabay.com/api/';

const options = {
  key: API_KEY,
  //   q: inputValue,
  image_type: 'photo',
  orientation: 'vertical',
  safesearch: 'true',
};

const { key, q, image_type, orientation, safesearch } = options;

const Refs = {
  inputValueRef: document.querySelector('input[name="searchQuery"]'),
  searchBtn: document.querySelector('.submitBtn'),
  galleryRef: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
Refs.searchBtn.addEventListener('click', onClick);

async function onClick(e) {
  e.preventDefault();
  let inputValue = Refs.inputValueRef.value.trim();
  console.log(options.image_type);
  if (inputValue === '') {
    Notiflix.Report.warning('Sorry', 'Search field, cannot be empty', 'Okay', {
      messageFontSize: '20px',
      messageMaxLength: 1923,
      plainText: false,
    });
  } else {
    try {
      const response = await axios
        .get(
          `${BASIC_URL}?key=${options.key}&q='cat'&${options.image_type}&${options.orientation}&${options.safesearch}`,
        )
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
