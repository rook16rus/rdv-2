import Swiper, {Navigation, EffectFade, Autoplay, Pagination, HashNavigation, Grid, FreeMode} from "swiper";

export default function contentSlider() {
  const contentSlider = document.querySelector('.content-slider');
  if (!contentSlider) return

  const swiper = new Swiper(contentSlider, {
    modules: [Navigation, EffectFade, Autoplay, Pagination, HashNavigation, Grid, FreeMode],
    slidesPerView: 1,
    spaceBetween: 16,
    navigation: {
      nextEl: contentSlider.querySelector('.js-next-slide'),
      prevEl: contentSlider.querySelector('.js-prev-slide')
    },
    pagination: {
      el: contentSlider.querySelector('.swiper-pagination-bullets'),
      type: "bullets",
      clickable: true
    },
    breakpoints: {
      641: {
        spaceBetween: 20
      },
      769: {
        slidesPerView: 2,
        spaceBetween: 25,
      },
      1025: {
        spaceBetween: 32,
        slidesPerView: 2,
      }
    }
  })

  window.rdv.swipers.push(swiper);
}
