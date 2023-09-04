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
import { html, LitElement } from 'https://unpkg.com/lit@2/index.js?module';

class CharacterSearch extends LitElement {
	static properties = {
		name: {}
	}
	
	characterRepo;
	constructor() {
		super();
	}
	
	onNameChange(e) {
		const displayId = this.getAttribute('displayid');
		const viewer = window.gebApp.view.getElement(displayId);
		window.gebApp.controller.registerCharactersListener(viewer.getRenderFn());
		window.gebApp.controller.doCharacterSearch(e.target.value);
	}

	render() {
		return html`<div class='charactersearch' part='container'>
				<label for='name'>Name</label>
				<input type='text' id='name'/>
			</div>`
	}
}

window.customElements.define('character-search',CharacterSearch);