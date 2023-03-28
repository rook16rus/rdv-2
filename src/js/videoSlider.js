import {Swiper, Scrollbar} from 'swiper';

export default function videoSlider() {
  const containers = document.querySelectorAll('.js-video-slider');

  containers.forEach(container => {
    const slides = container.querySelectorAll('.swiper-slide');
    if (slides.length > 1) {
      new Swiper(container, {
        speed: 400,
        slidesPerView: 1.5,
        spaceBetween: 16,
        modules: [Scrollbar],
        scrollbar: {
          el: '.swiper-scrollbar',
          draggable: true,
        },
        on: {
          init: function (swiper) {
            swiper.el.classList.remove("loading")
          },
        },
        breakpoints: {
          670: {
            spaceBetween: 24
          },
          1100: {
            slidesPerView: 2,
            spaceBetween: 30
          }
        }
      });
    } else {
      container.classList.remove('loading');
      const scrollbar = container.querySelector('.swiper-scrollbar');
      scrollbar.remove();
    }
  });
}