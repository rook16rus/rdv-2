/* ######

Как пользоваться:

Добавить CSS-класс .js-custom-select select'у.

Пример:

<select class="js-custom-select">
  <option>Пункт 1</option>
  <option>Пункт 2</option>
</select>

###### */

import Choices from 'choices.js';
import SimpleBar from "simplebar";

export default function customSelects2() {
    const customSelects = Array.from(document.querySelectorAll('.js-custom-select-2'));

    if (!window.customSelects) {
        window.customSelects = {};
    }

    customSelects.forEach((select) => {
        const choice = new Choices(select, {
            searchEnabled: false,
            itemSelectText: '',
            shouldSort: false,
            allowHTML: true,
            callbackOnInit: function () {
                new SimpleBar(this.dropdown.element, {autoHide: false})
                this.containerOuter.element.setAttribute('tabindex', "-1")
            }
        });

        window.customSelects[select.name] = choice;

        if (window[select.name]) {
            if (window[select.name].tagName === 'SELECT') {
                window[select.name] = [];
            }
            window[select.name].push(choice)
        } else {
            window[select.name] = [];
            window[select.name].push(choice)
        }
    });
}


window.initCustomSelects = customSelects2;
