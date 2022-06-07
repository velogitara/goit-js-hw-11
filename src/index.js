import Notiflix from 'notiflix';
import GalleryApiService from './components/gallery-API-service';
const axios = require('axios').default;

import LoadMoreBtn from './components/loadMoreBtn';

const API_KEY = '27573462-7cfd1b03d2f186a851a1b1b26';

const BASIC_URL = 'https://pixabay.com/api/';
let inputValue = '';

const Refs = {
  inputValueRef: document.querySelector('input[name="searchQuery"]'),
  searchBtn: document.querySelector('.submitBtn'),
  galleryRef: document.querySelector('.gallery'),
  backToTopBtn: document.querySelector('[data-action="back-to-top"]'),
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

Refs.searchBtn.addEventListener('click', onClick);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);
Refs.backToTopBtn.addEventListener('click', backToTop);
// Refs.loadMoreBtn.addEventListener('click', onLoadMore);

const galleryApi = new GalleryApiService();

async function onClick(e) {
  try {
    e.preventDefault();
    loadMoreBtn.hide();

    Refs.backToTopBtn.classList.add('is-hidden');
    Refs.galleryRef.innerHTML = '';
    galleryApi.resetPage();

    Refs.inputValueRef.addEventListener('input', enableSearchBtn);
    Refs.searchBtn.toggleAttribute('disabled');

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
      const { data } = result;

      if (data.hits.length === 0) {
        Notiflix.Report.failure('Sorry We did not find anything', {
          messageFontSize: '20px',
          messageMaxLength: 1923,
          plainText: false,
        });
      } else {
        Notiflix.Notify.success(`Hooray! We found ${data.total} images.`);
        loadMoreBtn.show();
        loadMoreBtn.disable();
        setTimeout(() => {
          Refs.galleryRef.innerHTML = createCard(data.hits);
          loadMoreBtn.enable();
        }, 1000);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore() {
  const result = await galleryApi.loadMore();
  const { data } = result;
  console.log(data.hits.length);
  if (data.hits.length < 40) {
    loadMoreBtn.hide();
    Notiflix.Report.warning('No More Pictures To Load', 'We are very sorry');
    Refs.backToTopBtn.classList.remove('is-hidden');
    Refs.galleryRef.insertAdjacentHTML('beforeend', createCard(data.hits));
  } else {
    loadMoreBtn.show();
    loadMoreBtn.disable();

    setTimeout(() => {
      Refs.galleryRef.insertAdjacentHTML('beforeend', createCard(data.hits));
      loadMoreBtn.enable();
    }, 1000);
  }
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

function enableSearchBtn() {
  Refs.searchBtn.disabled = false;
}

function backToTop() {
  if (window.pageYOffset > 0) {
    window.scrollBy(0, -80);
    setTimeout(backToTop, 0);
  }
}
