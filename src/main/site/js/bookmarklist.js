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
import { html, LitElement, repeat, ref, createRef } from 'lit3';
import { IdConverter, EntityId } from './baserepository.js';
import { Task } from 'littask';

class BookMarkList extends LitElement {
	static properties = {
		_model: {attribute: false, state: true},
		actionButton: {}
	}
	
	constructor() {
		super();
		this._model = [];
		this.actionButton = null;
	}
	
	renderAction(bookMark) {
		if(this.actionButton) {
			return html`<div><button data-bookmark=${bookMark.title} @click=${this.buttonAction}>${this.actionButton}</button></div>`;
		}
		return null;
	}
	
	buttonAction(e) {
		this.dispatchEvent(new CustomEvent('bookmarkaction',{bubbles: true, composed: true, detail: {bookmark: e.target.dataset.bookmark}}));
	}
	
	displayBookMark(bookMark) {
		return html`<div><div><a href='${bookMark.value}'>${bookMark.title}</div>${this.renderAction(bookMark)}</div>`;
	}
	
	render() {
		return html`
		<style>
			div.list > div {
				display: flex;
			}
			div.list > div:nth-child(odd) {
				background-color: var(--theme-bg-dark);
			} 
			div.list > div > div {
				flex: 1;
			}
		</style>
		<div class='searchlist' part='container'>
			<div part='list' id='list' class='list'>
				${repeat(this._model,(item) => this.displayBookMark(item))}
			</div>
			<div part='pager' id='pager'></div>
		</div>`;
	}

	set model(model) {
		this._model = model;
	}
}

window.customElements.define('bookmark-list',BookMarkList);

/**
 * Manage bookmarks for a player given by playerid.
 */
class BookMarkManager extends LitElement {
	static properties = {
		playerid: { type: EntityId, converter: IdConverter},
		_player: { state: true }
	}
	
	constructor() {
		super();
		this._player = undefined;
		this.listRef = createRef();
		this.titleRef = createRef();
		this.urlRef = createRef();
		this.playerListener = (player) => {this._player = player};
		this.addEventListener('bookmarkaction',this.handleDelete);
	}
	
	connectedCallback() {
		super.connectedCallback();
		window.gebApp.controller.getPlayer(this.playerid,this.playerListener).then((player) => { this._player = player});
	}
	
	disconnectedCallback() {
		super.disconnectedCallback();
		schema.players.unregister(this._player,this.playerListener);
	}
	
	handleDelete(e) {
		const title = e.detail.bookmark;
		this._player.deleteBookMark(title);
	}
	
	addBookMark() {
		const title = this.titleRef.value.value;
		const value = this.urlRef.value.value;
		this._player.addBookMark(title,value);
		this.titleRef.value.value = '';
		this.urlRef.value.value = '';
	}
	
	render() {
		return html`<div part='form'>
			<input type='text' ${ref(this.urlRef)} placeholder='bookmark url'></input>
			<input type='text' ${ref(this.titleRef)} placeholder='title'>
			<button @click=${this.addBookMark}>Add</button>
		</div>
		<bookmark-list part='list' ${ref(this.listRef)} .model=${this._player?.bookMarks ? this._player.bookMarks : []} actionButton='x'></bookmark-list>`;
	}
}

window.customElements.define('bookmark-manager',BookMarkManager);
