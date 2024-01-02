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

import { WriteRepository, EntityId, Entity, IdSet } from './baserepository.js';
import { schema, getDb } from './schema.js';
import { query, where, collection, onSnapshot, Timestamp } from 'firebase-firestore';
import { immerable } from 'immer';

/**
 * Chat message class.
 */
class Message extends Entity {
	threadId;
	senderId;
	content;
	contextId;
	sendTime = 0;
	
	constructor(id,threadId,senderId,contextId,content,sendTime) {
		super(id ? id : EntityId.create(schema.messages));
		this.threadId = threadId;
		this.senderId = senderId;
		this.contextId = contextId;
		this.content = content;
		this.sendTime = sendTime;
	}
}

const messageConverter = {
	toFirestore(message) {
		const d = {
			version: 1.0,
			content: message.content,
			id: message.id.idValue,
			threadid: message.threadId,
			senderId: message.senderId.getReference(),
			contextId: message.contextId.getReference(),
			sendTime: message.sendTime
		};
		if(!(d.sendTime instanceof Timestamp)) d.sendTime = Timestamp.now();
		return d;
	},
	
	fromFirestore(snapshot, options) {
		const id = EntityId.create(schema.messages,snapshot.id);
		const data = snapshot.data(options);
		let sid = EntityId.EntityIdFromReference(data.senderId);
		let cid = EntityId.EntityIdFromReference(data.contextId);
		return new Message(id,data.threadId,sid,cid,data.content,data.sendTime);
	}

}

class Conversation extends Entity {
	[immerable] = true;
	participants;
	subject;
	
	constructor(id,subject,participants) {
		super(id ? id : EntityId.create(schema.conversations));
		this.subject = subject;
		this.participants = participants ? participants : new IdSet();
	}
	
	addParticipant(participant) {
		schema.conversations.update(this,(draft) => {draft.participants.add(participant);}, true)
	}
	
	removeParticipant(participant) {
		schema.conversations.update(this,(draft) => {draft.participants.delete(participant);}, true)
	}
	
	updateSubject(subject) {
		schema.conversations.update(this,(draft) => { draft.subject = subject},true);
	}
}

const conversationConverter = {
	toFirestore(conversation) {
		let pArry = Array.from(conversation.participants.values());
		pArry = pArry.map((participant) => { return participant.getReference(); });
		const d = {
			version: 1.0,
			id: conversation.id.idValue,
			subject: conversation.subject,
			participants: pArry
		};
		return d;
	},
	
	fromFirestore(snapshot, options) {
		const id = EntityId.create(schema.conversations,snapshot.id);
		const data = snapshot.data(options);
		const participants = new IdSet(data.participants.map((ref) => EntityId.EntityIdFromReference(ref)));
		return new Conversation(id, data.subject, participants);
	}
	
}

class ConversationRepository extends WriteRepository {
	constructor() {
		super(conversationConverter,schema.conversations);
	}
	
	/**
	 * Get all conversations a given player is a participant in.
	 */
	async getParticipantConversations(playerid) {
		const pid = playerid.getReference();
		return await this.findDtosAsync('participants',pid,'array-contains');
	}
}

/**
 * Chat class, add a listener to this in order to be notified of any messages being sent for
 * the gameId/threadId this chat represents. Note that this will automatically manage subscribing and
 * unsubscribing. When there are no listeners, the subscription will be removed, if there are
 * any it will be activated.
 */
class Chat extends WriteRepository {
	_unsub;
	_listeners;
	contextId;
	
	/**
	 * Create a chat handler for all threads related to the given game.
	 */
	constructor(contextId) {
		super(messageConverter,schema.messages);
		this._listeners = [];
		this._unsub = null;
		this.contextId = contextId;
	}

	/**
	 * Send a message.
	 */	
	async sendMessage(newMessage) {
		return await this.saveDto(newMessage);
	}
	
	_subscribe() {
		if(!this._unsub) {
			const r = this.contextId.getReference();
			const q = query(collection(getDb(),schema.messages).withConverter(messageConverter),
				where("contextId","==",r));
			this._unsub = onSnapshot(q, (querySnapshot) => this._onUpdate(querySnapshot));
		}
	}
	
	_onUpdate(querySnapshot) {
		const messages = [];
		querySnapshot.forEach((doc) => {
			messages.push(doc.data());
		});
		this._notifyListeners(messages);
	}

	/**
	 * Retrieve all messages for a given thread in this context.
	 */	
	async getThread(threadId) {
		return await this.findDtosAsync('threadId',threadId,'==')
	}
	
	_unsubscribe() {
		if(this._unsub) {
			this._unsub();
			this._unsub = null;
		}
	}
	
	_notifyListeners(messages) {
		this._listeners.forEach((listener) => { listener(messages); });
	}
	
	/**
	 * Add a function which will be called whenever FireStore notifies us of
	 * incoming messages. If we're not already subscribed, then we will get a
	 * subscription.
	 */
	addListener(listener) {
		this._listeners.push(listener);
		this._subscribe();
	}

	/**
	 * Remove a listener function, and perform an automatic unsubscribe action
	 * if no more listeners exist on this game.
	 */	
	removeListener(listener) {
		this._listeners = this._listeners.filter((l) => { l !== listener});
		if(this._listeners.length === 0) { this._unsubscribe() }
	}
}

export { Chat, Message, Conversation, ConversationRepository};
