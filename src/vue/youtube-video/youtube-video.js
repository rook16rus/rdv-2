export default class YoutubeVideo {
	constructor(el,selector,modal) {
		this.root = el;
		this.videoUrl = this.root.getAttribute(selector);
		if (!this.root && !this.videoUrl) return false;
		this.modal = modal
		this._init();

		var tag = document.createElement("script");
		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName("script")[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	}

	_createIframe() {
		let iframe = document.createElement('iframe');

		[
			{ attribute: 'src', value: `https://www.youtube.com/embed/${this.videoUrl}?rel=0&autoplay=1` },
			{ attribute: 'frameborder', value: 0 },
			{ attribute: 'vspace', value: 0 },
			{ attribute: 'hspace', value: 0 },
			{ attribute: 'webkitallowfullscreen', value: true },
			{ attribute: 'mozallowfullscreen', value: true },
			{ attribute: 'allowfullscreen', value: true },
			{ attribute: 'scrolling', value: 'no' },
			{ attribute: 'allow', value: 'autoplay; encrypted-media' }
		].forEach(param => {
			iframe.setAttribute(param.attribute, param.value);
		});

		iframe.style.setProperty('display', 'block');

		this.iframe = iframe;

		return iframe;
	}

	_init() {
		let iframe = this._createIframe();
		this.root.append(iframe);
		if(this.modal){
			this.modal.addEventListener('modal:close', e => {
				this.root.innerHTML = '';
			});
			this.modal.addEventListener('modal:open', e => {
				this.root.append(iframe);
			});
		}

	}
}
