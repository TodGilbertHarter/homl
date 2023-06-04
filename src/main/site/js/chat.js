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

/**
 * Chat message class.
 */
class Message {
	senderId;
	content;
	gameId;
	sendTime = 0;
	
	constructor(senderId,gameId,content) {
		this.senderId = senderId;
		this.gameId = gameId;
		this.content = content;
	}
}

/**
 * Chat class, add a listener to this in order to be notified of any messages being sent for
 * the gameId this chat represents. Note that this will automatically manage subscribing and
 * unsubscribing. When there are no listeners, the subscription will be removed, if there are
 * any it will be activated.
 */
class Chat {
	messageStore;
	unsub;
	listeners;
	gameId;
	
	constructor(gebApp,firestore,gameId) {
		messageStore = firestore.collection('chat');
		this.listeners = [];
		this.gameId = gameId;
	}
	
	sendMessage() {
		const newMessage = new Message();
		messageStore.set(newMessage).then().catch();
	}
	
	subscribe() {
		if(this.unsub === undefined) {
			this.unsub = messageStore.onSnapshot();
		}
	}
	
	unsubscribe() {
		if(this.unsub !== 'undefined') {
			this.unsub();
			delete this['unsub'];
		}
	}
	
	addListener(listener) {
		this.listeners.push(listener);
		this.subscribe();
	}
	
	removeListener(listener) {
		this.listeners = this.listeners.filter((l) => { l !== listener});
		if(this.listeners.length === 0) { this.unsubscribe() }
	}
}