import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';
import './BookPreviewComponent.js'; // ✅ Import Web Component

const state = {
  page: 1,
  matches: books,
};

// ✅ Use <book-preview> element
function createBookPreview(book) {
  const element = document.createElement('book-preview');
  element.setAttribute('data-id', book.id);
  element.setAttribute('data-title', book.title);
  element.setAttribute('data-author', authors[book.author]);
  element.setAttribute('data-image', book.image);
  return element;
}

function renderBookList(bookList, container) {
  const fragment = document.createDocumentFragment();
  for (const book of bookList) {
    fragment.appendChild(createBookPreview(book));
  }
  container.appendChild(fragment);
}

function populateSelect(options, selectElement, defaultText) {
  const fragment = document.createDocumentFragment();
  const defaultOption = document.createElement('option');
  defaultOption.value = 'any';
  defaultOption.innerText = defaultText;
  fragment.appendChild(defaultOption);

  for (const [id, name] of Object.entries(options)) {
    const option = document.createElement('option');
    option.value = id;
    option.innerText = name;
    fragment.appendChild(option);
  }

  selectElement.appendChild(fragment);
}

// ========== INITIAL LOAD ==========
document.addEventListener('DOMContentLoaded', () => {
  renderBookList(state.matches.slice(0, BOOKS_PER_PAGE), document.querySelector('[data-list-items]'));
  populateSelect(genres, document.querySelector('[data-search-genres]'), 'All Genres');
  populateSelect(authors, document.querySelector('[data-search-authors]'), 'All Authors');

  const isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.querySelector('[data-settings-theme]').value = isDarkTheme ? 'night' : 'day';
  document.documentElement.style.setProperty('--color-dark', isDarkTheme ? '255, 255, 255' : '10, 10, 20');
  document.documentElement.style.setProperty('--color-light', isDarkTheme ? '10, 10, 20' : '255, 255, 255');

  updateShowMore();
});

// ========== EVENT HANDLERS ==========

// ✅ Fix: use custom event from Web Component
document.querySelector('[data-list-items]').addEventListener('preview-click', (event) => {
  const previewId = event.detail.id;
  const book = books.find(book => book.id === previewId);
  if (book) displayActiveBook(book);
});

document.querySelector('[data-list-button]').addEventListener('click', () => {
  const nextBooks = state.matches.slice(state.page * BOOKS_PER_PAGE, (state.page + 1) * BOOKS_PER_PAGE);
  renderBookList(nextBooks, document.querySelector('[data-list-items]'));
  state.page++;
  updateShowMore();
});

document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);

  const filtered = books.filter(book => {
    const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
    const authorMatch = filters.author === 'any' || book.author === filters.author;
    const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
    return titleMatch && authorMatch && genreMatch;
  });

  state.page = 1;
  state.matches = filtered;
  document.querySelector('[data-list-items]').innerHTML = '';
  renderBookList(filtered.slice(0, BOOKS_PER_PAGE), document.querySelector('[data-list-items]'));
  document.querySelector('[data-list-message]').classList.toggle('list__message_show', filtered.length === 0);
  updateShowMore();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.querySelector('[data-search-overlay]').open = false;
});

document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
  event.preventDefault();
  const { theme } = Object.fromEntries(new FormData(event.target));
  const dark = theme === 'night';
  document.documentElement.style.setProperty('--color-dark', dark ? '255, 255, 255' : '10, 10, 20');
  document.documentElement.style.setProperty('--color-light', dark ? '10, 10, 20' : '255, 255, 255');
  document.querySelector('[data-settings-overlay]').open = false;
});

document.querySelector('[data-search-cancel]').addEventListener('click', () => {
  document.querySelector('[data-search-overlay]').open = false;
});

document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
  document.querySelector('[data-settings-overlay]').open = false;
});

document.querySelector('[data-header-search]').addEventListener('click', () => {
  document.querySelector('[data-search-overlay]').open = true;
  document.querySelector('[data-search-title]').focus();
});

document.querySelector('[data-header-settings]').addEventListener('click', () => {
  document.querySelector('[data-settings-overlay]').open = true;
});

document.querySelector('[data-list-close]').addEventListener('click', () => {
  document.querySelector('[data-list-active]').open = false;
});

// ========== UTILITY ==========
function updateShowMore() {
  const remaining = state.matches.length - (state.page * BOOKS_PER_PAGE);
  const button = document.querySelector('[data-list-button]');
  button.disabled = remaining <= 0;
  button.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${remaining > 0 ? remaining : 0})</span>
  `;
}

function displayActiveBook(book) {
  document.querySelector('[data-list-active]').open = true;
  document.querySelector('[data-list-blur]').src = book.image;
  document.querySelector('[data-list-image]').src = book.image;
  document.querySelector('[data-list-title]').innerText = book.title;
  document.querySelector('[data-list-subtitle]').innerText = `${authors[book.author]} (${new Date(book.published).getFullYear()})`;
  document.querySelector('[data-list-description]').innerText = book.description;
}
