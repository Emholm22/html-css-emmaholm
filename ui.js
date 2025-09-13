export function showLoading(el) {
  el.innerHTML = `<div class="loading" role="status" aria-live="polite">Loading…</div>`;
}
export function showError(el, msg = "Something went wrong. Please try again.") {
  el.innerHTML = `<div class="error" role="alert">${msg}</div>`;
}
