import * as _Event from './Event.mjs'
import EventWindow from './Window.mjs'


// Create obj
document.querySelectorAll('[data-obj]').forEach((dom, _i) => {
	EventWindow.getInstance(dom, _i)
})

window.currentDrag = null;
window.currentZindex = 100