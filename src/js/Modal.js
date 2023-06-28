export class Modal {
    constructor(options) {
        let defaultOptions = {
            isOpen: () => { },
            isClose: () => { },
        }
        this.options = Object.assign(defaultOptions, options);
        this.modals = Array.from(document.querySelectorAll('.modal'));
        this.speed = false;
        this.animation = false;
        this.isOpen = false;
        this.modalContainer = false;
        this.previousActiveElement = false;
        this.fixBlocks = document.querySelectorAll('.fix-block');
        this.focusElements = [
            'a[href]',
            'input',
            'button',
            'select',
            'textarea',
            '[tabindex]'
        ];
        this.events();
    }


    events() {
        if (this.modals.length) {
            document.addEventListener('click', function (e) {
                const clickedElement = e.target.closest('[data-path]');
                if (clickedElement) {
                    let target = clickedElement.dataset.path;
                    let animation = clickedElement.dataset.animation;
                    let speed = clickedElement.dataset.speed;
                    let overlay = clickedElement.dataset.overlay;
                    this.animation = animation ? animation : 'fade';
                    this.speed = speed ? parseInt(speed) : 300;
                    this.overlay = overlay ? overlay : "rgba($color: #1e1e1e, $alpha: 60%)";

                    if (window.openedModal) {
                        const prevModalId = window.openedModal.dataset.target;
                        const newOpenModal = document.querySelector(`[data-target="${target}"]`);
                        const prevButton = newOpenModal.querySelector('.modal-prev');

                        if (prevButton && !clickedElement.classList.contains('modal-prev')) {
                            prevButton.dataset.path = prevModalId;
                        }

                        this.close(true);
                    }

                    this.modalContainer = document.querySelector(`[data-target="${target}"]`);
                    this.open(this.modalContainer.closest(".modal"));
                    return;
                }

                if (e.target.closest('.modal-close')) {
                    this.close();
                    return;
                }
            }.bind(this));

            window.addEventListener('keydown', function (e) {
                if (e.keyCode == 27) {
                    if (this.isOpen) {
                        this.close();
                    }
                }

                if (e.keyCode == 9 && this.isOpen) {
                    this.focusCatch(e);
                    return;
                }

            }.bind(this));

            this.modals.forEach((mdl)=>{
                mdl.addEventListener('click', function (e) {
                    if (!e.target.classList.contains('modal__container') && !e.target.closest('.modal__container') && this.isOpen) {
                        this.close();
                    }
                }.bind(this));
            });
        }
    }

    onOpen(element, anima, sped) {
        let target = element;
        let animation = anima;
        let speed = sped;
        this.animation = animation ? animation : 'fade';
        this.speed = speed ? parseInt(speed) : 300;
        if (window.openedModal) {
            this.close();
        }
        this.modalContainer = document.querySelector(`[data-target="${target}"]`);
        this.open(this.modalContainer.closest(".modal"));
    }

    open(thisModal) {

        this.previousActiveElement = document.activeElement;

        thisModal.style.setProperty('--transition-time', `${this.speed / 1000}s`);
        thisModal.style.backgroundColor = this.overlay;
        thisModal.classList.add('is-open');
        window.openedModal = this.modalContainer;
        this.disableScroll();

        this.modalContainer.classList.add('modal-open');
        this.modalContainer.classList.add(this.animation);

        setTimeout(() => {
            this.options.isOpen(this);
            this.modalContainer.classList.add('animate-open');
            this.isOpen = true;
            this.focusTrap();
        }, this.speed);
    }

    close(isNewModalOpen) {
        if (this.modalContainer) {
            this.modalContainer.classList.remove('animate-open');
            this.modalContainer.classList.remove(this.animation);
            this.modals.forEach(mdl => {
                mdl.classList.remove('is-open');
            })
            this.modalContainer.classList.remove('modal-open');

            let isRegistrationModal = false;

            if (!isNewModalOpen && this.modalContainer.classList.contains('modal-registration')) {
                isRegistrationModal = true;
            }

            this.enableScroll();
            this.options.isClose(this);
            this.isOpen = false;
            this.focusTrap();
            this.modalContainer = null;
            window.openedModal = null;

            if (isRegistrationModal) {
                this.onOpen('sure');
            }
        }
    }

    focusCatch(e) {
        const focusable = this.modalContainer.querySelectorAll(this.focusElements);
        const focusArray = Array.prototype.slice.call(focusable);
        const focusedIndex = focusArray.indexOf(document.activeElement);

        if (e.shiftKey && focusedIndex === 0) {
            focusArray[focusArray.length - 1].focus();
            e.preventDefault();
        }

        if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
            focusArray[0].focus();
            e.preventDefault();
        }
    }

    focusTrap() {
        const focusable = this.modalContainer.querySelectorAll(this.focusElements);
        if (this.isOpen) {
            focusable[0].focus();
        } else {
            if (this.previousActiveElement.closest('.swiper')) return
            this.previousActiveElement.focus();
        }
    }

    disableScroll() {
        let pagePosition = window.scrollY;
        this.lockPadding();
        document.body.classList.add('disable-scroll');
        document.body.dataset.position = pagePosition;
        document.body.style.top = -pagePosition + 'px';
    }

    enableScroll() {
        let pagePosition = parseInt(document.body.dataset.position, 10);
        this.unlockPadding();
        document.body.style.top = 'auto';
        document.body.classList.remove('disable-scroll');
        window.scroll({ top: pagePosition, left: 0 });
        document.body.removeAttribute('data-position');
    }

    lockPadding() {
        let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
        this.fixBlocks.forEach((el) => {
            el.style.paddingRight = paddingOffset;
        });
        document.body.style.paddingRight = paddingOffset;
    }

    unlockPadding() {
        this.fixBlocks.forEach((el) => {
            el.style.paddingRight = '0px';
        });
        document.body.style.paddingRight = '0px';
    }
}
