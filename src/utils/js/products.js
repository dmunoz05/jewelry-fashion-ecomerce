const API_URL = import.meta.env.PUBLIC_API_URL;

let products = [];
let categories = [];

// Evitar caché en cada petición
function generateRandomNumber() {
    return Math.floor(Math.random() * 100000) + Date.now();
}

// Fetch productos
export async function loadProducts() {
    try {
        const response = await fetch(
            `${API_URL}/get_products/home/?nocache=${generateRandomNumber()}`,
            { cache: "no-store" }
        );

        const json = await response.json();

        let list = Array.isArray(json)
            ? json
            : json.data ?? json.products ?? json.items ?? [];

        products = Array.isArray(list) ? list : [];
        return products;

    } catch (err) {
        console.log("Error loading products:", err);
        return [];
    }
}

// Fetch categorías
export async function loadCategories() {
    try {
        const response = await fetch(
            `${API_URL}/get_categories/?nocache=${generateRandomNumber()}`,
            { cache: "no-store" }
        );

        const json = await response.json();

        let list = Array.isArray(json)
            ? json
            : json.data ?? json.categories ?? json.items ?? [];

        categories = Array.isArray(list) ? list : [];
        return categories;

    } catch (err) {
        console.log("Error loading categories:", err);
        return [];
    }
}

// Formatear precios
export function formatPrice(value) {
    const number = Number(value) || 0;
    return number.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
    });
}

// Exportar datos (si los necesitas)
export { products, categories };
