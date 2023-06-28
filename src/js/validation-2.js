import 'parsleyjs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import $ from "jquery";

dayjs.extend(customParseFormat);

window.Parsley.addValidator('requiredIfChecked', {
    requirementType: 'string',
    validateString: function (value, requirement) {

        const checkbox = document.querySelector(requirement);

        if (!checkbox) {
            return false;
        }

        if (checkbox.checked && !value.trim()) {
            return false;
        }

        return true;
    },
    messages: {
        en: 'Required field',
        ru: 'Обязательное поле',
    },
    priority: 33,
});

window.Parsley.addValidator('onl', {
    requirementType: 'string',
    validateString: function (value) {
        if (value.trim() === '') return true;
        return /^\+?\d+$/.test(value);
    },
    messages: {
        en: 'Only numbers allowed"',
        ru: 'Допустимо использовать только цифры',
    },
    priority: 51
})

window.Parsley.addValidator('phone', {
    requirementType: 'string',
    validateString: function (value) {
        if (value.trim() === '') return true;
        return /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(value);
    },
    messages: {
        en: 'This value should be a mobile number',
        ru: 'Введите правильный номер мобильного телефона',
    },
});

window.Parsley.addValidator('date', {
    requirementType: 'string',
    validateString: function (value) {
        if (value.trim() === '') return true;
        return dayjs(value, 'DD.MM.YYYY', true).isValid();
    },
    messages: {
        en: 'Enter correct date',
        ru: 'Введите правильно дату',
    },
});

window.Parsley.addValidator('fio', {
    requirementType: 'string',
    validateString: (value) => {
        if (value.trim() === '') return true;
        return /^[a-яA-Я\s]+$/.test(value);
    },
    messages: {
        en: 'This value should be a name',
        ru: 'Допустимо использовать только латинские и русские буквы'
    },
});


window.Parsley.addValidator('lenght', {
    requirementType: 'string',
    validateString: (value, maxLength) => {
        if (maxLength < value.length) return false;
    },
    messages: {
        en: 'Field accepts less than 1000 characters',
        ru: 'Поле принимает менее 1000 символов'
    },
});

window.Parsley.addValidator('maxFileSize', {
    validateString: function (_value, maxSize, parsleyInstance) {
        let files = parsleyInstance.$element[0].files;

        return files.length != 1 || files[0].size <= maxSize * 1024 * 1024;
    },
    requirementType: 'integer',
    messages: {
        en: 'The file size should not exceed %s MB',
        ru: 'Размер файла не должен превышать %s МБ',
    }
});

window.Parsley.addValidator('fileType', {
    requirementType: 'string',
    validateString: function (_value, maxSize, parsleyInstance) {
        const types = ["pdf", "doc", "docx", "jpg", "jpeg", "png"]

        let files = parsleyInstance.$element[0].files;
        let uploadedFileType = files[0].name.match(/\w+$/gi)[0];

        const filtederType = types.includes(uploadedFileType);

        return filtederType;
    },
    messages: {
        en: 'Valid file format pdf, doc, docx, jpg, png',
        ru: 'Допустимый формат файлов pdf, doc, docx, jpg, png',
    }
});

Parsley.addMessages('ru', {
    defaultMessage: 'Некорректное значение.',
    type: {
        email: 'Некорректный адрес',
        url: 'Адрес сайта введен неверно',
        number: 'Допустимо использовать только цифры',
        integer: 'Введите целое число',
        digits: 'Введите только цифры',
        alphanum: 'Введите буквенно-цифровое значение',
    },
    notblank: 'Это поле должно быть заполнено',
    required: 'Это поле должно быть заполнено',
    pattern: 'Это значение некорректно',
    min: 'Это значение должно быть не менее чем %s',
    max: 'Это значение должно быть не более чем %s',
    range: 'Это значение должно быть от %s до %s',
    minlength: 'Это значение должно содержать не менее %s символов.',
    maxlength: 'Это значение должно содержать не более %s символов.',
    length: 'Это значение должно содержать от %s до %s символов',
    mincheck: 'Выберите не менее %s значений',
    maxcheck: 'Выберите не более %s значений',
    check: 'Выберите от %s до %s значений',
    equalto: 'Это значение должно совпадать',
});

Parsley.setLocale('ru');

export default function validation2() {
    const formsToValidate = Array.from(document.querySelectorAll('form[data-need-validation2]'));

    formsToValidate.forEach((form) => {
        const selects = form.querySelectorAll('select');

        selects.forEach(select => {
            select.addEventListener('change', () => {
                $(select).parsley().validate()
            });
        })

        $(form).parsley({
            errorsContainer: function (field) {
                return field.$element.closest('.input-wrapper');
            },
            focus: 'none',
            errorClass: 'is-error',
            successClass: 'success',
            classHandler: (field) => {
                return field.$element.closest('.js-validation-wrapper');
            },
            trigger: 'change'
        });

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            let formData = new FormData(form);
            const url = form.getAttribute("action");

            if (form.closest("div[data-target='event']") || form.closest("div[data-target='order']")) return

            if ($(form).parsley().isValid()) {
                axios.post(url, formData)
                    .then((response) => {
                        window.rdv_API.modal.close();
                        window.rdv_API.modal.onOpen("success");

                        $(form).trigger("reset");
                    })
                    .catch((error) => {
                        console.log(error.message);
                        window.rdv_API.modal.close();
                        window.rdv_API.modal.onOpen("error");
                    });
            }
        });
    });
}
