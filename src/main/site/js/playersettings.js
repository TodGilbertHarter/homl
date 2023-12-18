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

import { html, css, LitElement, ref, createRef } from 'lit3';
import { Player } from './player.js';

/**
 * Display and modify player settings.
 */
class PlayerSettings extends LitElement {
	static properties = {
		playerid: {},
		player: {state: true }
	}
	
	constructor() {
		super();
		this.playerid = null;
		this.player = new Player(this.playerid,null,null,null,null);
		this.handleRef = createRef();
		this.macroSetMgrRef = createRef();
		this._origHandle = '';
	}

	firstUpdated() {
		this.getPlayer(this.playerid);
	}
	
	getPlayer(playerid) {
		window.gebApp.controller.getPlayerById(playerid, (player) => {
			this.player = player;
			this._origHandle = player.handle;
			this.macroSetMgrRef.value.setMacroSet(player.macroset);
		});
	}
	
	updateHandle() {
		this.player.handle = this.handleRef.value.value;
	}
	
	revertHandle() {
		this.player.handle = this._origHandle;
		this.handleRef.value.value = this._origHandle;
		this.requestUpdate();
	}
	
	saveUpdates() {
		window.gebApp.controller.updateCurrentPlayer();
	}
	
	static styles = css`
		.playerSettings {
			margin-left: 3px;
		}
		.playerAttributes {
			margin-top: 3px;
			margin-bottom: 3px;
			display: flex;
		}
		.name {
			flex: 25em;
		}
		.buttons {
			flex: 10em;
		}
	`;
	
	render() {
		return html`<div class='playerSettings'>
			<div class='playerAttributes'>
				<span class='name'>
					<label for='handle'>Handle:</label>
					<input type='text' name='handle' value=${this.player.handle} @change=${this.updateHandle} ${ref(this.handleRef)}></input>
				</span>
				<span class='buttons'>
					<button @click=${this.saveUpdates}>Accept</button>
					<button @click=${this.revertHandle}>Revert</button>
				</span>
			</div>
			<macroset-manager ${ref(this.macroSetMgrRef)}></macroset-manager>
		</div>`;
	}
}

window.customElements.define('player-settings',PlayerSettings);
