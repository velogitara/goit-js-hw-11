import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import GalleryApiService from './components/gallery-API-service';
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
      console.log(data);
      if (data.hits.length === 0) {
        Notiflix.Report.failure('Sorry We did not find anything', {
          messageFontSize: '20px',
          messageMaxLength: 1923,
          plainText: false,
        });
      } else if (data.hits.length < 40) {
        Notiflix.Notify.success(`Hooray! We found ${data.total} images.`);
        loadMoreBtn.show();
        loadMoreBtn.disable();
        setTimeout(() => {
          Refs.galleryRef.innerHTML = createCard(data.hits);
          lightbox.refresh();
          loadMoreBtn.hide();
        }, 1000);
      } else {
        Notiflix.Notify.success(`Hooray! We found ${data.total} images.`);
        loadMoreBtn.show();
        loadMoreBtn.disable();
        setTimeout(() => {
          Refs.galleryRef.innerHTML = createCard(data.hits);
          loadMoreBtn.enable();
          lightbox.refresh();
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
  console.log(galleryApi.page);
  if (data.hits.length < 40 && galleryApi.page > 1) {
    loadMoreBtn.disable();
    setTimeout(() => {
      Refs.galleryRef.insertAdjacentHTML('beforeend', createCard(data.hits));
      lightbox.refresh();
      console.log('лог внутри сета');
      loadMoreBtn.hide();
      Refs.backToTopBtn.classList.remove('is-hidden');
    }, 1000);

    setTimeout(() => {
      Notiflix.Notify.warning('Мы нашли все картинки, что смогли ');
    }, 3000);
  } else {
    loadMoreBtn.show();
    loadMoreBtn.disable();

    setTimeout(() => {
      Refs.galleryRef.insertAdjacentHTML('beforeend', createCard(data.hits));
      lightbox.refresh();
      Refs.backToTopBtn.classList.remove('is-hidden');
      loadMoreBtn.enable();
    }, 1000);
  }
}

function createCard(items) {
  return items
    .map(item => {
      return `<div class="photo-card">
              <div class="thumb"><a href="${item.largeImageURL}"><img src="${item.webformatURL}" class="image" alt="${item.tags}" loading="lazy" /></a></div>
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

let lightbox = new SimpleLightbox('.gallery a', {
  /* options */
  caption: true,
  captionsData: 'alt',
  captionDelay: 250,
});
lightbox.on('show.simplelightbox', function () {
  // Do something…
});
lightbox.on('error.simplelightbox', function (e) {
  console.log(e); // Some usefull information
});
