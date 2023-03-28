var body = document.getElementsByTagName('body')[0];
var bodyScrollTop = null;
var locked = false;

// Заблокировать прокрутку страницы
function lockScroll(){
	if (!locked) {
		bodyScrollTop = (typeof window.pageYOffset !== 'undefined') ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
		body.classList.add('scroll-locked');
		body.style.top = `-${bodyScrollTop}px`;
		locked = true;
	};
}

// Включить прокрутку страницы
function unlockScroll(){
	if (locked) {
		body.classList.remove('scroll-locked');
		body.style.top = null;
		window.scrollTo(0, bodyScrollTop);
		locked = false;
	}
}

export {lockScroll, unlockScroll}