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
import { schema, getReference } from './schema.js';

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
		messager: {},
		cols: {}
	}
	
	constructor() {
		super();
		this._chat = null;
		this.listRef = createRef();
		this.uh = this.updateHandler.bind(this);
		this.messager = 'false';
		this.cols = 100;
	}
	
	renderMessager() {
		if(this.messager === 'true') {
			return html`<conversation-messager threadid=${this.threadid} cols=${this.cols} gameid=${this.gameid}></conversation-messager>`;
		}
		return null;
	}
	render() {
		return html`<message-list ${ref(this.listRef)}></message-list>${this.renderMessager()}`
	}

	updateHandler(messages) {
		this.listRef.value.messages = messages;
	}

	sendChatMessage(message) {
		this._chat.sendMessage(message);
	}
	
	firstUpdated() {
		this._chat = new Chat(this.gameid);
		this._chat.addListener(this.uh);
		this.addEventListener('postaction', (e) => {
			const message = new Message(null,this.threadid,window.gebApp.controller.getCurrentPlayerRef(),getReference(schema.games,this.gameid),e.detail.text,0);
			this.sendChatMessage(message);
		});
	}
	
	disconnectedCallback() {
		this._chat.removeListener(this.uh);
	}
}

window.customElements.define('conversation-viewer',ConversationViewer);

class Messager extends LitElement {
	static properties = {
		cols: {},
		gameid: {},
		threadid: {}
	}
	
	constructor() {
		super();
		this.bigInputRef = createRef();
		this.cols = 60;
	}
	
	clearClicked() {
		const ta = this.bigInputRef.value
		ta.setValue('');
	}
	
	postClicked() {
		const v = this.bigInputRef.value.value;
		if(v !== '')
			this.dispatchEvent(new CustomEvent('postaction',{bubbles: true, composed: true, detail: {text: this.bigInputRef.value.value}}));
	}
	
	render() {
		return html`<div part='messager'>
			<big-input placeholder='enter a message here' cols=${this.cols} ${ref(this.bigInputRef)}></big-input>
			<button @click=${this.clearClicked}>Clear</button><button @click=${this.postClicked}>Post</button>
		</div>`;
	}
}

window.customElements.define('conversation-messager',Messager);

