import { html, LitElement } from 'https://unpkg.com/lit@2/index.js?module';

class MenuBar extends LitElement {
	clicked = false;
	menus = null;
	activeMenu = null;
	mish = null;
	menuHandler = null;
	moh = null;
	
	constructor() {
		super();
		this.mish = this.menuItemSelectedHandler.bind(this);
		this.moh = this.mouseOutHandler.bind(this);
	}
	
	render() {
		return html`<div id=container><slot>loading main menu</slot></div>`;
	}
	
	firstUpdated() {
		const container = this.shadowRoot.getElementById('container');
		const slot = container.firstChild;
		slot.addEventListener('slotchange', (e) => { 
			console.log("Slot changed "+e.innerHTML);
			const s = e.target;
			s.addEventListener('click', (e) => {
				console.log("clicked on the menu");
				if(this.clicked === false) {
					this.clicked = true;
					this.activeMenu = e.target.parentElement;
					this.menus = s.assignedElements();
					this.activateMenu();
					s.addEventListener('mouseout',this.moh);
				} else {
					this.clicked = false;
					this.activeMenu = null;
					this.activateMenu();
					s.removeEventListener('mouseout',this.moh);
				}
			});
		});
	}
	
	mouseOutHandler(e) {
		console.log("target was an "+e.target.nodeName);
		if(e.target.nodeName === 'DIV') {
			this.activeMenu = e.target;
			this.activateMenu();
		}
	}
	
	activateMenu() {
		this.menus.forEach((mitem) => {
			if(mitem === this.activeMenu) {
				mitem.classList.add('active');
				mitem.childNodes[1].classList.add('active');
				mitem.childNodes[1].addEventListener('click', this.mish);
//				mitem.childNodes[1].addEventListener('mouseover',this.mimih);
//				mitem.childNodes[1].addEventListener('mouseout',this.mimoh);
			} else {
				mitem.classList.remove('active');
				mitem.childNodes[1].classList.remove('active');
				mitem.childNodes[1].removeEventListener('click',this.mish);
//				mitem.childNodes[1].removeEventListener('mouseover',this.mimih);
//				mitem.childNodes[1].removeEventListener('mouseout',this.mimoh);
			}
		});
	}
	
	menuItemSelectedHandler(e) {
		console.log("item selected "+e.target.innerText);
		this.clicked = false;
		this.activeMenu = null;
		this.activateMenu();
		if(this.menuHandler !== null) {
			this.menuHandler(e.target.id);
		}
		//NOTE: event handler custom event dispatch is a fantasy, this does not work, AT ALL.
//		const event = new CustomEvent('menuitem-selected', {bubbles: true, composed: true, detail: e.target.innerHTML});
//		this.dispatchEvent(event);
	}
}

window.customElements.define('menu-bar', MenuBar);
