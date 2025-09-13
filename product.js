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
  const price = p.onSale ? p.discountedPrice : p.price;
  root.innerHTML = `
    <article class="product-detail">
      <img src="${p.image?.url}" alt="${p.image?.alt ?? p.title}">
      <div class="details">
        <h1>${p.title}</h1>
        <p class="desc">${p.description}</p>
        <p class="meta">Gender: ${p.gender} ${p.baseColor ? "• Color: " + p.baseColor : ""}</p>
        <label>
          Size
          <select id="sizeSelect" aria-label="Choose size">
            ${(p.sizes || []).map(s => `<option value="${s}">${s}</option>`).join("")}
          </select>
        </label>
        <p class="price">${price.toFixed(2)} € ${p.onSale ? `<del>${p.price.toFixed(2)} €</del>` : ""}</p>
        <div class="qty">
          <label>Qty <input id="qty" type="number" min="1" value="1"></label>
        </div>
        <button id="addBtn" class="btn-primary">Add to cart</button>
      </div>
    </article>
  `;

  document.querySelector("#addBtn").addEventListener("click", () => {
    const qty = Math.max(1, parseInt(document.querySelector("#qty").value || "1", 10));
    addToCart(p, qty);
    alert(`Added ${qty} × "${p.title}" to cart.`);
  });
}

init();
