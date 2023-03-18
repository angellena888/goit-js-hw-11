import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';
import Notiflix from 'notiflix';

const inputEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34508452-be9fd8685a6af31007ab8f46e';

const limit = 40;

const lightbox = new SimpleLightbox(".gallery img", {});

let searchQuery = '';
let currentPage = 1;

inputEl.addEventListener('submit', onSubmit);

function onSubmit(event) {
    event.preventDefault();

    const input = event.target.elements.searchQuery;
    const newSearchQuery = input.value.trim();

    if (newSearchQuery === searchQuery) {
        return;
    }

    searchQuery = newSearchQuery;

    fetchImages(searchQuery, currentPage, limit);
}

async function fetchImages(query, page, perPage) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.hits.length > 0) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      renderImages(data.hits);
    } else {
      renderNotFound();
    }
  } catch (error) {
    console.error(error);
  }
}

function renderImages(images) {
  if (currentPage === 1) {
    galleryEl.innerHTML = '';

    loadMoreBtn.classList.remove('hidden');
  }

  const html = images.map(image => `
    <div class="photo-card">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes:</b> ${image.likes}
        </p>
        <p class="info-item">
          <b>Views:</b> ${image.views}
        </p>
        <p class="info-item">
          <b>Comments:</b> ${image.comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b>
      ${image.downloads}
        </p>
      </div>
    </div>
  `).join('');

  galleryEl.insertAdjacentHTML('beforeend', html);

if (!lightbox) {
lightbox = new SimpleLightbox(".gallery img", {});
} else {
lightbox.refresh();
}
}

function renderNotFound() {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

loadMoreBtn.addEventListener('click', onLoadMore);


async function onLoadMore() {
  currentPage ++;

  const url = `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=${limit}`;

  try {
    const response = await axios.get(url);
    const images = response.data.hits;

    renderImages(images);

    if (currentPage === response.data.totalHits) {
      document.querySelector('.load-more').style.display = 'none';
    }
  } catch (error) {
    console.error(error);
  }
} 

