import SimpleBar from "simplebar";

export default function simpleBar() {
    const simpleBars = document.querySelectorAll('.js-simplebar');

    simpleBars.forEach(el => {
        new SimpleBar(el, {autoHide: false})
    })
}

window.initSimpleBar = simpleBar;
