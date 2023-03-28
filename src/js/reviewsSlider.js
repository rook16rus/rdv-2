import { EffectFade, Navigation, Pagination, Swiper, Autoplay } from 'swiper'
import window from 'inputmask/lib/global/window'

export default function reviewsSlider() {
  const containers = document.querySelectorAll('.js-reviews-slider')

  containers.forEach((container) => {
    if (window.rdv.isAdmin) {
      container.querySelector('.swiper').classList.add('not-initialized')
      container.querySelector('.swiper').classList.remove('loading')
    } else {
      const slides = container.querySelectorAll('.swiper-slide')
      if (slides.length > 1) {
        new Swiper(container.querySelector('.swiper'), {
          modules: [Navigation, Pagination, EffectFade, Autoplay],
          speed: 400,
          slidesPerView: 1,
          spaceBetween: 0,
          effect: 'fade',
          // autoplay: {
          //   delay: 10000,
          //   disableOnInteraction: false,
          //   waitForTransition: false,
          // },
          fadeEffect: {
            crossFade: true,
          },
          on: {
            init: function (swiper) {
              swiper.el.classList.remove('loading')
            },
          },
          navigation: {
            nextEl: container.querySelector('.next'),
            prevEl: container.querySelector('.prev'),
            disabledClass: 'disabled',
          },
          pagination: {
            el: container.querySelector('.new-pagination'),
            clickable: true,
            renderBullet: function (index, className) {
              return `<button class="${className}" type="button"></button>`
            },
            bulletClass: 'new-pagination__item',
            bulletActiveClass: 'active',
          },
        })
      } else {
        container.querySelector('.swiper').classList.remove('loading')
      }
    }
  })
}

// <svg width="28" height="28" viewBox="0 0 28 28">
//   <circle cx="14" cy="14" r="14" stroke="#174F77" stroke-opacity="0.2" stroke-width="1" fill="none"></circle>
//   <circle cx="14" cy="14" r="14" stroke="#174F77" stroke-opacity="1" stroke-width="1" fill="none"></circle>
// </svg>
