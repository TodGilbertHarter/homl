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

import { BaseRepository } from './baserepository.js';
import { schema, getDb, getReference } from './schema.js';
import { query, where, collection, onSnapshot } from 'firebase-firestore';

/**
 * Chat message class.
 */
class Message {
	id;
	threadId;
	senderId;
	content;
	gameId;
	sendTime = 0;
	
	constructor(messageId,threadId,senderId,gameId,content,sendTime) {
		this.id = messageId;
		this.threadId = threadId;
		this.senderId = senderId;
		this.gameId = gameId;
		this.content = content;
		this.sendTime = sendTime;
	}
}

const messageConverter = {
	toFirestore(message) {
		
	},
	
	fromFirestore(snapshot, options) {
		const id = snapshot.id;
		const data = snapshot.data(options);
		return new Message(id,data.threadId,data.senderId,data.gameId,data.content,data.sendTime)
	}

}
/**
 * Chat class, add a listener to this in order to be notified of any messages being sent for
 * the gameId/threadId this chat represents. Note that this will automatically manage subscribing and
 * unsubscribing. When there are no listeners, the subscription will be removed, if there are
 * any it will be activated.
 */
class Chat extends BaseRepository {
	_unsub;
	_listeners;
	gameId;
	
	/**
	 * Create a chat handler for all threads related to the given game.
	 */
	constructor(gameId) {
		super(messageConverter,schema.messages);
		this._listeners = [];
		this._unsub = null;
		this.gameId = gameId;
	}

	/**
	 * Send a message.
	 */	
	async sendMessage(newMessage) {
		return await this.saveDto(newMessage);
	}
	
	_subscribe() {
		if(!this._unsub) {
			const q = query(collection(getDb(),schema.messages), where("gameId","==",getReference(schema.games,this.gameId)));
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
	 * Retrieve all messages for a given thread in this game.
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
		if(this._listeners.length === 0) { this.unsubscribe() }
	}
}

export { Chat, Message};
