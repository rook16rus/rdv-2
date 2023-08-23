export default function noDigits() {
    const inputs = document.querySelectorAll('input');

    inputs.forEach(input => {
        input.addEventListener('keypress', (event) => {
            if ("1234567890".indexOf(event.key) !== -1) {
                event.preventDefault();
            }
        })
    })
}