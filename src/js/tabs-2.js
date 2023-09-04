import {disableScroll, enableScroll} from "./disableScroll";

export default function tabs2() {
    const tabsContainers = document.querySelectorAll('.js-tabs-container');

    tabsContainers.forEach((tabsContainer, index) => {
        if (tabsContainer.dataset.noTablet && matchMedia('(max-width: 1024px)').matches) return

        if (window.rdv.tabs[tabsContainer.className + index]) return;
        window.rdv.tabs[tabsContainer.className + index] = true;

        let contents = tabsContainer.querySelectorAll('.js-tab-content');
        contents = [...contents].filter(content => content.closest('.js-tabs-container').innerHTML === tabsContainer.innerHTML)

        let tabs = tabsContainer.querySelectorAll('.js-tab');
        tabs = [...tabs].filter(tab => tab.closest('.js-tabs-container').innerHTML === tabsContainer.innerHTML)

        let scroll = tabsContainer.querySelector('.js-tabs-scroll');
        if (scroll) {
            scroll = scroll.closest('.js-tabs-container').innerHTML === tabsContainer.innerHTML ?
                tabsContainer.querySelector('.js-tabs-scroll') :
                null;
        }
        if (tabsContainer.classList.contains('js-tabs-scroll')) {
            scroll = tabsContainer;
        }

        if (scroll) scroll.style.setProperty('--active-tab-width', tabs[0].clientWidth / 10 + 'rem');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabActivate(tab.dataset.href, tab);
            })
        })

        function tabActivate(id, tab) {
            if (tab.classList.contains('tab-active') && !tabsContainer.dataset.tabsLikeRadio) {
                tab.classList.remove('tab-active');
                if (scroll) scroll.classList.remove('active');
                if (tabsContainer.dataset.headerTab) {
                    enableScroll();
                    tabsContainer.querySelector('.header__tabs-contents').style.display = 'none';
                }
            } else {
                tabs.forEach((tab) => {
                    if (tab.dataset.href === id) {
                        tab.classList.add('tab-active');
                    } else {
                        tab.classList.remove('tab-active');
                    }
                });
                if (scroll) scroll.classList.add('active');
                if (tabsContainer.dataset.headerTab) {
                    disableScroll();
                    tabsContainer.querySelector('.header__tabs-contents').style.display = 'block';
                }
            }

            contents.forEach(tabContent => {
                if (tabContent.dataset.id === id) {
                    if (tabContent.classList.contains('active') && !tabsContainer.dataset.tabsLikeRadio) {
                        tabContent.classList.remove('active')
                    } else {
                        tabContent.classList.add('active')
                    }
                } else {
                    tabContent.classList.remove('active')
                }
            })

            const htmlFontSize = parseInt(window.getComputedStyle(document.documentElement).fontSize);

            if (scroll) {
                scroll.style.setProperty('--active-tab-offset', tab.offsetLeft + 'px');
                scroll.style.setProperty('--active-tab-width', tab.clientWidth + 'px');
            }
        }
    })
}

window.initTabs = tabs2;
