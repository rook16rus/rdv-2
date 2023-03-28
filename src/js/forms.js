export default function forms() {
  const forms = Array.from(document.querySelectorAll('.js-handle-form'));
  forms.forEach(form => {
    const url = form.action;
    const submitBtn = form.querySelector('.js-submit-form');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      form.classList.add('loading');
      submitBtn.classList.add('disabled');
      submitBtn.setAttribute('disabled', true);

      const formData = new FormData(form);

      fetch(url, {
          body: formData,
          method: "POST"
        })
        .then(response => {
          if (response.ok) {
            window.onSuccess && window.onSuccess(response, form, formData);
          } else {
            window.onError && window.onError(response, form, formData);
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          submitBtn.classList.remove('disabled');
          submitBtn.removeAttribute('disabled');
          form.classList.remove('loading');
        })
    })
  })
}