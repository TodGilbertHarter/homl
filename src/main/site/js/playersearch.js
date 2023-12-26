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
import { LitElement, css, html, repeat } from 'lit3';
import { Task } from 'littask';
import { EntityId, IdConverter } from './baserepository.js';
import { schema } from './schema.js';

class PlayerList extends LitElement {
	static properties = {
		_players: { state: true }
	}
	
	_playersTask = new Task(this, {
		task: async ([]) => {
			const convs = await window.gebApp.controller.getAllPlayers();
			return convs;
		},
		args: () => []
	});
	
	constructor() {
		super();
		this._players = [];
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
	.lj {
		text-align: left;
	}
	`;
	
	showPlayer(e) {
		const contextId = e.target.dataset.contextId;
//		const eid = EntityId.EntityIdFromString(contextId);
//TODO: fix entity ids...
		const eid = EntityId.create(schema.players,contextId);
		window.gebApp.controller.displayPlayer(eid);
	}
	
	sendMessage(e) {
		const contextId = e.target.dataset.contextId;
		const eid = EntityId.create(schema.players,contextId);
		window.gebApp.view.displaySendMessageRequester(eid);
	}
	
	render() {
		return this._playersTask.render({
			initial: () => '<p>Initializing</p>',
			pending: () => '<p>Loading Data</p>',
			complete: (value) => html`<table>
					<thead>
						<tr><th class='lj'>Handle</th><th></th><th></th></tr>
					</thead>
					<tbody>
						${repeat(value,(player,index) => { return html`<tr><td>${player.handle}</td>
						<td><button data-context-id=${player.id} @click=${this.showPlayer}>Show</button></td>
						<td><button data-context-id=${player.id} @click=${this.sendMessage}>PM</button></td>
						</tr>`})}
					</tbody>
				</table>`,
			error: (error) => html`<p>Failed to get players: ${error}</p>`,
		});
	}
}

window.customElements.define('player-list',PlayerList);

class PlayerView extends LitElement {
	static properties = {
		playerid: { type: EntityId, converter: IdConverter }
	}	
	
	constructor() {
		super();
		this.playerid = null;
	}
	
	_playerTask = new Task(this, {
		task: async ([playerid]) => {
			const player = await window.gebApp.controller.getPlayer(playerid);
			return player;
		},
		args: () => [this.playerid]
	});

	static styles = css``;
	
	render() {
		return this._playerTask.render({
			initial: () => '<p>Initializing</p>',
			pending: () => '<p>Loading Data</p>',
			complete: (player) => html`
				<span>Handle:</span>
				<span>${player.handle}</span>
			`,
			error: (error) => html`<p>Failed to get player: ${error}</p>`,
		});
	}
}

window.customElements.define('player-view',PlayerView);
