/**
 * This software is Copyright (C) 2021 Tod G. Harter. All rights reserved.
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
class HorizontalSash extends HTMLElement {
	/**
	Sash component, provides two slots, one for the left and one for the right, and allows dragging of the middle bar between the two in
	order to resize them.
	 */
	static #template;
	static {
		this.template = document.createElement('template');
		this.template.innerHTML = `<div class='sash' style='display: flex;' part='container'>
				<div class='sashleft' part='sashleft' id='sashleft'><slot name='sashleft'>LEFT SLOT</slot></div>
				<div class='dragbar' part='dragbar' id='dragbar' style='cursor: col-resize;'>&nbsp;</div>
				<div class='sashright' part='sashright' id='sashright' style='flex: 1;'><slot name='sashright'>RIGHT SLOT</slot></div>
			</div>`;
		}
	#leftwidth = 0;
	#x = 0;
	#y = 0;
	#mmh;
	#muh;
	#mdh;
	
	constructor() {
		super();
		const content = HorizontalSash.template.content;
        const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(content.cloneNode(true));
	}
	
	connectedCallback() {
		const dragbar = this.shadowRoot.getElementById('dragbar');
		this.mmh = this.mouseMoveHandler.bind(this);
		this.mdh = this.mouseDownHandler.bind(this);
		this.muh = this.mouseUpHandler.bind(this);
		dragbar.addEventListener('mousedown',this.mdh);
	}
	
	mouseDownHandler(e) {
		this.x = e.clientX;
		this.y = e.clientY;
		const sashleft = this.shadowRoot.getElementById('sashleft');
		this.leftWidth = sashleft.getBoundingClientRect().width;
		document.addEventListener('mousemove',this.mmh);
		document.addEventListener('mouseup',this.muh);
	}
	
	mouseMoveHandler(e) {
		const dx = e.clientX - this.x;
		const dy = e.clientY - this.y;
		const dragbar = this.shadowRoot.getElementById('dragbar');
		const sashleft = this.shadowRoot.getElementById('sashleft');
		const sashright = this.shadowRoot.getElementById('sashright');
		
		const newLeftWidth = ((this.leftWidth + dx) * 100) / dragbar.parentNode.getBoundingClientRect().width;
		sashleft.style.width = `${newLeftWidth}%`;
		
		document.body.style.cursor = 'col-resize';
		
		sashleft.style.userSelect = 'none';
		sashleft.style.pointerEvents = 'none';
		
		sashright.style.userSelect = 'none';
		sashright.style.pointerEvents = 'none';
	}
	
	mouseUpHandler(e) {
		const dragbar = this.shadowRoot.getElementById('dragbar');
		const sashleft = this.shadowRoot.getElementById('sashleft');
		const sashright = this.shadowRoot.getElementById('sashright');

		dragbar.style.cursor = 'col-resize';
		document.body.style.removeProperty('cursor');
		
		sashleft.style.removeProperty('user-select');
		sashleft.style.removeProperty('pointer-events');
		
		sashright.style.removeProperty('user-select');
		sashright.style.removeProperty('pointer-events');
		
		document.removeEventListener('mousemove',this.mmh);
		document.removeEventListener('mouseup',this.muh);
	}
}

window.customElements.define('horizontal-sash',HorizontalSash);
