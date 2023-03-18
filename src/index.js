import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const inputEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34508452-be9fd8685a6af31007ab8f46e';

const message = 'Sorry, there are no images matching your search query. Please try again.';
const limit = 40;

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
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.hits.length > 0) {
      renderImages(data.hits);
      renderLoadMoreBtn();
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
}

function renderNotFound() {
  galleryEl.innerHTML = `<p class="not-found">${message}</p>`;
}

function renderLoadMoreBtn() {
  const button = document.createElement('button');
  button.classList.add('load-more-btn');
  button.textContent = 'Load more';

  button.addEventListener('click', onLoadMore);

  galleryEl.insertAdjacentElement('beforeend', button);
}

async function onLoadMore() {
    currentPage ++;
    fetchImages(searchQuery, currentPage, limit);
}
