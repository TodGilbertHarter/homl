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
import { schema, collections } from './schema.js';
import { collection, Timestamp } from 'firebase-firestore';
import { immerable } from 'immer';

/**
 * Chat message class.
 */
class Message extends Entity {
	[immerable] = true;
	threadId;
	senderId;
	content;
	contextId;
	sendTime = 0;
	
	constructor(id,threadId,senderId,contextId,content,sendTime) {
		super(id ? id : EntityId.create(collections.messages));
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
			threadid: message.threadId,
			senderId: message.senderId.getReference(),
			contextId: message.contextId.getReference(),
			sendTime: message.sendTime
		};
		if(!(d.sendTime instanceof Timestamp)) d.sendTime = Timestamp.now();
		return d;
	},
	
	fromFirestore(snapshot, options) {
		const id = EntityId.create(collection.messages,snapshot.id);
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
		super(id ? id : EntityId.create(collections.conversations));
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
		const id = EntityId.create(collections.conversations,snapshot.id);
		const data = snapshot.data(options);
		const participants = new IdSet(data.participants.map((ref) => EntityId.EntityIdFromReference(ref)));
		return new Conversation(id, data.subject, participants);
	}
	
}

class ConversationRepository extends WriteRepository {
	
	constructor() {
		super(conversationConverter,collections.conversations);
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
	
	/**
	 * Create a chat handler for all threads related to the given game.
	 */
	constructor() {
		super(messageConverter,collections.messages);
	}

}

export { Chat, Message, Conversation, ConversationRepository};
