(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const money = (n) => "₹" + n.toLocaleString("en-IN");
  const FREE_SHIP = 1999;

  // ---------- Cart state (saved in the browser; swap for Django session/DB later) ----------
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem("dhaga_cart")) || []; } catch (e) {}
  const save = () => { try { localStorage.setItem("dhaga_cart", JSON.stringify(cart)); } catch (e) {} };

  const drawer = $("#drawer"), overlay = $("#overlay");
  const toast = $("#toast");
  let toastTimer;
  const say = (msg) => {
    toast.textContent = msg; toast.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  };

  const openCart = () => { drawer.classList.add("open"); overlay.classList.add("show"); drawer.setAttribute("aria-hidden", "false"); };
  const closeCart = () => { drawer.classList.remove("open"); overlay.classList.remove("show"); drawer.setAttribute("aria-hidden", "true"); };

  function renderCart() {
    const box = $("#cartItems");
    const count = cart.reduce((a, i) => a + i.qty, 0);
    const total = cart.reduce((a, i) => a + i.qty * i.price, 0);
    $("#cartCount").textContent = count;
    $("#subtotal").textContent = money(total);
    $("#checkout").disabled = !count;
    $("#shipNote").textContent = !count ? "" :
      total >= FREE_SHIP ? "You get free shipping." : `Add ${money(FREE_SHIP - total)} more for free shipping.`;

    if (!count) { box.innerHTML = '<p class="cart-empty">Your cart is empty. Add a piece from the drop.</p>'; return; }
    box.innerHTML = cart.map((i) => `
      <div class="line" data-id="${i.id}">
        <div class="mini" style="--bg:${i.bg}">${i.icon}</div>
        <div><h4>${i.name}</h4><div class="price">${money(i.price)}</div>
          <div class="qty"><button data-act="dec" aria-label="Decrease">−</button><span>${i.qty}</span><button data-act="inc" aria-label="Increase">+</button></div></div>
        <button class="rm" data-act="rm">Remove</button>
      </div>`).join("");
  }

  function addToCart(card) {
    const id = card.dataset.id;
    const found = cart.find((i) => i.id === id);
    if (found) found.qty++;
    else {
      const thumb = card.querySelector(".thumb");
      cart.push({
        id, name: card.dataset.name, price: +card.dataset.price, qty: 1,
        icon: thumb.firstChild.textContent.trim(),
        bg: getComputedStyle(thumb).getPropertyValue("--bg")
      });
    }
    save(); renderCart();
    const btn = $(".cart-btn"); btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump");
    say(card.dataset.name + " added to cart");
  }

  $("#grid").addEventListener("click", (e) => {
    const b = e.target.closest(".add");
    if (b) addToCart(b.closest(".card"));
  });

  $("#cartItems").addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const id = b.closest(".line").dataset.id;
    const item = cart.find((i) => i.id === id);
    if (b.dataset.act === "inc") item.qty++;
    if (b.dataset.act === "dec") item.qty--;
    if (b.dataset.act === "rm" || item.qty < 1) cart = cart.filter((i) => i.id !== id);
    save(); renderCart();
  });

  $("#openCart").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });
  $("#checkout").addEventListener("click", () => say("Checkout comes next: connect this to your Django order view."));

  // ---------- Filter, search, sort ----------
  const grid = $("#grid");
  const cards = $$(".card");
  cards.forEach((c, i) => (c.dataset.i = i));
  const state = { cat: "all", q: "", sort: "featured" };

  function applyFilters() {
    const sorters = {
      featured: (a, b) => a.dataset.i - b.dataset.i,
      low: (a, b) => a.dataset.price - b.dataset.price,
      high: (a, b) => b.dataset.price - a.dataset.price,
      name: (a, b) => a.dataset.name.localeCompare(b.dataset.name)
    };
    let shown = 0;
    [...cards].sort(sorters[state.sort]).forEach((c) => {
      const ok = (state.cat === "all" || c.dataset.cat === state.cat) &&
                 c.dataset.name.toLowerCase().includes(state.q);
      c.hidden = !ok; if (ok) shown++;
      grid.appendChild(c);
    });
    $("#empty").hidden = shown > 0;
  }

  $("#chips").addEventListener("click", (e) => {
    const c = e.target.closest(".chip"); if (!c) return;
    $$(".chip").forEach((x) => x.classList.toggle("on", x === c));
    state.cat = c.dataset.cat; applyFilters();
  });
  $("#search").addEventListener("input", (e) => { state.q = e.target.value.trim().toLowerCase(); applyFilters(); });
  $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; applyFilters(); });

  // ---------- Mobile menu ----------
  const burger = $("#burger"), nav = $("#nav");
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
  });

  // ---------- Newsletter ----------
  $("#newsletter").addEventListener("submit", (e) => {
    e.preventDefault(); e.target.reset(); say("You're on the list. See you at the next drop.");
  });

  renderCart();
})();
