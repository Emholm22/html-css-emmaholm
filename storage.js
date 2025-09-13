const CART_KEY = "rd_cart_v1";

export function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) ?? []; }
  catch { return []; }
}

export function setCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(product, qty = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) existing.qty += qty;
  else cart.push({
    id: product.id,
    title: product.title,
    price: product.price,
    discountedPrice: product.discountedPrice,
    onSale: product.onSale,
    image: product.image?.url,
    qty
  });
  setCart(cart);
}

export function removeFromCart(id) {
  setCart(getCart().filter(i => i.id !== id));
}

export function clearCart() {
  setCart([]);
}

export function getCartSummary() {
  const items = getCart();
  const subtotal = items.reduce((sum, i) => {
    const unit = i.onSale ? i.discountedPrice : i.price;
    return sum + unit * i.qty;
  }, 0);
  return { items, subtotal };
}
