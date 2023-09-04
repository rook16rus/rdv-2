import catalog from "./catalog";

export default function catalogAdaptive() {
  const catalogSection = document.querySelector('.catalog')
  if (!catalogSection) return

  const dateButton = catalogSection.querySelector('.catalog__date-button');
  const dotesButton = catalogSection.querySelector('.catalog__tags-more');
  const tags = catalogSection.querySelectorAll('.catalog__tag');
  const tagsMoreButton = catalogSection.querySelector('.catalog__tags-more');
  const modalTags = document.querySelector('.modal-tags');
  const modalTagsContents = modalTags.querySelectorAll('.modal-tags__content');
  const modalTagsTitle = modalTags.querySelector('.modal-tags__title');

  if (matchMedia('(max-width: 1024px)').matches) {
    dateButton.setAttribute("data-path", "dates");
    dotesButton.setAttribute("data-path", "tags");

    tags.forEach((tag, index) => {
      tag.setAttribute("data-path", "tags")

      const input = tag.querySelector('input');
      const tagText = tag.querySelector('label').textContent;

      input.addEventListener('click', (e) => {
        switchActiveSubtag(tagText, index + 1);
      })
    });

    tagsMoreButton.addEventListener('click', () => {
      switchActiveSubtag("Все теги", 0);
    })
  } else {
    catalog();
  }

  function switchActiveSubtag(tagText, index) {
    modalTagsContents.forEach(content => content.classList.remove('active'));
    modalTagsContents[index].classList.add('active');
    modalTagsTitle.textContent = tagText;
  }
}
