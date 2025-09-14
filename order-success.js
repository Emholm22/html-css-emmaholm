import { clearCart } from "./storage.js";

const root = document.querySelector("#confirm");

if (sessionStorage.getItem("rd_pending_checkout") === "1") {
  clearCart();
  sessionStorage.removeItem("rd_pending_checkout");
}

const orderId = Math.random().toString(36).slice(2, 10).toUpperCase();
root.innerHTML = `
  <h1>Thank you!</h1>
  <p>Your order <strong>#${orderId}</strong> has been placed.</p>
  <a class="btn-primary" href="/">Back to store</a>
`;
