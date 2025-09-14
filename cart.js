import { getCartSummary, removeFromCart } from "./storage.js";

const container = document.querySelector("#cart");
const checkoutBtn = document.querySelector("#checkoutBtn");

function render() {
  const { items, subtotal } = getCartSummary();

  if (!items.length) {
    container.innerHTML = `<p>Your cart is empty.</p>`;
    checkoutBtn.setAttribute("aria-disabled", "true");
    checkoutBtn.classList.add("disabled");
    return;
  }

  checkoutBtn.removeAttribute("aria-disabled");
  checkoutBtn.classList.remove("disabled");

  container.innerHTML = `
    <ul class="cart-list">
      ${items.map(i => `
        <li class="cart-item">
          <img src="${i.image}" alt="${i.title}" />
          <div>
            <h3>${i.title}</h3>
            <p>Qty: ${i.qty}</p>
            <p>Unit: ${(i.onSale ? i.discountedPrice : i.price).toFixed(2)} €</p>
            <button data-id="${i.id}" class="remove">Remove</button>
          </div>
        </li>
      `).join("")}
    </ul>
    <div class="summary">
      <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)} €</p>
    </div>
  `;

  container.querySelectorAll(".remove").forEach(btn => {
    btn.addEventListener("click", (e) => {
      removeFromCart(e.currentTarget.dataset.id);
      render();
    });
  });
}

// mark that we're checking out (confirmation page will clear cart)
checkoutBtn.addEventListener("click", () => {
  sessionStorage.setItem("rd_pending_checkout", "1");
});

render();
