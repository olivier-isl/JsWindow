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
	attr() {
		return {
			title: (() => {
				console.log(this.getAttribute('attr-title'))
			})()
		}
	},
	createWindow(opts) {
		EventWindow.getInstance(this, opts)
	}
}
Object.assign(HTMLElement.prototype, Event);
Object.assign(NodeList.prototype, Event);

export class EventWindow {
	modules = [];
	name;
	isWided = false;
	dom;
	width		= 600;
	height		= 600;
	x			= window.innerWidth/2- this.width/2;
	y			= window.innerHeight/2-this.height/2;
	left = 0;
	top = 0;
	zIndex;
	oldzIndex = this.zIndex;
	content;

	oldX 		= this.x
	oldY 		= this.y
	oldWidth = this.width
	oldHeight = this.height
	oldLeft = this.left;
	oldTop = this.top;

	constructor(dom, _opts = null) {
		var currentDrag = null;
		var currentZindex = 100
		this.opts = _opts
		const sep = 40
		this.name = dom.dataset.obj
		this.isWided = false;
		this.dom = dom;
		this.content = dom.innerHTML
		this.createWindow()
		
		this.isExpanded = false
		this.style.set({
			x : this.oldX+=sep,
			y : this.oldY+=sep
		})

		this.transform = this.Transform().get()
		this.dom.addStyle(this.style.get())
		this.close()
		this.wide()
		this.reduce();
		this.dbclick();
		this.dragElement()
		this.click();
		this.resize()
	}

	createWindow() {
		if(!this.dom.classList.contains('window')){
			this.dom.classList.add('window')
		}
		this.createBody();
		this.createHeader("lorem ipsum");
		this.createFooter();
	}

	createHeader(_title = "test", window = this.dom) {
		const header = `<div class="header">
		<div class="left">${_title}</div>
		<div class="right">
			<span class="reduce">
				<i class="fa-solid fa-grip-lines"></i>
			</span>
			<span class="wide">
				<i class="fa-solid fa-expand"></i>
			</span>
			<span class="close">
				<i class="fa-solid fa-xmark"></i>
			</span>
		</div>
	</div>`;
		window.insertAdjacentHTML('afterbegin', header)
	}
	createBody(window = this.dom) {
		const body = document.createElement('div')
		body.classList.add('body');
		body.innerHTML = this.getContent()
		window.appendChild(body);
	}
	getContent() {
		const content = ""+this.content
		this.dom.innerHTML = "";
		return content;
	}
	createFooter(window = this.dom) {
		window.insertAdjacentHTML('beforeend', '<div class="footer"></div>')
	}

	resize() {
		// const scope = this
		const mod = () => {
			this.width = this.dom.style.width.slice(0, -2)
			this.height = this.dom.style.height.slice(0, -2)
		}
		mod()
		new ResizeObserver(mod).observe(this.dom)
	}

	close() {
		this.dom.querySelector('.close').onclick = () => {
			this.remove()
		}
	}

	dbclick() {
		let clickCount = 0
		let singleClickTimer = null;
		this.dom.querySelector('.header').onclick = () => {
			clickCount++;
			if(clickCount === 1) {
				singleClickTimer = setTimeout(() => {
					clickCount = 0;
				}, 400);
			} else if(clickCount === 2) {
				clickCount = 0
				clearTimeout(singleClickTimer);
				this.wideEvent()
			}
		}
	}
	
	reduce() {
		this.dom.querySelector('.reduce').onclick = () => {
			this.dom.classList.add('animated')
			if(this.height > 42) {
				this.style.set({
					y: window.innerHeight - 42,
					left : 0,
					top: 0,
					height : 42
				})
			} else {
				this.style.set({
					y: this.oldY,
					left : this.oldLeft,
					top : this.oldTop,
					height : this.oldHeight
				})
			}
			setTimeout(() => {
				this.dom.classList.remove('animated')
			},100)
		}
	}

	wideEvent() {
		this.dom.classList.add('animated')
		this.isWided = !this.isWided
		if(this.isWided) {
			this.style.set({
				x : 0,
				y : 0,
				left: 0,
				top: 0,
				width : window.innerWidth,
				height : window.innerHeight
			})
		} else {
			this.style.set({
				x : this.oldX,
				y : this.oldY,
				left : this.oldLeft,
				top: this.oldTop,
				width : this.oldWidth,
				height : this.oldHeight
			})
		}
		this.render()
		setTimeout(() => {
			this.dom.classList.remove('animated')
		}, 100)
	}

	wide() {
		this.dom.querySelector('.wide').onclick = () => {
			this.wideEvent()
		}
	}

	remove() {
		this.dom.remove()
		delete EventWindow.instance[this.name]
	}

	style = {
		set : (obj) => {
			Object.keys(obj).forEach(el => {
				this[el] = obj[el]
			})
			
		},
		get : () => {
			return {
				width : this.width+'px',
				height : this.height+'px',
				transform : this.Transform().get(),
				'z-index' : this.zIndex,
				left: this.left+'px',
				top : this.top+'px'
			}
		}
	}

	Transform() {
		return {
			get: () => { 
				return `translate3d(${this.x}px, ${this.y}px, 0px)`
			},
			set: (x,y) => {
				this.x = x
				this.y = y

				this.oldX = x
				this.oldY = y
			}
		}
	}

	dragElement() {
		let scope = this
		let pos1 = 0,
			pos2 = 0,
			pos3 = 0,
			pos4 = 0;
		if (this.dom.querySelector('.header')) {
			this.dom.querySelector('.header').onmousedown = dragMouseDown;
		} else {
			this.dom.onmousedown = dragMouseDown;
		}
		function dragMouseDown(e) {
			e = e || window.event;
			e.preventDefault();
			pos3 = e.clientX;
			pos4 = e.clientY;
			document.onmouseup = closeDragElement;
			document.onmousemove = elementDrag;

			Object.values(EventWindow.instance).forEach(item => {
				item.style.set({zIndex: 8})
				item.render()
			})
			if(window.currentDrag) {
				scope.style.set({zIndex: window.currentZindex-1})
				scope.render()
			}
			window.currentDrag = scope.dom
			scope.style.set({zIndex : window.currentZindex})
			}
	
		const elementDrag = (e) =>{
			e = e || window.event;
			e.preventDefault();
			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;
			this.style.set({
				top : this.dom.offsetTop - pos2,
				left : this.dom.offsetLeft - pos1
			})
			this.render()
		}
	
		const closeDragElement = () => {
			document.onmouseup = document.onmousemove = null
		}
	}

	click() {
		this.dom.onclick = () => {
			this.setZindex()
		}
	}

	setZindex() {
		Object.values(EventWindow.instance).forEach(item => {
			item.style.set({zIndex: 8})
			item.render()
		})
		if(window.currentDrag) {
			this.style.set({zIndex: window.currentZindex-1})
			this.render()
		}
		window.currentDrag = this.dom
		this.style.set({zIndex : window.currentZindex})
	}

	render() {
		this.dom.addStyle(this.style.get())
	}

	static getInstance(dom, opts = null) {
		EventWindow.instance[dom.dataset.obj] = new EventWindow(dom, opts);
		return EventWindow.instance[dom.dataset.obj];
	}
}

EventWindow.instance = [];



