export default function header() {
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (header.getBoundingClientRect().top > document.documentElement.getBoundingClientRect().top) {
            header.classList.add('header--fixed');
        } else {
            header.classList.remove('header--fixed');
        }
    });

    const search = header.querySelector('.header__search');
    const searchButton = header.querySelector('.header__search-button');

    searchButton.addEventListener('click', () => search.classList.toggle('active'))
    document.addEventListener('mousedown', e => {
        if (!e.target.closest('.header__search')) search.classList.remove('active');
    })
}
