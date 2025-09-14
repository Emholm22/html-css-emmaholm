import { getProduct } from "./api.js";
import { showLoading, showError } from "./ui.js";
import { addToCart } from "./storage.js";

const root = document.querySelector("#product");

function getId() {
  const id = new URLSearchParams(location.search).get("id");
  if (!id) throw new Error("Missing product id.");
  return id;
}

async function init() {
  try {
    showLoading(root);
    const product = await getProduct(getId());
    render(product);
  } catch (e) {
    showError(root, e.message);
  }
}

function render(p) {
  console.log('Product data:', p); 

  const titleEl = document.querySelector('#productTitle');
  const shortDescEl = document.querySelector('#shortDescription');
  const longTitleEl = document.querySelector('#longTitle');
  const longDescEl = document.querySelector('#longDescription');
  const priceEl = document.querySelector('#productPrice');
  const saleBadge = document.querySelector('#saleBadge');
  const colorTitle = document.querySelector('#colorTitle');
  const colorOptions = document.querySelector('#colorOptions');
  const sizeOptions = document.querySelector('#sizeOptions');
  const gallery = document.querySelector('#detailsGallery');
  const addBtn = document.querySelector('#addToCartBtn');

  if (titleEl) titleEl.textContent = p?.title || 'Product';
  if (shortDescEl) shortDescEl.textContent = p?.description || '';
  if (longTitleEl) longTitleEl.textContent = p?.title || 'Product';
  if (longDescEl) {
    longDescEl.innerHTML = p?.description
      ? `<li>${p.description}</li>`
      : `<li>No additional description provided.</li>`;
  }

  const unit = (p?.onSale ? p?.discountedPrice : p?.price);
  const safeUnit = Number.isFinite(Number(unit)) ? Number(unit) : 0;
  if (priceEl) {
    priceEl.innerHTML = p?.onSale
      ? `£${safeUnit.toFixed(2)} <del>£${Number(p?.price || 0).toFixed(2)}</del>`
      : `£${safeUnit.toFixed(2)}`;
  }
  if (saleBadge) saleBadge.style.display = p?.onSale ? 'inline-block' : 'none';

  if (colorTitle) colorTitle.textContent = `Colour: ${p?.baseColor ?? '—'}`;
  if (colorOptions) {
    if (p?.baseColor) {
      colorOptions.innerHTML = `
        <label>
          <input type="radio" name="color_selected" value="${p.baseColor}" checked>
          <span style="background:${p.baseColor};"></span>
        </label>`;
    } else {
      colorOptions.innerHTML = `<em>No color options</em>`;
    }
  }
  const sizes = Array.isArray(p?.sizes) ? p.sizes : [];
  if (sizeOptions) {
    if (sizes.length) {
      sizeOptions.innerHTML = sizes.map(s => `
        <label>
          <input type="radio" name="size_selected" value="${s}">
          <span>${s}</span>
        </label>`).join('');
    } else {
      const sizeBlock = sizeOptions.closest('.size');
      if (sizeBlock) sizeBlock.style.display = 'none';
    }
  }

  if (gallery) {
    if (p?.image?.url) {
      gallery.innerHTML = `
        <a href="${p.image.url}">
          <img src="${p.image.url}" alt="${p.image.alt || p.title || 'Product'}">
        </a>`;
    } else {
      gallery.innerHTML = `<p>No image available.</p>`;
    }
  }

  addBtn?.addEventListener('click', () => {
    if (sizes.length && !document.querySelector('input[name="size_selected"]:checked')) {
      alert('Please select a size first.');
      return;
    }
    addToCart(p, 1);
    alert(`Added "${p?.title || 'Product'}" to cart.`);
  });
}

  document.querySelector("#addBtn").addEventListener("click", () => {
    const qty = Math.max(1, parseInt(document.querySelector("#qty").value || "1", 10));
    addToCart(p, qty);
    alert(`Added ${qty} × "${p.title}" to cart.`);
  });
}

init();
