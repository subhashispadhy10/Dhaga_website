(() => {
  const box = document.getElementById("product");
  const toast = document.getElementById("toast");
  let timer;
  const say = (msg) => {
    toast.textContent = msg; toast.classList.add("show");
    clearTimeout(timer); timer = setTimeout(() => toast.classList.remove("show"), 1800);
  };

  // Uses the same localStorage cart as the shop page
  function addToCart() {
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem("dhaga_cart")) || []; } catch (e) {}
    const id = box.dataset.id;
    const found = cart.find((i) => i.id === id);
    if (found) found.qty++;
    else {
      const photo = document.getElementById("photo");
      const img = photo.querySelector("img");
      const emoji = photo.querySelector(".emoji");
      cart.push({
        id, name: box.dataset.name, price: +box.dataset.price, qty: 1,
        image: img ? img.src : "",
        icon: emoji ? emoji.textContent.trim() : "",
        bg: getComputedStyle(photo).getPropertyValue("--bg")
      });
    }
    try { localStorage.setItem("dhaga_cart", JSON.stringify(cart)); } catch (e) {}
  }

  document.getElementById("addBtn").addEventListener("click", () => {
    addToCart(); say(box.dataset.name + " added to cart");
  });

  document.getElementById("buyBtn").addEventListener("click", () => {
    addToCart(); window.location.href = box.dataset.checkout;
  });
})();
