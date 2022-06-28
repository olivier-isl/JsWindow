import {EventWindow} from './Class/Window.mjs'

// Create obj
document.querySelectorAll('[window]').forEach((dom, _i) => {
	dom.createWindow()
})