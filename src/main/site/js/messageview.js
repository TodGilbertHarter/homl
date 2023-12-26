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
import { html, css, LitElement, ref, createRef, repeat } from 'lit3';
import { Task } from 'littask';
import {Chat, Message, Conversation, ConversationRepository } from './chat.js';
import { EntityId, IdConverter } from './baserepository.js';

class MessageView extends LitElement {
	static properties = {
		messageid: { converter: IdConverter, type: EntityId },
		senderid: { converter: IdConverter, type: EntityId },
		contextid: { converter: IdConverter, type: EntityId },
		sendtime: {},
		_senderName: { state: true}
	}
	
	constructor() {
		super();
	}
	
	
	
	firstUpdated() {
		window.gebApp.controller.getPlayerById(this.senderid.idValue,(player) => { this._senderName = player.handle; });
	}
	
	render() {
		return html`<style>
		.messageview {
			border: 1px solid var(--theme-border);
			border-radius: 6px;
		}
		.header {
			display: flex;
		}
		.time {
			flex: 1;
			text-align: left;
		}
		.from {
			flex: 1;
			text-align: right;
		}
		</style>
		<div class='messageview'>
			<div class='header'><div class='time'>${this.sendtime}</div><div class='from'>From: ${this._senderName}</div></div>
			<slot></slot>
		</div>`;
	}
}

window.customElements.define('message-view',MessageView);

class MessageListView extends LitElement {
	static properties = {
		order: {},
		_messages: {state: true, attribute: false}
	}

	set messages(messages) {
		this._messages = messages.sort(this._sorter);
	}
	
	addMessages(messages) {
		this.messages = [...this._messages,...messages].sort(this._sorter);
	}
	
	constructor() {
		super();
		this.messages = [];
		this.order = 'newest';
		this._sorter = (a,b) => { 
			return a.sendTime === b.sendTime ? 0 : (a.sendTime > b.sendTime ? (this.order !== 'newest' ? 1 : -1) : (this.order !== 'newest' ? -1 : 1));
		};
	}
	
	renderSendTime(sendTime) {
		const dt = sendTime.toDate();
		const options = {year: '2-digit', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'}
		const string = dt.toLocaleDateString(undefined,options);
		return string;
	}
	
	render() {
		return html`
		<style>
		.listcontainer {
			overflow-y: scroll;
			max-height: 100%;
		}
		</style>
		<div class='listcontainer'>
			${repeat(this._messages,(item,index) => { 
				return html`<message-view sendtime='${this.renderSendTime(item.sendTime)}' senderid=${item.senderId}><div>${item.content}</div></message-view>`})
			}
		</div>`;
	}
}

window.customElements.define('message-list',MessageListView);

class ConversationViewer extends LitElement {
	static properties = {
		contextid: { type: EntityId, converter: IdConverter},
		threadid: {},
		messager: {},
		cols: {},
		order: {}
	}
	
	constructor() {
		super();
		this._chat = null;
		this.listRef = createRef();
		this.uh = this.updateHandler.bind(this);
		this.messager = 'false';
		this.cols = 100;
		this.order = 'newest';
	}
	
	renderMessager() {
		if(this.messager === 'true') {
			return html`<conversation-messager threadid=${this.threadid} cols=${this.cols} contextid=${this.contextid}></conversation-messager>`;
		}
		return null;
	}
	render() {
		if(this.order !== 'newest') {
			return html`<message-list order=${this.order} ${ref(this.listRef)}></message-list>${this.renderMessager()}`;
		} else {
			return html`${this.renderMessager()}<message-list order=${this.order} ${ref(this.listRef)}></message-list>`;
		}
	}

	updateHandler(messages) {
		this.listRef.value.messages = messages;
	}

	sendChatMessage(message) {
		this._chat.sendMessage(message);
	}
	
	firstUpdated() {
		this._chat = new Chat(this.contextid);
		this._chat.addListener(this.uh);
		this.addEventListener('postaction', (e) => {
			const message = new Message(
				null,
				this.threadid,
				window.gebApp.controller.getCurrentPlayer().id,
				this.contextid,
				e.detail.text,
				0);
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
		contextid: { type: EntityId, converter: IdConverter},
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
		let v = this.bigInputRef.value.value;
		v = window.gebApp.controller.runHairballProgram(v);
		if(v !== '')
			this.dispatchEvent(new CustomEvent('postaction',{bubbles: true, composed: true, detail: {text: v, contextid: this.contextid}}));
	}
	
	render() {
		return html`<div part='messager'>
			<big-input placeholder='enter a message here' cols=${this.cols} ${ref(this.bigInputRef)}></big-input>
			<button @click=${this.clearClicked}>Clear</button><button @click=${this.postClicked}>Post</button>
		</div>`;
	}
}

window.customElements.define('conversation-messager',Messager);

/** UI specific to stand-alone conversations */
class ConversationClient extends LitElement {
	static properties = {
		playerid: { type: EntityId, converter: IdConverter}
	}
	
	render() {
		html`<h1>Conversations</h1>
			<conversation-viewer messager='true' contextid=${this.contextid}></conversation-viewer>
		`;
	}	
}

window.customElements.define('conversation-client',ConversationClient);

/**
 * Lists all conversations containing the given player as a participant.
 */
class ConversationList extends LitElement {
	static properties = {
		playerid: { type: EntityId, converter: IdConverter },
		_conversations: { state: true }
	}
	
	_conversationsTask = new Task(this, {
		task: async ([playerid]) => {
			const convs = await window.gebApp.controller.getParticipantConversations(playerid);
			return convs;
		},
		args: () => [this.playerid]
	});
	
	constructor() {
		super();
		this.playerid = undefined;
		this._conversations = [];
	}
		
	static styles = css`
	table {
		width: 100%;
		border-collapse: collapse;
	}
	thead tr {
		background-color: var(--theme-fg);
		color: var(--theme-bg);
	}
	`;
	
	showConversation(e) {
		const contextId = e.target.dataset.contextId;
		const eid = EntityId.EntityIdFromString(contextId);
		window.gebApp.controller.displayConversation(eid);
	}
	
	async leaveConversation(conversation) {
		conversation.removeParticipant(this.playerid);
		await window.gebApp.controller.saveConversation(conversation);
		this.requestUpdate();
	}
	
	render() {
		return this._conversationsTask.render({
			initial: () => '<p>Initializing</p>',
			pending: () => '<p>Loading Data</p>',
			complete: (value) => html`<table>
					<thead>
						<tr><th>Subject</th><th></th><th></th></tr>
					</thead>
					<tbody>
						${repeat(value,(convo,index) => { return html`<tr><td>${convo.subject}</td>
						<td><button data-context-id=${convo.id} @click=${this.showConversation}>Show</button></td>
						<td><button data-context-id=${convo.id} @click=${() => this.leaveConversation(convo)}>Leave</button></td></tr>`})}
					</tbody>
				</table>`,
			error: (error) => html`<p>Failed to get conversations for user ${error}</p>`,
		});
	}
}

window.customElements.define('conversation-list',ConversationList);
