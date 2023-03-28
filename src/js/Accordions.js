import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default class Accordions {
    constructor(props, container) {
        const defaultConfig = {
            selectors: {
                container: null,
                wrapper: '.js-accordion',
                button: '.js-accordion-btn',
                content: '.js-accordion-content'
            },
            activeClass: 'active',
            speed: 0.3
        };

        this.config = Object.assign(defaultConfig, props);

        this.config.selectors.container ? (this.container = this.config.selectors.container) : (this.container = document);

        this.setEventListeners();
    }

    setEventListeners() {
        const elements = [...this.container.querySelectorAll(this.config.selectors.wrapper)];

        document.addEventListener('click', event => {
            if (event.target.matches(this.config.selectors.button) || event.target.closest(this.config.selectors.button)) {
                const btn = event.target.matches(this.config.selectors.button) ? event.target : event.target.closest(this.config.selectors.button);
                const element = btn.closest(this.config.selectors.wrapper);
                const content = element.querySelector(this.config.selectors.content);

                event.preventDefault();

                elements.forEach(otherElement => {
                    if (otherElement !== element) {
                        if (otherElement.classList.contains(this.config.activeClass)) {
                            const content = otherElement.querySelector(this.config.selectors.content);
                            this._close(content);
                            otherElement.classList.remove(this.config.activeClass);
                        }
                    }
                });

                if (element.classList.contains(this.config.activeClass)) {
                    this._close(content);
                } else {
                    this._open(content);
                }
                element.classList.toggle(this.config.activeClass);
            }
        });
    }

    _open(element) {
        gsap.to(element, {
            height: 'auto',
            duration: this.config.speed,
            onComplete: () => ScrollTrigger.refresh()
        });
    }

    _close(element) {
        gsap.to(element, {
            height: 0,
            duration: this.config.speed,
            onComplete: () => ScrollTrigger.refresh()
        });
    }
}
