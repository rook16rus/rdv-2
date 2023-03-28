import Swiper, { Navigation, EffectFade, Autoplay, Pagination, HashNavigation, Grid, FreeMode } from 'swiper'
import window from 'inputmask/lib/global/window'

export default function infinitySlider() {
  const sliders = document.querySelectorAll('.js-infinity-slider')

  sliders.forEach((slider) => {
    if (window.rdv.isAdmin) {
      const container = slider
      container.classList.add('not-initialized')
      container.classList.remove('loading')
    } else {
      const swiper = new Swiper(slider, {
        modules: [Navigation, EffectFade, Autoplay, Pagination, HashNavigation, Grid, FreeMode],
        slidesPerView: 'auto',
        speed: 5000,
        loop: true,
        loopAdditionalSlides: 10,
        loopSlides: 20,
        loopedSlidesLimit: false,
        allowTouchMove: true,
        spaceBetween: 10,
        autoplay: {
          enabled: true,
          delay: 0,
        },
        on: {
          init: function (swiper) {
            swiper.el.classList.remove('loading')
          },
        },
      })
    }
  })
}
