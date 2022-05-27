const Event = {
	addStyle(obj) {
		Object.keys(obj).forEach(el => {
			this.style.setProperty(el, obj[el], '')
		})
	},
	removeStyle(arr) {
				arr.forEach(el => {
			this.style.removeProperty(el)
		})
	},
	click(cb) {
		this.addEventListener('click', cb, false)
	},
	dragstart(cb) {
		this.addEventListener('dragstart', cb, false)
	},
	dragend(cb) {
		this.addEventListener('dragend', cb, false)
	},
	drag(cb) {
		this.addEventListener('drag', cb, false)
	},
	dragenter(cb) {
		this.addEventListener('dragenter', cb, false)
	},
	dragover(cb) {
		this.addEventListener('dragover', cb, false)
	},
	dragleave(cb) {
		this.addEventListener('dragleave', cb, false)
	},
	mousedown(cb) {
		this.addEventListener('mousedown', cb, false)
	},
	mousemove(cb) {
		this.addEventListener('mousemove', cb, false)
	},
	mouseup(cb) {
		this.addEventListener('mouseup', cb, false)
	},
}
export default Object.assign(HTMLElement.prototype, Event)