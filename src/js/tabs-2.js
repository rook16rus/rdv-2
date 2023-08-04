import {disableScroll, enableScroll} from "./disableScroll";

export default function tabs2() {
    const tabsContainers = document.querySelectorAll('.js-tabs-container');

    tabsContainers.forEach(tabsContainer => {
        if (tabsContainer.dataset.noTablet && matchMedia('(max-width: 1024px)').matches) return

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

        if (tabsContainer.dataset.headerTab) {
            document.addEventListener('click', e => {
                if (contents.find(item => item.classList.contains('active')) !== undefined) {
                    const isHeaderTabTarget = contents.find(item => {
                        return  e.target.closest('.js-tab-content') ?
                                e.target.closest('.js-tab-content').className === item.className :
                                false
                    })

                    if (isHeaderTabTarget === undefined) {
                        contents.forEach(item => item.classList.remove('active'));
                        tabs.forEach(item => item.classList.remove('tab-active'));
                        scroll.classList.remove('active')
                    }
                }
            }, true)
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabActivate(tab.dataset.href, tab);
            }, true)
        })

        function tabActivate(id, tab) {
            if (tab.classList.contains('tab-active') && !tabsContainer.dataset.tabsLikeRadio) {
                tab.classList.remove('tab-active');
                if (scroll) scroll.classList.remove('active');
                if (tabsContainer.dataset.headerTab) {

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
