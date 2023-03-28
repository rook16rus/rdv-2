function normalizeString(str) {
    return (typeof str === 'string') ? str.trim().toLowerCase() : false;
}

class FileUploader {
	constructor(props) {
		if (!this._initProps(props)) return false;

		this._binds();
		this._initRequired();
		this._addListeners();
	}
	_initProps(props) {
		if (!props.root && !props.element) return false;
		this.props = props;

		this.root = props.element || document.querySelector(`[${props.root}]`);

		if (this.root.hasAttribute(`${props.root}-inited`)) return false;
		this.root.setAttribute(`${props.root}-inited`, true);

		this.addButton = this.root.querySelector(`[${props.root}-button]`);
		this.list = this.root.querySelector(`[${props.root}-list]`);
		this.error = this.root.querySelector(`[${props.root}-error]`);

		this.itemTemplate = this.root.querySelector(`[${props.root}-item]`);
		this.itemTemplate.remove();

		this.filesList = [];

		return true;
	}
	_binds() {
		['_onChange', '_removeItem','_onDragover','_onDragleave', '_onDrop'].forEach(f => this[f] = this[f].bind(this));
	}
	_addListeners() {
		this.addButton.addEventListener('change', this._onChange);
		this.root.addEventListener('dragover', this._onDragover);
		this.root.addEventListener('dragleave', this._onDragleave);
		this.root.addEventListener('drop', this._onDrop);
	}
	_removeListeners() {
		this.addButton.removeEventListener('change', this._onChange);
	}
	_onChange(e) {
		this.root.classList.remove('is-error');
		this._updateFilesList(e.target);
	}
	_onDragover(e){
		e.preventDefault(); 
		this.root.classList.add('is-dropped')
	}
	_onDragleave(){
		this.root.classList.remove('is-dropped')
	}
	_onDrop(e){
		e.preventDefault();
		this.root.classList.remove('is-dropped')

		if (e.dataTransfer.items) {
			for (let i = 0; i < e.dataTransfer.items.length; i ++) {
				let file = e.dataTransfer.items[i].getAsFile();
				this._addItem(file.name, file);
			}
		}
	}
	_initRequired() {
		this._isRequired = this.root.hasAttribute('data-required');
		this.root.removeAttribute('required');
		this.required = false;
	}
	_addItem(name, file) {
		if(!this.isValid(file)) return false;
		this.filesList.push(file);
		let newItem = this.itemTemplate.cloneNode(true),
			nameElement = newItem.querySelector(`[${this.props.root}-name]`),
			deleteButton = newItem.querySelector(`[${this.props.root}-delete]`),
			thumbElement = newItem.querySelector(`[${this.props.root}-thumb]`),
			reader = new FileReader();

		if (nameElement) nameElement.innerHTML = name;
		deleteButton.name = name;
		deleteButton.addEventListener('click', this._removeItem);
		if (thumbElement) {
			reader.onload = function(e) {
				$(thumbElement).attr('src', e.target.result);
			}
			

		}
		reader.readAsDataURL(file); // convert to base64 string
		
		this.list.appendChild(newItem);
		setTimeout(_ => {
			newItem.classList.add('is-show');
		}, 0);
	}
	_removeItem(e) {
		let name = e.currentTarget.name,
			removedIndex = false, removedName;

		[...this.list.children].forEach((item, index) => {
			let deleteButton = item.querySelector(`[${this.props.root}-delete]`),
				itemName = normalizeString(deleteButton.name),
				targetName = normalizeString(name);

			if (itemName === targetName) {
				removedName = targetName;
				removedIndex = index;
			}
		});

		if (removedIndex !== false) {
			this.list.children[removedIndex].classList.remove('is-show');
			setTimeout(_ => {
				this.list.children[removedIndex].remove();
			}, 250);
			this._removeFile(removedName);
		}
	}
	_removeFile(name) {
		let removedIndex = false;

		this.filesList.forEach((file, index) => {
			let fileName = normalizeString(file.name),
				removedName = normalizeString(name);

			if (fileName === removedName) {
				removedIndex = index;
			}
		});

		if (removedIndex !== false) this.filesList.splice(removedIndex, 1);
	}
	_updateFilesList(fileInput) {
		let newFilesList = fileInput.files;

		for (let i = 0; i < newFilesList.length; i ++) {
			this._addItem(newFilesList[i].name, newFilesList[i]);
		}

		this.addButton.value = null;
	}
	_validateCount() {
		if (this.filesList.length+1 <= this.addButton.dataset.maxCount){
			return true;
		} else {
			this.errorMsg = `Максимальное число файлов ${this.addButton.dataset.maxCount}`
			return false;
		}
	}
	_validateFileSize(file) {
		let isValid = true;
	
		if (!((file.size / Math.pow(1024,2)) <= this.addButton.dataset.maxMb)){
			isValid = false;
			this.errorMsg = `Размер файла <b>${file.name}</b> превышает максимально допустимый в ${this.addButton.dataset.maxMb} Мбайт`;
		}

		return isValid;
	}
	_validateFileType(file) {
		let isValid = true,
		accept = this.addButton.accept.split(',');
	
		if (!accept.includes(file.type)){
			isValid = false;
			this.errorMsg = `Расширение файла <b>${file.name}</b> недопустимо`;
		}
		

		return isValid;
	}
	_validateFileDublicat(file) {
		let isValid = true,
		fileName = normalizeString(file.name),
		fileInListName;

		this.filesList.forEach((fileInList) => {
			fileInListName = normalizeString(fileInList.name);

			if (fileName === fileInListName) {
				isValid = false;
				this.errorMsg = `Файл с именем <b>${file.name}</b> уже загружен`;
			}
		});

		return isValid;
	}
	_isValid(file) {
		if (this._validateCount() && 
			this._validateFileSize(file) && 
			this._validateFileType(file) &&
			this._validateFileDublicat(file)){
			this._isInputValid = true;
		} else {
			this._isInputValid = false;
			this.error.innerHTML = this.errorMsg;
			this.root.classList.add('is-error');
			setTimeout(()=>{
				this.root.classList.remove('is-error');
			}, 5000)
		}
	}
	getInput() {
		return this.addButton;
	}
	getFilesList() {
		return this.filesList;
	}
	clearFilesList() {
		this.list.innerHTML = ''
		this.filesList = []
	}
	isRequired() {
		return this._isRequired;
	}
	isValid(file) {
		this._isValid(file);
		return this._isInputValid;
	}
	setFocus() {
		this.addButton.focus();
	}
	getName() {
		return this.root.name;
	}
	setError(text) {
		if (this.error) {
			this.error.innerHTML = text;
			this.root.classList.add('is-error');
		}
	}
	isDestroyed() {
		return this.isDestroyed;
	}
	destroy(deleteDom) {
		this.isDestroyed = true;

		this._removeListeners();
		if (deleteDom) {
			this.root.remove();
		}
	}
}

class FileUploaderFactory {
	constructor(props) {
		if (!props.root) return false;
		console.log('test')
		this.wrapper = props.wrapper || document;
		this.inputs = [];

		[...this.wrapper.querySelectorAll(`[${props.root}]:not([${props.root}-inited])`)].forEach(inputElement => {
			this.inputs.push(
				new FileUploader({
					root: props.root,
					element: inputElement
				})
			);
		});
	}
}

export {FileUploader, FileUploaderFactory}
