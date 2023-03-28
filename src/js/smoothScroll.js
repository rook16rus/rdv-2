import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

export default function smoothScroll() {
  const links = document.querySelectorAll('.js-smooth-scroll')
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault()

      const hash = link.href.split('#')[1]
      if (hash && document.getElementById(hash)) {
        gsap.to(window, {
          duration: 0.7,
          ease: 'power2.out',
          scrollTo: {
            y: document.getElementById(hash),
            autoKill: false,
            offsetY: 0,
          },
        })
      }
    })
  })
}
