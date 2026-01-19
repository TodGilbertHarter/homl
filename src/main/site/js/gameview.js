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

import { html, LitElement, render, ref, createRef } from 'lit3';
import {Message, Chat } from './chat.js';
import {EntityId} from './baserepository.js';
import {collections} from './schema.js';

class GameView extends LitElement {
	static properties = {
		gameId: {},
		model: {attribute: false, state: true}
	};
	
	constructor() {
		super();
		this.gameViewRef = createRef();
		this.characterListRef = createRef();
		this.npcViewerRef = createRef();
		this.conversationViewerRef = createRef();
		this.imagesViewerRef = createRef();
		this.model = null;
	}
	
	async showGame(game) {
		this.model = game;
		this.gameViewRef.value.model = game;
		this.conversationViewerRef.value.gameid = game.id;
		this.conversationViewerRef.value.threadid = game.threads[0];
		this.imagesViewerRef.gameid = game.id;
		window.gebApp.controller.getNpcs(game.npcs,(npcs) => {
			this.npcViewerRef.value.npcs = npcs;
		});
		const fooberry = await window.gebApp.controller.getImages(game.images,(images) => {
			this.imagesViewerRef.value.images = images;
		});
		this.imagesViewerRef.value.images = fooberry;
	}

	firstUpdated() {
		this.imagesViewerRef.value.addEventListener('imageaction',(e) => {
//			alert("image action selected for image "+e.detail.uri);
			console.debug("image action selected for image "+e.detail.uri);
			this.imagesViewerRef.value.drawImage(e.detail.imageid);
		});
	}
	
	updated(changed) {
		super.updated(changed);
		if(this.model) {
			this.model.getCharacters((characters) => {
				this.characterListRef.value.setModel(characters);
			});
		}
	}
	
	editInfo() {
		const dialog = document.createElement('dialog-widget');
		const cancelHandler = (e) => { document.getElementsByTagName('body')[0].removeChild(dialog); }
		const selectHandler = (e) => { 
			document.getElementsByTagName('body')[0].removeChild(dialog);
			this.saveGame();
			this.requestUpdate();
		}
//		dialog.setAttribute('class','noteselector');
		const template = html`<div slot='content'><game-create save='no' name=${this.model.name} description=${this.model.description}></game-create></div>
		<button class='dialogbutton' slot='buttonbar' id='boonselect' @click=${selectHandler}>select</button>
		<button class='dialogbutton' slot='buttonbar' id='dismiss' @click=${cancelHandler}>cancel</button>`;
		render(template,dialog);
		document.getElementsByTagName('body')[0].appendChild(dialog);
/*		dialog.addEventListener('gameupdated',(e) => { 
			document.getElementsByTagName('body')[0].removeChild(dialog);
			const note = e.detail.note;
			this.addNote(note);
		}); */
		
	}
	
	render() {
		return html` <style>
			.gamewrapper {
				display: flex;
			}
			.gameColumn {
				flex: 1;
				margin-left: 2px;
				margin-right: 2px;
				overflow: clip;
			}
		</style>
		<div class='gamewrapper'>
			<div class='gameColumn'>
				<div @dragover=${this.dragOver} @drop=${this.drop} class='gameview' part='gameview' id='gameview'>
					<div>Game Info</div>
					<game-info class='gameinfo' ${ref(this.gameViewRef)} gameid=${this.gameId}></game-info>
					<div><button @click=${this.editInfo}>Edit</button></div>
					<images-viewer actionenabled='display' gameid=${this.gameId} ${ref(this.imagesViewerRef)}></images-viewer>
				</div>
			</div>
			<div class='gameColumn'>
				<div class='characterlist'>
					<div>Characters</div>
					<character-list id="characterlist" ${ref(this.characterListRef)}></character-list>
					<npcs-viewer ${ref(this.npcViewerRef)} label='NPCs'></npcs-viewer>
				</div>
			</div>
			<div class='gameColumn'>
				<div class='conversationviewer'>
					<div>Conversations</div>
					<conversation-viewer messager='true' ${ref(this.conversationViewerRef)} contextid=${EntityId.create(collections.games,this.gameId)}></conversation-viewer>
				</div>
			</div>
		</div>`;
	}
	
	dragOver(de) {
		de.preventDefault();
	}
	
	saveGame() {
		window.gebApp.controller.handleSaveGame(this.model);
	}
	
	drop(de) {
		const data = de.dataTransfer.getData("text/plain");
		console.log("dropped character with id "+data);
		this.model.addCharacter(data);
		this.saveGame();
	}	
}

window.customElements.define('game-view',GameView);

class GameInfoView extends LitElement {
	static properties = {
		gameid: {},
		_model: {attribute: false, state: true}
	}
	
	constructor() {
		super();
		this._model = null;
	}
	
	set model(model) {
		this._model = model;
	}
	
	render() {
		return (this._model ? html`<style>
			div.gamedescription {
				width: auto;
				background-color: var(--box-bg);
			}
			div.gamedescription > span.fieldlabel {
				width: 8em;
			}
			div.gamedescription > span.fieldvalue {
				width: auto;
			}
			div.textdescription {
				border: 1px solid black;
			}
			.fieldlabel {
				padding-right: .25em;
				font-weight: bold;
				font-size: 1.125em;
			}
		</style>
		<div class="gamedescription">
			<span class='fieldlabel'>Name:</span><span class='fieldvalue'>${this._model.name}</span>
		</div>
		<div class='textdescription'>${this._model.description}</div>` : html`<p>Getting data for game ${this.gameId}</p>`);
	}
}

window.customElements.define('game-info',GameInfoView);
