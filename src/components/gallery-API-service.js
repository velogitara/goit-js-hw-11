const axios = require('axios').default;
const API_KEY = '27573462-7cfd1b03d2f186a851a1b1b26';
const BASIC_URL = 'https://pixabay.com/api/';

export default class GalleryApiService {
  constructor() {
    this.searchQuery = '';
    this.image_type = 'photo';
    this.orientation = 'horizontal';
    this.safesearch = true;
    this.page = 1;
  }
  fetchImages() {
    // console.log(this);
    return axios
      .get(
        `${BASIC_URL}?key=${API_KEY}&q='${this.searchQuery}'&image_type=${this.image_type}&orientation=${this.orientation}&safesearch=${this.safesearch}&per_page=40&page=${this.page}`,
      )
      .then(({ data }) => {
        console.log(data.total);
        return data.hits;
      });
  }

  loadMore() {
    this.page += 1;

    return this.fetchImages();
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
