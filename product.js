import { getProduct } from "api.js";
import { addToCart } from "storage.js";

const $ = (s) => document.querySelector(s);
const set = (el, html) => { if (el) el.innerHTML = html; };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function getId() {
  const id = new URLSearchParams(location.search).get("id");
  if (!id) throw new Error("Missing product id (?id=...). Navigate here by clicking a product card.");
  return id;
}

function ensureSelectionCSS() {
  if (document.getElementById("selectionPulseCSS")) return;
  const style = document.createElement("style");
  style.id = "selectionPulseCSS";
  style.textContent = `
    .size-options input, .color-options input { display: none; }
    .size-options label span, .color-options label span {
      display:inline-block; transition: transform .15s ease, box-shadow .15s ease; cursor:pointer;
    }
    .size-options input:checked + span, .color-options input:checked + span {
      transform: scale(1.06); box-shadow: 0 0 0 2px #021E25 inset;
    }
    .pulse { animation: pulse .25s ease; }
    @keyframes pulse { 0%{transform:scale(1)} 50%{transform:scale(1.12)} 100%{transform:scale(1.06)} }
  `;
  document.head.appendChild(style);
}

function money(n) {
  const v = Number(n);
  return `£${(Number.isFinite(v) ? v : 0).toFixed(2)}`; 
}

async function init() {

  set($("#detailsGallery"), "<p>Loading…</p>");

  try {
    ensureSelectionCSS();

    const p = await getProduct(getId());

    set($("#productTitle"), esc(p.title));
    set($("#shortDescription"), esc(p.description ?? ""));
    set($("#longTitle"), esc(p.title));
    set($("#longDescription"), p.description ? `<li>${esc(p.description)}</li>` : `<li>No additional description provided.</li>`);

    const sale = !!p.onSale;
    const unit = sale ? p.discountedPrice : p.price;
    set($("#productPrice"),
      sale
        ? `${money(unit)} <del>${money(p.price)}</del>`
        : `${money(unit)}`
    );
    if ($("#saleBadge")) $("#saleBadge").style.display = sale ? "inline-block" : "none";

    if (p.image?.url) {
      set($("#detailsGallery"), `
        <a href="${esc(p.image.url)}">
          <img src="${esc(p.image.url)}" alt="${esc(p.image.alt ?? p.title)}">
        </a>
      `);
    } else {
      set($("#detailsGallery"), `<p>No image available.</p>`);
    }

    const colorWrap = $("#colorOptions");
    const colorTitle = $("#colorTitle");
    if (p.baseColor) {
      if (colorTitle) colorTitle.textContent = `Colour: ${p.baseColor}`;
      if (colorWrap) {
        colorWrap.innerHTML = `
          <label>
            <input type="radio" name="color_selected" value="${esc(p.baseColor)}" checked>
            <span style="width:24px;height:24px;border-radius:50%;background:${esc(p.baseColor)};display:inline-block;"></span>
          </label>`;
      }
    } else {
      if (colorTitle) colorTitle.textContent = "Colour: —";
      if (colorWrap) colorWrap.innerHTML = `<em>No color options</em>`;
    }
    const sizes = Array.isArray(p.sizes) ? p.sizes : [];
    const sizeWrap = $("#sizeOptions");
    if (sizeWrap) {
      if (sizes.length) {
        sizeWrap.innerHTML = sizes.map(s => `
          <label>
            <input type="radio" name="size_selected" value="${esc(s)}">
            <span>${esc(s)}</span>
          </label>`).join("");
      } else {
        const block = sizeWrap.closest(".size");
        if (block) block.style.display = "none";
      }
    }

    function attachPulse(name) {
      document.querySelectorAll(`input[name="${name}"]`).forEach(input => {
        input.addEventListener("change", () => {
          const span = input.nextElementSibling;
          if (!span) return;
          span.classList.remove("pulse"); 
          void span.offsetWidth;
          span.classList.add("pulse");
        });
      });
    }
    attachPulse("color_selected");
    attachPulse("size_selected");

    $("#addToCartBtn")?.addEventListener("click", () => {

      if (sizes.length && !document.querySelector('input[name="size_selected"]:checked')) {
        alert("Please select a size first.");
        return;
      }
      addToCart(p, 1);
      alert(`Added "${p.title}" to cart.`);
    });

  } catch (err) {
    set($("#detailsGallery"), `<p class="error">Failed to load product. ${esc(err.message)}</p>`);
    console.error(err);
  }
}

init();
