import { loadCategories } from "./products.js";

export async function renderCategories() {
    const container = document.getElementById("categories-grid");
    const titleContainer = document.getElementById("categories-title");

    if (!container) {
        console.log("No existe el div #categories-grid en el HTML");
        return;
    }

    const categories = await loadCategories();

    // Si no hay categorías, no pintes nada
    if (!categories || categories.length === 0) return;

    // Insertar título
    if (titleContainer) {
        titleContainer.innerHTML = `
            <h2 class="px-4 pb-3 pt-8 text-[22px] font-bold leading-tight tracking-[-0.015em] text-black dark:text-white">
                Explora Nuestras Categorías
            </h2>
        `;
    }

    // Construir HTML de categorías
    const html = categories
        .map(
            (c) => `
        <a
          class="group relative flex h-48 items-center justify-center overflow-hidden rounded-xl shadow-lg md:h-64"
          href="/category/${c.id}"
        >
          <div
            class="absolute inset-0 bg-cover bg-center blur-xs brightness(0.45) bg-no-repeat transition-transform duration-500 group-hover:scale-110"
            style="background-image: url('${c.image_url}')"
          ></div>

          <div class="absolute inset-0 bg-black/50"></div>

          <h3 class="relative text-2xl font-bold text-white">${c.name}</h3>
        </a>
    `
        )
        .join("");

    container.innerHTML = html;
}
