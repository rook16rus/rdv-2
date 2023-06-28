export default function inputPlaceholder() {
    const inputs = document.querySelectorAll('.input');

    inputs.forEach(input => {
        const wrapper = input.closest('.input-wrapper');
        if (!wrapper) return

        input.addEventListener('focus', () => wrapper.classList.add('active'))

        input.addEventListener('blur', () => {
            const value = input.value;
            value ? wrapper.classList.add('active') : wrapper.classList.remove('active');
        })

        /*input.addEventListener('input', () => {
          const value = input.value;
          value ? label.classList.add('active') : label.classList.remove('active');
        })*/
    })
}
