const API_URL = import.meta.env.PUBLIC_API_URL;

let products = [];
let category = [];

function generateRandomNumber() {
  return Math.floor(Math.random() * 100000) + Date.now();
}


function attachAddToCartListeners() {
  const allProducts = document.querySelectorAll('button[data-product]');
  allProducts.forEach((btn) => {
    // evita duplicados re-registrando listeners
    if (btn._hasAddToCart) return;
    btn._hasAddToCart = true;

    btn.addEventListener("click", () => {
      let raw = btn.getAttribute("data-product") || "";
      try {
        raw = decodeURIComponent(raw);
      } catch (e) { /* ignore */ }
      let product = {};
      try { product = JSON.parse(raw); } catch (e) { product = {}; }

      const payload = {
        id: String(product?.id ?? product?.product_id ?? product?.sku ?? "unknown"),
        name: String(product.product_name ?? product.name ?? ""),
        price: Number(product.price ?? 0),
        image: product.image_url ?? product.image ?? "",
        quantity: 1,
      };

      if (window.cartApi && typeof window.cartApi.addItem === "function") {
        window.cartApi.addItem(payload);
        btn.textContent = "Añadido";
      } else {
        console.warn("cartApi not available");
      }
    });
  });
}

// Fetch categorías
async function loadCategories() {
  try {
    const response = await fetch(
      `${API_URL}/get_categories/?nocache=${generateRandomNumber()}`
    );
    const json = await response.json();

    let list = Array.isArray(json)
      ? json
      : json.data ?? json.categories ?? [];

    category = Array.isArray(list) ? list : [];

    renderCategories();
  } catch (err) {
    console.log("Error loading categories:", err);
  }
}

// Fetch productos
async function loadProducts() {
  try {
    const response = await fetch(
      `${API_URL}/get_products/home/?nocache=${generateRandomNumber()}`
    );

    const json = await response.json();

    let list = Array.isArray(json)
      ? json
      : json.data ?? json.products ?? json.items ?? [];

    products = Array.isArray(list) ? list : [];

    renderProducts();
  } catch (err) {
    console.log("Error loading products:", err);
  }
}

// Formatear precios
function formatPrice(value) {
  const number = Number(value) || 0;
  return number.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0
  });
}

// Render categorías en el menú desktop
function renderCategories() {
  const menu = document.getElementById("list-categories");
  if (!menu) return;

  menu.innerHTML = category
    .map(
      (item) => `
        <div class="relative">
          <a href="/category/${item.id}" class="hover:text-primary transition-colors cursor-pointer">
            ${item.name}
          </a>
        </div>
      `
    )
    .join("");
}

// Render grid de productos
function renderProducts() {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  grid.innerHTML = products
    .map(
      (product) => `
        <div class="flex flex-col gap-4 group">
          <div class="relative w-full aspect-square rounded-2xl overflow-hidden 
            bg-[#2B0001] shadow-xl shadow-black/30 border border-[#4f0a0a]/40
            transition-all duration-300 group-hover:border-[#850000]/70">
            
            <a href="/product/${product.id}">
              <div class="w-full h-full bg-center bg-cover transition-transform duration-300 ease-out group-hover:scale-110"
                   style="background-image: url('${product.image_url}');"
                   data-alt="${product.product_name}">
              </div>
            </a>

            ${product.on_sale
          ? `<div class="absolute top-2 left-2 bg-[#850000] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md shadow-black/40 border border-white/10">
                    OFERTA
                  </div>`
          : ""
        }
          </div>

          <div class="flex flex-col gap-2 px-1 select-none">
            <div>
              <p class="text-white text-sm font-semibold tracking-wide">${product.product_name}</p>
              <p class="text-gray-400 text-xs">${product.material}</p>
            </div>

            <div class="flex items-center gap-2 flex-wrap">
              <p class="text-[#D4B8B8] text-sm font-bold">
                ${formatPrice(product.price)}
              </p>
              ${product.on_sale
          ? `<p class="text-gray-600 text-xs line-through">${formatPrice(product.regular_price)}</p>`
          : ""
        }
            </div>

            <div class="flex flex-col gap-2 mt-1">
              <button
                data-product='${JSON.stringify(product)}'
                class="flex cursor-pointer w-full items-center justify-center gap-x-2
                  rounded-xl border border-[#660000]/40 bg-[#3A0001] 
                  px-3 py-2 text-white text-xs font-bold tracking-wide
                  transition-all duration-300
                  hover:bg-[#660000] hover:border-[#990000]/80
                  active:scale-[0.97] active:bg-[#850000]">
                Agregar
              </button>
            </div>
          </div>
        </div>
      `
    )
    .join("");

  // Agregar listeners
  attachAddToCartListeners();
}

// Iniciar
async function initCatalog() {
  await Promise.all([loadCategories(), loadProducts()]);
}

export { initCatalog };

