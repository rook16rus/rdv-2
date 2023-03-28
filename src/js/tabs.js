import { Swiper } from "swiper";
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export default function tabs() {
  const elements = Array.from(document.querySelectorAll('.js-tabs'));

  elements.forEach(element => {
    const btns = Array.from(element.querySelectorAll('.js-tab'));
    const items = Array.from(element.querySelectorAll('.js-body'));

    const setActiveTab = index => {
      btns.forEach(btn => btn.classList.remove('active'));
      items.forEach(item => item.classList.remove('active'));

      btns[index].classList.add('active');
      items[index].classList.add('active');
    };

    btns.forEach((btn, btnIndex) => {
      btn.addEventListener('click', event => {
        event.preventDefault();
        setActiveTab(btnIndex);

        gsap.to(window, {
          duration: 0.7,
          ease: 'power2.out',
          scrollTo: {
            y: element,
            autoKill: false,
            offsetY: 40
          }
        });
      });
    });

    if (window.matchMedia("screen and (max-width: 1099px)").matches) {
      new Swiper(element.querySelector('.swiper'), {
        speed: 300,
        slidesPerView: 2,
        spaceBetween: 6,
      })
    }
  })
}