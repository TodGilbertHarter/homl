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
import { Player } from './player.js';
import {ref, createRef} from 'lit2/ref';

/**
 * Display and modify player settings.
 */
class PlayerSettings extends LitElement {
	static properties = {
		playerid: {}
	}
	
	constructor() {
		super();
		this.playerid = null;
		this.player = new Player(this.playerid,null,null,null,null);
		this.handleRef = createRef();
	}

	firstUpdated() {
		this.getPlayer(this.playerid);
	}
	
	getPlayer(playerid) {
		window.gebApp.controller.getPlayerById(playerid, (player) => {
			this.player = player;
			this.requestUpdate();
		});
	}
	
	updateHandle() {
		this.player.handle = this.handleRef.value.value;
	}
	
	saveUpdates() {
		window.gebApp.controller.updatePlayer(this.player);
	}
	
	render() {
		return html`<div>
			<span><label for='handle'>Handle:</label><input type='text' name='handle' value=${this.player.handle} @change=${this.updateHandle} ${ref(this.handleRef)}></input></span>
			<span><button @click=${this.saveUpdates}>Accept</button></span>
		</div>`;
	}
}

window.customElements.define('player-settings',PlayerSettings);
