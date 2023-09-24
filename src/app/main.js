import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { PixabayApiImages } from './pixabay-api';
import { createMarkupImg } from './createMarkup';
import { refs } from './refs';

refs.form.addEventListener('submit', onSubmitForm);

Loading.circle();
Loading.remove();

const pixabay = new PixabayApiImages();
const lightboxGallery = new SimpleLightbox('.gallery a');

async function onSubmitForm(e) {
  e.preventDefault();

  observer.observe(refs.infinity);
  clearGallery();
  pixabay.resetPage();

  pixabay.searchQuery = e.currentTarget.searchQuery.value.trim();

  if (pixabay.searchQuery === '') {
    Notify.failure(
      'Oops! Looks like nothing found. Please try another search request.'
    );

    Loading.remove();

    return;
  }

  try {
    const { hits, totalHits } = await pixabay.getImages();
    pixabay.setTotal(totalHits);

    if (hits.length === 0) {
      return Notify.failure(
        'Oops! Looks like nothing found. Please try another search request.'
      );
    }

    Notify.success(`Okay, we found ${totalHits} images.`);

    Loading.circle();
    const markup = createMarkupImg(hits);
    updateMarkup(markup);

    Loading.remove();
  } catch (error) {
    console.log(error);
    clearGallery();
  }
}

function updateMarkup(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightboxGallery.refresh();
  smoothScroll();
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

async function onEntry(entries) {
  Loading.circle();

  entries.forEach(async entry => {
    try {
      if (
        entry.isIntersecting &&
        pixabay.query !== '' &&
        refs.gallery.childElementCount !== 0
      ) {
        pixabay.incrementPage();

        const { hits } = await pixabay.getImages();
        const markup = createMarkupImg(hits);
        updateMarkup(markup);

        Loading.remove();

        if (pixabay.hasMoreImages()) {
          Notify.info("Looks like you've reached the end of search results.");

          observer.unobserve(refs.infitity);
        }
      }

      Loading.remove();
    } catch (error) {
      Loading.remove();
      console.error(error);
    }
  });
}

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '100px',
});

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
