export default function noDigits() {
    const inputs = document.querySelectorAll('input[data-parsley-pattern]:not([data-parsley-pattern=""])');

    inputs.forEach(input => {
        input.addEventListener('keypress', (event) => {
            if (input.dataset.parsleyPattern) {
                if ("1234567890".indexOf(event.key) !== -1) {
                    event.preventDefault();
                }
            }
        })
    })
}
