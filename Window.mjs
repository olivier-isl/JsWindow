class EventWindow {
	modules = [];
	name;
	isWided = false;
	dom;
	width		= 600;
	height		= 600;
	x			= window.innerWidth/2- this.width/2;
	y			= window.innerHeight/2-this.height/2;
	z			= 0;
	left = 0;
	top = 0;
	zIndex;
	oldzIndex = this.zIndex;

	oldX 		= this.x
	oldY 		= this.y
	oldWidth = this.width
	oldHeight = this.height
	oldLeft = this.left;
	oldTop = this.top;

	constructor(dom, _index) {
		const sep = _index*40
		this.name = dom.dataset.obj
		this.isWided = false;
		this.dom = dom;
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

	resize() {
		const scope = this
		function mod() {
			scope.width = scope.dom.style.width
			scope.height = scope.dom.style.height
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
			this.render()
			setTimeout(() => {
				this.dom.classList.remove('animated')
			}, 100)
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
				return `translate3d(${this.x}px, ${this.y}px, ${this.z}px)`
			},
			set: (x,y,z) => {
				this.x = x
				this.y = y
				this.z = z

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
		console.log(window.currentDrag)
		if(window.currentDrag) {
			this.style.set({zIndex: window.currentZindex-1})
			this.render()
		}
		window.currentDrag = this.dom
		this.style.set({zIndex : window.currentZindex})
		console.log(window.currentDrag)
	}

	render() {
		this.dom.addStyle(this.style.get())
	}

	static getInstance(dom, _i) {
		EventWindow.instance[dom.dataset.obj] = new EventWindow(dom, _i);
		return EventWindow.instance[dom.dataset.obj];
	  }
}

EventWindow.instance = [];

export default EventWindow