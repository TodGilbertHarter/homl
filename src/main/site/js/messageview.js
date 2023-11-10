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
import {ref, createRef} from 'lit2/ref';
import {Chat, Message } from './chat.js';
import {repeat} from 'lit2/repeat';

class MessageView extends LitElement {
	static properties = {
		messageid: {},
		senderid: {},
		gameid: {},
		sendtime: {}
	}
	
	constructor() {
		super();
	}
	
	render() {
		return html`<style>
		.messageview {
			border: 1px solid var(--theme-border);
			border-radius: 6px;
		}
		</style>
		<div class='messageview'><span>${this.sendtime}</span><slot></slot></div>`;
	}
}

window.customElements.define('message-view',MessageView);

class MessageListView extends LitElement {
	static properties = {
		_messages: {state: true, attribute: false}
	}

	set messages(messages) {
		this._messages = messages.sort((a,b) => { return a.sendTime === b.sendTime ? 0 : (a.sendTime > b.sendTime ? 1 : -1) });
	}
	
	addMessages(messages) {
		this.messages = [...this._messages,...messages].sort((a,b) => { return a.sendTime === b.sendTime ? 0 : (a.sendTime > b.sendTime ? 1 : -1) });
	}
	
	constructor() {
		super();
		this.messages = [];
	}
	
	renderSendTime(sendTime) {
		const dt = sendTime.toDate();
		const options = {year: '2-digit', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'}
		const string = dt.toLocaleDateString(undefined,options);
		return string;
	}
	
	render() {
		return html`
		<div>${repeat(this._messages,(item,index) => { return html`<message-view sendtime='${this.renderSendTime(item.sendTime)}'><div>${item.content}</div></message-view>`})}</div>`;
	}
}

window.customElements.define('message-list',MessageListView);

class ConversationViewer extends LitElement {
	static properties = {
		gameid: {},
		threadid: {},
	}
	
	constructor() {
		super();
		this._chat = null;
		this.listRef = createRef();
		this.uh = this.updateHandler.bind(this);
	}
	
	render() {
		return html`<message-list ${ref(this.listRef)}></message-list>`
	}

	updateHandler(messages) {
		this.listRef.value.messages = messages;
	}
	
	firstUpdated() {
		this._chat = new Chat(this.gameid);
		this._chat.addListener(this.uh);
	}
	
	disconnectedCallback() {
		this._chat.removeListener(this.uh);
	}
}

window.customElements.define('conversation-viewer',ConversationViewer);

