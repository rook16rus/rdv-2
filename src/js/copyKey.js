export default function copyKey() {
    const copyButton = document.querySelector('.access__item-copy-button');
    if (!copyButton) return

    copyButton.addEventListener('click', () => {
        const keyValue = document.querySelector('.access__item-key').value;

        navigator.clipboard.writeText(keyValue);
    })
}