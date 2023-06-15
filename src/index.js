import Notiflix from 'notiflix';
import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
  const loadMoreBtn = document.querySelector('.load-more');
  
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
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
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
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';

    images.forEach((image) => {
      const card = createImageCard(image);
      gallery.appendChild(card);
    });
  }

  function createImageCard(image) {
    const card = document.createElement('div');
    card.classList.add('photo-card');

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.classList.add('info');

    const likes = createInfoItem('Likes', image.likes);
    const views = createInfoItem('Views', image.views);
    const comments = createInfoItem('Comments', image.comments);
    const downloads = createInfoItem('Downloads', image.downloads);

    info.append(likes, views, comments, downloads);
    card.append(img, info);

    return card;
  }

  function createInfoItem(label, value) {
    const item = document.createElement('p');
    item.classList.add('info-item');
    item.innerHTML = `<b>${label}</b>: ${value}`;

    return item;
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
      if (images.length >= totalHits) {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }
    } catch (error) {
      console.error(error);
      Notiflix.Notify.failure('An error occurred while fetching images. Please try again later.');
    }
  }

  document.querySelector('#search-form').addEventListener('submit', searchImages);
  loadMoreBtn.addEventListener('click', loadMoreImages);
});
