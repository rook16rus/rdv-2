import intlTelInput from 'intl-tel-input';
import { InputFactory } from './old/Input';

export default function phoneCodes() {
  const urlElement = document.querySelector('.js-phone-codes-data');
  if (urlElement) {
    fetch(urlElement.dataset.url)
      .then(res => res.json())
      .then(data => {
        if (data.length) {
          const style = document.createElement("style")
          data.forEach(item => {
            style.textContent += `.iti__${item.code} { background-image: url("${item.flag}") !important; }`;
          })
          document.head.appendChild(style)
          
          const inputs = new InputFactory({selector: '.js-old-input'}, data);
        }
      })
  } else {
    console.warn('Телефонные коды не работают! Не найдена ссылка на json')
  }
}