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
import { html, LitElement } from 'lit2';
import {repeat} from 'lit2/repeat';

class GameList extends LitElement {
	
	constructor() {
		super();
		this.model = [];
		this.owners = [];
 	}

	getRenderFn() {
		return (gamelist) => { this.setModel(gamelist); }
	}
	
	setModel(model) {
		this.model = model;
		this.getOwners();
		this.requestUpdate();
	}
	
	getOwners() {
		const prefset = {};
		this.model.forEach((game) => prefset[game.id] = game.owner);
		const prefs = [];
		Object.keys(prefset).forEach((pref) => prefs.push(prefset[pref]));
		window.gebApp.controller.getPlayers(prefs,(players) => { this.owners = players; this.requestUpdate(); });
	}
	
	gameClicked(e) {
		const index = e.target.dataset.index;
		const game = this.model[index];
		window.gebApp.controller.displayGameViewClicked(game.id);
	}
	
	renderOwner(index) {
		const model = this.model[index];
		if(model) {
			const owner = model.owner;
			if(owner) {
				const ownerid = owner.id;
				if(ownerid) {
					const ownerArry = this.owners.map((owner) => owner.id === ownerid ? owner : false );
					const owner = ownerArry[0];
					if(owner)
						return html`${owner.handle}`;
					return "no mapped owner";
				}
				return 'no owner id';
			}
			return 'no owner'
		}
		return 'no model';
	}

	renderGames() {
		if(this.model.length > 0) {
			return html`${repeat(this.model,(game,index) => html`<div><div data-index=${index} class='clickable' @click=${this.gameClicked}>${game.name}</div><div>${this.renderOwner(index)}</div></div>`)}`;
		} else {
			return html`<span>No Results</span>`;
		}
	}
	
	render() {
		return html`<style>
			div.list > div {
				display: flex;
			}
			div.list > div:nth-child(odd) {
				background-color: var(--theme-bg-dark);
			} 
			div.list > div > div {
				flex: 1;
			}
			.clickable {
				cursor: pointer;
			}
		</style>
		<div class='searchlist' part='container'>
			<div part='list' id='list' class='list'>
				${this.renderGames()}
			</div>
			<div part='pager' id='pager'></div>
		</div>`;
	}
}

window.customElements.define('game-list',GameList);
