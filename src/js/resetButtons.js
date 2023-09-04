export default function resetButtons() {
    const buttons = document.querySelectorAll('.js-reset-button');

    buttons.forEach(button => {
        const form = button.closest('form');
        const input = form.querySelector('.js-reset-input');

        button.style.display = "none";

        input.addEventListener('input', () => {
            if (input.value !== '') {
                button.style.display = "flex";
            } else {
                button.style.display = "none";
            }
        })

        button.addEventListener("click", () => {
            button.style.display = "none";
            input.value = "";
        })
    })
}
