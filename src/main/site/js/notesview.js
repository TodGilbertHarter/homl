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
import { html, LitElement } from 'lit2';
import {repeat} from 'lit2/repeat';
import {ref, createRef } from 'lit2/ref';

class NoteView extends LitElement {
	static properties = {
		text: {},
		timestamp: {},
		id: {},
		editenabled: {},
		actionenabled: {}
	}
	
	constructor() {
		super();
		this.text = null;
		this.timestamp = 0;
		this.id = null;
		this.editenabled = 'false';
		this.actionenabled = false;
	}

	actionSelected() {
		this.dispatchEvent(new CustomEvent('noteaction',{bubbles: true, composed: true, detail: {noteid: this.id}}));
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
			<p>${this.text}</p>
			<div>${this.renderActionButton()}${this.renderEditButton()}</div>
		</div>`;
	}
}

window.customElements.define('note-view',NoteView);

class NotesViewer extends LitElement {
	static properties = {
		actionenabled: {},
		editenabled: {},
		notes: {attribute: false, state: true}
	}
	
	constructor() {
		super();
		this.actionenabled = 'false';
		this.editenabled = 'false';
		this.notes = [];
	}
	
	render() {
		return html`<span>${repeat(this.notes,(item,index) => html`<note-view actionenabled='${this.actionenabled}' editenabled='${this.editenabled}' text="${item.text}" timestamp=${item.timestamp} id=${item.id}></note-view>`)}</span>`;
	}
}

window.customElements.define('notes-viewer',NotesViewer);