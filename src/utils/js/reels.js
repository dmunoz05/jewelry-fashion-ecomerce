import Swiper from "swiper";
import { Navigation, Autoplay } from "swiper/modules";

export function initReels() {
  const avatarUrl = "/logo1.jpg";

  const reels = [
    {
      id: 1,
      user: "@jewelryfashionoficial",
      followers: "11,9k followers",
      reelUrl: "https://www.instagram.com/reel/DPpEd_vkdSq/",
      avatar: avatarUrl,
    },
    {
      id: 2,
      user: "@jewelryfashionoficial",
      followers: "11,9k followers",
      reelUrl: "https://www.instagram.com/reel/C70eQHgOslk/",
      avatar: avatarUrl,
    },
    {
      id: 3,
      user: "@jewelryfashionoficial",
      followers: "11,9k followers",
      reelUrl: "https://www.instagram.com/reel/DRiiutbkZqY/",
      avatar: avatarUrl,
    },
    {
      id: 4,
      user: "@jewelryfashionoficial",
      followers: "11,9k followers",
      reelUrl: "https://www.instagram.com/reel/DA1mP9uvqhU/",
      avatar: avatarUrl,
    },
    {
      id: 5,
      user: "@jewelryfashionoficial",
      followers: "11,9k followers",
      reelUrl: "https://www.instagram.com/reel/C0cWKzHu8Mo/",
      avatar: avatarUrl,
    },
  ];

  const API_URL = import.meta.env.PUBLIC_API_URL;
  const API = `${API_URL}/get_reels`;

  function generateRandomNumber() {
    return Math.floor(Math.random() * 100000) + Date.now();
  }

  async function fetchReels() {
    const results = [];

    for (const reel of reels) {
      const encoded = encodeURIComponent(reel.reelUrl);
      const url = `${API}?url=${encoded}&nocache=${generateRandomNumber()}`;

      try {
        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();

        results.push({
          ...reel,
          videoUrl: data.video_url || null,
          thumbnail: data.thumbnail || null,
        });
      } catch (e) {
        results.push({ ...reel, videoUrl: null, thumbnail: null });
      }
    }

    return results;
  }

  function renderReels(list) {
    const reelsContainer = document.querySelector(
      ".reels-swiper .swiper-wrapper"
    );

    reelsContainer.innerHTML = list
      .map(
        (reel) => `
        <div class="swiper-slide">
          <div class="reel-card group relative w-full aspect-[9/16] rounded-[32px] overflow-hidden bg-gray-900 border border-white/10 shadow-2xl">

            <div class="absolute top-0 left-0 w-full p-5 z-20 flex items-center gap-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
              <div class="relative w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-pink-500">
                <img src="${reel.avatar}" class="w-full h-full rounded-full border-2 border-black"/>
              </div>
              <div class="flex flex-col text-white">
                <span class="font-bold text-sm">${reel.user}</span>
                <span class="text-[10px] opacity-80">${reel.followers}</span>
              </div>
            </div>

            <div class="w-full h-full relative z-10 bg-black cursor-pointer" onclick="window.open('${reel.reelUrl}', '_blank')">
              ${reel.videoUrl
            ? `<video src="${reel.videoUrl}" autoplay muted loop playsinline class="absolute inset-0 w-full h-full object-cover scale-[1.15]"></video>`
            : reel.thumbnail
              ? `<img src="${reel.thumbnail}" class="absolute inset-0 w-full h-full object-cover scale-[1.15]"/>`
              : `<div class="flex items-center justify-center text-white">Cargando...</div>`
          }
            </div>

            <div class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/60 to-transparent z-20"></div>
          </div>
        </div>`
      )
      .join("");
  }

  (async () => {
    const reelsList = await fetchReels();
    renderReels(reelsList);

    new Swiper(".reels-swiper", {
      modules: [Navigation, Autoplay],
      slidesPerView: 1.2,
      spaceBetween: 16,
      centeredSlides: true,
      loop: true,
      autoplay: {
        delay: 2000,
        disableOnInteraction: true,
        pauseOnMouseEnter: true,
      },
      breakpoints: {
        640: { slidesPerView: 2.2, centeredSlides: false, spaceBetween: 20 },
        1024: { slidesPerView: 3, centeredSlides: false, spaceBetween: 24 },
        1280: { slidesPerView: 4, centeredSlides: false, spaceBetween: 30 },
      },
    });
  })();
}
