const createCustomError = (errorText, tooltipText) => {
	return `
	<div class="custom-error">
		<span class="custom-error__label">${errorText}</span>
		<span class="custom-error__tooltip-ico">
			<svg width="12px" height="12px" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
				<circle cx="6" cy="6" r="5.5" stroke="#FF3645"/>
				<path d="M5.85144 8.99998C6.2122 8.99998 6.50464 8.71197 6.50464 8.35668C6.50464 8.00139 6.2122 7.71338 5.85144 7.71338C5.49069 7.71338 5.19824 8.00139 5.19824 8.35668C5.19824 8.71197 5.49069 8.99998 5.85144 8.99998Z" fill="#FF3645"/>
				<path fill-rule="evenodd" clip-rule="evenodd" d="M4 4.9296C4.05312 3.7379 4.69274 3 6.00068 3C6.92134 3 8.13341 3.5466 7.98806 4.8497C7.93964 5.2851 7.85963 5.38116 7.52113 5.66197C7.34386 5.80902 7.05796 5.95864 6.87504 6.09861C6.54083 6.35434 6.23917 6.52073 6.23917 6.92716C6.23917 7.0407 6.20899 7.18894 6.25077 7.2879C6.25063 7.30091 6.25077 7.27429 6.25077 7.2879H5.33182C5.33182 7.20652 5.3308 7.1271 5.32981 7.04986C5.32426 6.61661 5.31959 6.25241 5.50051 6C5.61597 5.83887 5.81445 5.73935 6.0139 5.63935C6.75 5.25 6.9213 4.8172 6.79055 4.5062C6.65981 4.1952 6.50085 4 6.00068 4C5.25 4 5.01505 4.5168 5.00034 4.9296H4Z" fill="#FF3645"/>
			</svg>
			<div class="info__content custom-error__tooltip">
				<div class="t-base t-base--size--small t-base--color--gray-dark v-indent v-indent--red">
					${tooltipText}
				</div>
			</div>
		</span>
	</div>
	`
}

export { createCustomError }
