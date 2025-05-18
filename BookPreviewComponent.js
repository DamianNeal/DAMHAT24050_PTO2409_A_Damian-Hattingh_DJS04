// Define a custom element class for the book preview component
export class BookPreview extends HTMLElement {
  constructor() {
    super();
    // Attach a shadow DOM to encapsulate HTML/CSS/JS from the main DOM
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Retrieve attributes passed to the custom element
    const title = this.getAttribute('data-title');
    const author = this.getAttribute('data-author');
    const image = this.getAttribute('data-image');
    const id = this.getAttribute('data-id');

    // Define the HTML and CSS that will be rendered inside the shadow DOM
    this.shadowRoot.innerHTML = `
      <style>
        /* Style for the preview container */
        .preview {
          border-width: 0;
          width: 100%;
          font-family: Roboto, sans-serif;
          padding: 0.5rem 1rem;
          display: flex;
          align-items: center;
          cursor: pointer;
          text-align: left;
          border-radius: 8px;
          border: 1px solid rgba(10, 10, 20, 0.15);
          background: rgba(255, 255, 255, 1);
        }

        /* Hover effect */
        .preview:hover {
          background: rgba(0, 150, 255, 0.05);
        }

        /* Book image styling */
        .preview__image {
          width: 48px;
          height: 70px;
          object-fit: cover;
          background: grey;
          border-radius: 2px;
        }

        /* Text container */
        .preview__info {
          padding: 1rem;
        }

        /* Book title styling */
        .preview__title {
          margin: 0 0 0.5rem;
          font-weight: bold;
          color: rgba(10, 10, 20, 0.8);
        }

        /* Author name styling */
        .preview__author {
          color: rgba(10, 10, 20, 0.4);
        }
      </style>

      <!-- Main clickable preview card -->
      <button class="preview" data-preview="${id}">
        <img class="preview__image" src="${image}" />
        <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${author}</div>
        </div>
      </button>
    `;

    // Emit a custom event when this component is clicked
    // - Bubbles: allows event to propagate to parent container
    // - Composed: allows it to cross shadow DOM boundary
    // - Detail: includes the book ID so the handler knows what to show
    this.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('preview-click', {
        bubbles: true,
        composed: true,
        detail: { id }
      }));
    });
  }
}

// Register the custom element so it can be used in HTML as <book-preview>
customElements.define('book-preview', BookPreview);
