// =========================
// BookPreviewComponent.js
// =========================

export class BookPreview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const title = this.getAttribute('data-title');
    const author = this.getAttribute('data-author');
    const image = this.getAttribute('data-image');
    const id = this.getAttribute('data-id');

    this.shadowRoot.innerHTML = `
      <style>
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
        .preview:hover {
          background: rgba(0, 150, 255, 0.05);
        }
        .preview__image {
          width: 48px;
          height: 70px;
          object-fit: cover;
          background: grey;
          border-radius: 2px;
        }
        .preview__info {
          padding: 1rem;
        }
        .preview__title {
          margin: 0 0 0.5rem;
          font-weight: bold;
          color: rgba(10, 10, 20, 0.8);
        }
        .preview__author {
          color: rgba(10, 10, 20, 0.4);
        }
      </style>
      <button class="preview" data-preview="${id}">
        <img class="preview__image" src="${image}" />
        <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${author}</div>
        </div>
      </button>
    `;

    // 🔁 Emit event on any interaction with the component
    this.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('preview-click', {
        bubbles: true,
        composed: true,
        detail: { id }
      }));
    });
  }
}

customElements.define('book-preview', BookPreview);
