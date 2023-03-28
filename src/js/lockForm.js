export default function lockForm() {
  const forms = document.querySelectorAll('.js-lock-form');

  forms.forEach(form => {
    const submitButton = form.querySelector('.js-submit-form');
    const lockInputs = form.querySelectorAll('.js-lock-form-input');

    lockInputs.forEach(input => {
      input.addEventListener('change', () => {
        if ((input.type === "checkbox" || input.type === "radio") && input.checked
        || input.type != "checkbox" && input.type != "radio" && input.value.length) {
          submitButton.classList.remove('disabled');
          submitButton.removeAttribute('disabled');
        } else {
          submitButton.classList.add('disabled');
          submitButton.setAttribute('disabled', true);
        }
        });
      });
  })
}