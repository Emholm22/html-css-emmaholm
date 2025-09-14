import { getProducts } from "./api.js";
import { showLoading, showError } from "./ui.js";

const grid = document.querySelector("#productGrid");
const genderFilter = document.querySelector("#genderFilter");
const tagFilter = document.querySelector("#tagFilter");
const searchInput = document.querySelector("#searchInput");

let allProducts = [];

async function init() {
  try {
    showLoading(grid);
    allProducts = await getProducts();
    buildTagFilter(allProducts);
    render(allProducts);
  } catch (e) {
    showError(grid, e.message);
  }
}

function buildTagFilter(products) {
  const tags = Array.from(new Set(products.flatMap(p => p.tags || []))).sort();
  for (const t of tags) {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    tagFilter.appendChild(opt);
  }
}

function card(p) {
  const price = p.onSale ? p.discountedPrice : p.price;
  const badge = p.onSale ? `<span class="badge">Sale</span>` : "";
  return `
  <article class="product-card">
<a href="productdetail.html?id=${encodeURIComponent(p.id)}" aria-label="View ${p.title}">
      <img src="${p.image?.url}" alt="${p.image?.alt ?? p.title}" loading="lazy">
      ${badge}
      <h3>${p.title}</h3>
      <p class="meta">${p.gender}${p.baseColor ? " • " + p.baseColor : ""}</p>
      <p class="price">${price.toFixed(2)} €</p>
    </a>
  </article>`;
}

function render(list) {
  grid.innerHTML = list.length ? list.map(card).join("") : `<p>No products found.</p>`;
}

function applyFilters() {
  const g = genderFilter.value.trim();
  const t = tagFilter.value.trim();
  const q = searchInput.value.trim().toLowerCase();

  const filtered = allProducts.filter(p => {
    const genderOk = !g || p.gender === g;
    const tagOk = !t || (p.tags || []).includes(t);
    const searchOk = !q || p.title.toLowerCase().includes(q);
    return genderOk && tagOk && searchOk;
  });

  render(filtered);
}

genderFilter?.addEventListener("change", applyFilters);
tagFilter?.addEventListener("change", applyFilters);
searchInput?.addEventListener("input", applyFilters);

init();
