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
	}
}
export default [Object.assign(HTMLElement.prototype, Event), Object.assign(NodeList.prototype, Event)]