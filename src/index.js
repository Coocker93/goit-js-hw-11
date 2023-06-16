import Notiflix from 'notiflix';
import axios from 'axios';

const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

async function searchImages(event) {
  event.preventDefault();

  const searchQuery = document.querySelector('input[name="searchQuery"]').value;

  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '37252782-ab1fd22b6d95033438d9d3935',
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
      },
    });

    const images = response.data.hits;
    const totalHits = response.data.totalHits;

    if (images.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    } else {
      renderImages(images);
      if (images.length < totalHits) {
        loadMoreBtn.style.display = 'block';
      } else {
        loadMoreBtn.style.display = 'none';
      }
    }
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure('An error occurred while fetching images. Please try again later.');
  }
}

function renderImages(images) {
  images.forEach((image) => {
    const card = createImageCard(image);
    gallery.insertAdjacentHTML('beforeend', card);
  });
}

function createImageCard(image) {
  const card = `
    <div class="photo-card">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy">
      <div class="info">
        ${createInfoItem('Likes', image.likes)}
        ${createInfoItem('Views', image.views)}
        ${createInfoItem('Comments', image.comments)}
        ${createInfoItem('Downloads', image.downloads)}
      </div>
    </div>
  `;

  return card;
}

function createInfoItem(label, value) {
  return `<p class="info-item"><b>${label}</b>: ${value}</p>`;
}

async function loadMoreImages() {
  const searchQuery = document.querySelector('input[name="searchQuery"]').value;
  const currentPage = Math.ceil(document.querySelectorAll('.photo-card').length / 40) + 1;

  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '37252782-ab1fd22b6d95033438d9d3935',
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: currentPage,
      },
    });

    const images = response.data.hits;
    renderImages(images);

    const totalHits = response.data.totalHits;
    if (currentPage * 40 >= totalHits) {
      loadMoreBtn.style.display = 'none';
    }
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure('An error occurred while fetching images. Please try again later.');
  }
}

document.querySelector('#search-form').addEventListener('submit', searchImages);
loadMoreBtn.addEventListener('click', loadMoreImages);
