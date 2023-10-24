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

import { html, LitElement, render } from 'https://unpkg.com/lit@2/index.js?module';
import {repeat} from 'https://unpkg.com/lit@2/directives/repeat.js?module';
import {ref, createRef} from 'https://unpkg.com/lit@2/directives/ref.js?module';

/**
 * Class to view all the feats in the game.
 */
class BoonViewer extends LitElement {
	
	constructor() {
		super();
		this.boonRepo = window.gebApp.boonRepo;
		this.boons = [];
		this.boonsRef = createRef();
	}
	
	connectedCallback() {
		super.connectedCallback();
		this.boonRepo.addListener(this.boonsUpdated);
		this.boonRepo.getAllBoons((boons) => { this.boonsUpdated(boons);  });
	}
	
	disconnectedCallback() {
		super.disconnectedCallback();
		this.boonRepo.removeListener(this.boonsUpdated);
	}
	
	boonsUpdated(boons) {
		this.boons = boons.sort(
			(a, b) => {
				const nameA = a.name.toUpperCase(); // ignore upper and lowercase
				const nameB = b.name.toUpperCase(); // ignore upper and lowercase
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				return 0;
			});
		this.boonsRef.value.setBoonList(this.boons);
		this.requestUpdate();
	}

	render() {
		return html`
		<div>
			<h1 part='sectiontitle'>HoML Boons</h1>
			<boon-list id='boons' ${ref(this.boonsRef)}></boon-list>
		</div>`;
	}

}

window.customElements.define('boon-viewer',BoonViewer);

class BoonDetailRenderer {
	boon;
	
	constructor(boon) {
		this.boon = boon;
	}
	
	conditionalRender(value,label) {
		if(value) {
			return html`<div class='widetrait'><span class='bold'>${label}:</span>${value}</div>`;
		}
		return '';
	}
	

	render() {
		return html`<section slot='content' id=${this.feat.id} class='feat ${this.feat.source}'>
			<div class='traits'>
				<div class='trait heroic'>
					<div><a href="/homl.html#${this.feat.id}" target="_blank">${this.feat.name}</a></div>
					<div>${this.feat.origin} ${this.feat.level} - ${this.feat.action}</div>
				</div>
				<div class='widetrait'><span class='bold'>${this.feat.tags}</span></div>
				${this.renderRequirements()}
				${this.renderComponents()}
				${this.renderCosts()}
				${this.renderTrigger()}
				${this.renderTypeTarget()}
				${this.renderCheck()}
				${this.renderAttack()}
				${this.renderDefense()}
				${this.renderEnhancedSuccess()}
				${this.renderCompleteSuccess()}
				${this.renderSuccess()}
				${this.renderFailure()}
				${this.renderEffects()}
				${this.renderDuration()}
				${this.renderSpecial()}
				${this.renderFlavor()}
			</section>`;
	}
}

class BoonList extends LitElement {
	constructor() {
		super();
		this.boons = [];
		this.item = null;
		this.detailRenderer = new BoonDetailRenderer(this.item);
		
		this.onClick = (e) => {
			const id = e.target.id;
			const dialog = document.createElement('dialog-widget');
			this.item = this.lookupItem(id);
			this.detailRenderer.boon = this.item;
			render(this.detailRenderer.render(),dialog);
			document.getElementsByTagName('body')[0].appendChild(dialog);
		}
	}

	lookupItem(id) {
		for(var i = 0; i < this.boons.length; i++) {
			if(this.boons[i].id === id) {
				return this.boons[i];
			}
		}
	}
	
	setBoonList(list) {
		this.boons = list;
		this.requestUpdate();
	}
	
	render() {
		return html`<style>
			div.table { 
				display: table; 
				background-color: var(--topic-bg);
				border: 2px solid var(--theme-border);
				margin-top: 1em;
				}
			div.table span {
				display: table-caption;
				font-weight: bold;
				font-size: 1.5em;
			}
			div.tr { 
				display: table-row;
				background-color: var(--theme-fg);
				color: var(--theme-bg);
				}
			div.tr > span { 
				display: table-cell; 
				font-weight: bold;
				padding-left: .5em;
				padding-right: .5em;
			}
			boon-view {
				display: table-row;
			}
			boon-view:nth-child(odd) {
				background-color: var(--theme-bg-dark);
			}
		</style>
		<div class='table'>
			<span>Boons</span>
			<div class='tr'><span>Name</span><span>Action</span><span>Level</span><span>Origin</span><span>Source</span><span>Flavor Text</span></div>
			${repeat(this.boons,(item,index) => html`<boon-view  @click=${this.onClick} name=${item.name} id=${item.id} action=${item.action}
				level=${item.level} origin=${item.origin} source=${item.source} flavortext=${item.flavortext}></boon-view>`)}
		</div>`;
	}
}

window.customElements.define('boon-list',BoonList);

class BoonView extends LitElement {
	static properties = {
		id: {},
		action: {},
		level: {},
		origin: {},
		source: {},
		flavortext: {},
		name: {}
	};
	
	constructor() {
		super();
	}
	
	render() {
		return html`<style>
			span { 
				display: table-cell;
				padding-left: .5em;
				padding-right: .5em;
				}
			.centered {
				text-align: center;
			}
		</style>
		<span>${this.name}</span><span class='centered'>${this.action}</span><span class='centered'>${this.level}</span>
		<span>${this.origin}</span><span>${this.source}</span><span>${this.flavortext}</span>`;
	}
}

window.customElements.define('boon-view',BoonView);
