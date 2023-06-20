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

export default function customSelects() {
    const customSelects = Array.from(document.querySelectorAll('.js-custom-select'));

    if (!window.customSelects) {
      window.customSelects = {};
    }

    customSelects.forEach((select) => {
        const choice = new Choices(select, {
          searchEnabled: false,
          itemSelectText: '',
          shouldSort: false,
          allowHTML: true,

        });
    });
}


window.initCustomSelects = customSelects;
