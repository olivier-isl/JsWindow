import {EventWindow} from './Class/Window.mjs'

// Create obj
document.querySelectorAll('[window], window').forEach((dom, _i) => {
	dom.createWindow()
})