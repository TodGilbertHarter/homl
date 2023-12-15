/**
 * This software is Copyright (C) 2023 Tod G. Harter. All rights reserved.
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
import { html, LitElement, render, repeat, ref, createRef } from 'lit3';
import { DrawImageInstruction } from './imagerender.js';

/**
 * Displays information about an image.
 */
class ImageView extends LitElement {
	static properties = {
		id: {},
		uri: {},
		description: {},
		ownerid: {},
		editenabled: {},
		actionenabled: {}
	}
	
	constructor() {
		super();
		this.uri = null;
		this.description = null;
		this.ownerid = null;
		this.id = null;
		this.editenabled = 'false';
		this.actionenabled = false;
	}

	actionSelected() {
		this.dispatchEvent(new CustomEvent('imageaction',{bubbles: true, composed: true, detail: {imageid: this.id, uri: this.uri}}));
	}
	
	renderActionButton() {
		if(this.actionenabled !== 'false')
			return html`<button @click=${this.actionSelected}>${this.actionenabled}</button>`;
		else
			return null;
	}

	editSelected() {
		alert('edit selected');
	}
	
	renderEditButton() {
		if(this.editenabled !== 'false')
			return html`<button @click=${this.editSelected}>${this.editenabled}</button>`;
		else
			return null;
	}
	
	
	render() {
		return html`<div>
			<p>${this.description}</p>
			<div>${this.renderActionButton()}${this.renderEditButton()}</div>
		</div>`;
	}
}

window.customElements.define('image-view',ImageView);

class ImagesViewer extends LitElement {
	static properties = {
		actionenabled: {},
		editenabled: {},
		_images: {attribute: false, state: true}
	}
	
	set images(images) {
		this._images = images;
	}
	
	constructor() {
		super();
		this.actionenabled = 'false';
		this.editenabled = 'false';
		this._images = [];
	}

	lookupItem(id) {
		for(var i = 0; i < this._images.length; i++) {
			if(this._images[i].id === id) return this._images[i];
		}
		return null;
	}
	
	drawImage(id) {
		this.dialog = document.createElement('dialog-widget');
		this.dialog.setAttribute('left','550px');
		this.dialog.setAttribute('top','220px');
		const cr = document.createElement('canvas-renderer');
		const image = this.lookupItem(id);
		render(html`<div slot='content'>${cr}</div>`,this.dialog);
		const tag = document.querySelector('body');
		tag.appendChild(this.dialog);
		const ri = new DrawImageInstruction("imagesview image renderer",image.uri,0,0);
		cr.instructions = [ri];
	}
	
	renderImage(image) {
		return html`<image-view actionenabled=${this.actionenabled} editenabled=${this.editenabled} description=${image.description} id=${image.id} uri=${image.uri}></image-view>`
	}
	
	render() {
		return html`<span>${repeat(this._images,(item,index) => { return this.renderImage(item) })}</span>`;
	}
}

window.customElements.define('images-viewer',ImagesViewer);