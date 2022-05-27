import * as Event from './Event.mjs'
import EventWindow from './Window.mjs'

// Create obj

let obj = {}

document.querySelectorAll('[data-obj]').forEach((dom, i) => {
	obj[dom.dataset.obj] = new EventWindow(dom, i)
})

let currentDrag = null;
let currentZindex = Object.keys(obj).length
let clone = null

Object.values(obj).forEach(el => {
	el.dom.click(() => {
		Object.values(obj).forEach(item => {
			item.style.set({zIndex: 0})
			item.render()
		})
		if(currentDrag) {
			currentDrag.style.set({zIndex: currentZindex-1})
			currentDrag.render()
		}
		currentDrag = el
		currentDrag.zIndex = currentZindex
		el.style.set({zIndex: currentZindex})
		el.render()
	})
})


document.body.dragstart(e => {
	Object.values(obj).forEach(el => {
		el.style.set({zIndex:0})
		el.render()
	})
	if(currentDrag) {
		currentDrag.style.set({zIndex: currentZindex-1})
		currentDrag.render()
	}
	currentDrag = obj[e.target.closest('[data-obj]').dataset.obj]
	currentDrag.style.set({zIndex : currentZindex})

	clone = currentDrag.cloning()
	document.body.appendChild(clone)
	currentDrag.dom.addStyle({opacity: 0})
	currentDrag.drag(e)
	clone.addStyle(currentDrag.style.get())
})

document.body.dragover((e) => {
	currentDrag.drag(e)
	clone.addStyle(currentDrag.style.get())
})

document.body.dragend((e) => {
	currentDrag.dom.removeStyle(['opacity'])
	document.body.removeChild(clone)
})




