class EventWindow {
	name;
	isWided = false;
	dom;
	width		= 600;
	height		= 600;
	x			= window.innerWidth/2- this.width/2;
	y			= window.innerHeight/2-this.height/2;
	z			= 0;
	zIndex;
	oldzIndex = this.zIndex;

	oldX 		= this.x
	oldY 		= this.y
	oldWidth = this.width
	oldHeight = this.height

	constructor(dom, index) {
		this.name = dom.dataset.obj
		this.isWided = false;
		this.dom = dom;
		this.isExpanded = false

		this.transform = this.Transform().get()
		this.dom.addStyle(this.style.get())
		this.close()
		this.wide()
		this.expand()
		this.reduce();
		this.dbclick();
	}

	close() {
		this.dom.querySelector('.close').click(() => {
			this.remove()
		})
	}

	dbclick() {
		let clickCount = 0
		let singleClickTimer = null;
		this.dom.querySelector('.header').addEventListener('click',() => {
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
		})
	}
	
	reduce() {
		this.dom.querySelector('.reduce').click(() => {
			this.dom.classList.add('animated')
			if(this.height > 42) {
				this.style.set({
					y: window.innerHeight - 42,
					height : 42
				})
			} else {
				this.style.set({
					y: this.oldY,
					height : this.oldHeight
				})
			}
			this.render()
			setTimeout(() => {
				this.dom.classList.remove('animated')
			}, 100)
		})
	}

	expand() {
		const expand = this.dom.querySelector('.expand')
		expand.mousedown(e => {
			this.isExpanded = true
		})
		document.body.mousemove(e => {
			if(this.isExpanded) {
				console.log(e.clientX, e.clientY)
				this.style.set({
					width: this.width+(e.clientX-this.width)
				})
				this.render()
			}
		})
		document.body.mouseup(e => {
			this.isExpanded = false
		})
	}

	wideEvent() {
		this.dom.classList.add('animated')
		this.isWided = !this.isWided
		if(this.isWided) {
			this.style.set({
				x : 0,
				y : 0,
				width : window.innerWidth,
				height : window.innerHeight
			})
			console.log(this)
		} else {
			this.style.set({
				x : this.oldX,
				y : this.oldY,
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
		this.dom.querySelector('.wide').click(() => {
			this.wideEvent()
		})
	}

	remove() {
		this.dom.remove()
		delete obj[this.name]
		console.log(obj)
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
				'z-index' : this.zIndex
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

	drag(e) {
		this.style.set({
			x : (e.clientX - this.width/2),
			y: (e.clientY),
			oldX : (e.clientX - this.width/2),
			oldY : (e.clientY)
		})
		this.render();
	}

	cloning() {
		const clone = this.dom.cloneNode(true)
		clone.classList.replace('window', 'window-clone')
		clone.removeAttribute('data-obj')
		return clone;
	}

	render() {
		this.dom.addStyle(this.style.get())
	}
}

export default EventWindow