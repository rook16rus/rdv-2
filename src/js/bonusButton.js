export default function bonusButton() {
    const containers = document.querySelectorAll('.basic-services__bonus');

    containers.forEach(container => {
        const button = container.querySelector('.basic-services__bonus-button');

        button.addEventListener('click', () => {
            container.classList.toggle('active');
        })
    })
}