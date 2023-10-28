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
import {until} from 'https://unpkg.com/lit@2/directives/until.js?module';
import { FeatDetailRenderer } from './featview.js';

/**
 * Class to view all the feats in the game.
 */
class BoonViewer extends LitElement {
	static properties = {
		dialogselector: {},
		selectable: {}
	}

	handleBoonSelected(e) {
		this.selectAction(e);
	}
	
	constructor() {
		super();
		this.boonRepo = window.gebApp.boonRepo;
		this.boons = [];
		this.boonsRef = createRef();
		this.dialogselector = 'body';
		this.selectable = false;
		this.selectAction = () => { alert("boon viewer says hi") }
	}
	
	connectedCallback() {
		super.connectedCallback();
		this.boonRepo.addListener(this.boonsUpdated);
		this.boonRepo.getAllBoons((boons) => { this.boonsUpdated(boons);  });
		this.addEventListener('boonselected',this.handleBoonSelected.bind(this))
	}
	
	disconnectedCallback() {
		super.disconnectedCallback();
		this.boonRepo.removeListener(this.boonsUpdated);
		this.removeEventListener('boonselected');
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
			<boon-list id='boons' ${ref(this.boonsRef)} dialogselector=${this.dialogselector} selectable=${this.selectable}></boon-list>
		</div>`;
	}

}

window.customElements.define('boon-viewer',BoonViewer);

class BoonDetailRenderer {
	boon;
	selectable;
	dismissClickHandler;
	selectClickHandler;
	
	constructor(boon,dismissClickHandler,selectClickHandler) {
		this.featRepo = window.gebApp.featRepo;
		this.boon = boon;
		this.selectable = false;
		this.dismissClickHandler = dismissClickHandler;
		this.selectClickHandler = selectClickHandler;
	}
	
	conditionalRender(value,label,wide) {
		if(value) {
			return html`<div class='${wide}trait'><span class='bold'>${label}:</span>${value}</div>`;
		}
		return '';
	}

	renderFeat(feat) {
		console.log("rendering a feat "+feat.name);
		return html`Feat: ${feat.name}<br>`;
	}
	
	resolveFeat(featRef) {
		return this.featRepo.getReferencedFeatAsync(featRef).then(r => new FeatDetailRenderer(r).render());
	}
	
	renderFeatRef(featRef) {
		console.log("rendering a feat ref");
		return html`${until(this.resolveFeat(featRef),html`<span>Loading Feat</span>`)}`;
	}
	
	renderBenefit(benefit) {
		if(typeof benefit === 'string') {
			return html`${benefit}<br>`;
		} else if(typeof benefit === 'Feat') {
			return this.renderFeat(benefit);
		} else {
			return this.renderFeatRef(benefit);
		}
	}

	renderButtons() {
		if(this.selectable) {
			return html`<button class='dialogbutton' slot='buttonbar' id='boonselect' @click=${this.selectClickHandler}>select</button>
			<button class='dialogbutton' slot='buttonbar' id='dismiss' @click=${this.dismissClickHandler}>dismiss</button>`;
		}
		return '';
	}
	
	render() {
		return html`<section slot='content' id=${this.boon.id} class='boon'>
			<div class='traits'>
				<div class='trait'>
					<div><a href="/homl.html#${this.boon.id}" target="_blank">${this.boon.name}</a></div>
					<div>${this.boon.source}: ${this.boon.level} - ${this.boon.type}</div>
				</div>
				<div class='trait'>
					<div><span class='bold'>Association:</span>${this.boon.association}</div>
					<div><span class='bold'>Prerequisites:</span>${this.boon.prerequisites}</div>
				</div>
				${this.conditionalRender(this.boon.description,'Description','wide')}
				<div class='widetrait'>
					<span class='bold'>Benefits:</span>
					${repeat(this.boon.benefits,(item,index) => this.renderBenefit(item))}
				</div>
				${this.conditionalRender(this.boon.disadvantages,'Disadvantages','wide')}
				${this.conditionalRender(this.boon.restrictions,'Restrictions','wide')}
				${this.conditionalRender(this.boon.manifestation,'Manifestation','wide')}
			</div>				
		</section>${this.renderButtons()}`;
	}
}

class BoonList extends LitElement {
	static properties = {
		dialogselector: {},
		selectable: {}
	}

	dismissClickHandler() {
		const tag = document.querySelector(this.dialogselector);
		tag.removeChild(this.dialog);
		this.dialog = null;
	}
	
	selectClickHandler() {
		this.dispatchEvent(new Event('boonselected',{bubbles: true, boon: this.item}));
		tag.removeChild(this.dialog);
		this.dialog = null;
	}
	
	constructor() {
		super();
		this.boons = [];
		this.item = null;
		this.detailRenderer = new BoonDetailRenderer(this.item,this.dismissClickHandler.bind(this),this.selectClickHandler.bind(this));
		this.dialogselector = 'body';
		this.selectable = false;
		this.dialog = null;
		
		this.onClick = (e) => {
			if(!this.dialog) {
				const id = e.target.id;
				this.dialog = document.createElement('dialog-widget');
				this.dialog.setAttribute('left','550px');
				this.dialog.setAttribute('top','220px');
				this.item = this.lookupItem(id);
				this.detailRenderer.boon = this.item;
				this.detailRenderer.selectable = this.selectable;
				render(this.detailRenderer.render(),this.dialog);
				const tag = document.querySelector(this.dialogselector);
				tag.appendChild(this.dialog);
			}
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
			<div class='tr'><span>Name</span><span>Source</span><span>Level</span><span>Type</span><span>Association</span><span>Description</span></div>
			${repeat(this.boons,(item,index) => html`<boon-view  @click=${this.onClick} name=${item.name} id=${item.id} level=${item.level}
				type=${item.type} association=${item.association} description=${item.description} benefits=${item.benefits} disadvantages=${item.disadvantages}
				restrictions=${item.restrictions} manifestation=${item.manifestation} source=${item.source}></boon-view>`)}
		</div>`;
	}
}

window.customElements.define('boon-list',BoonList);

class BoonView extends LitElement {
	static properties = {
		id: {},
		name: {},
		source: {},
		level: {},
		type: {},
		association: {},
		description: {},
		benefits: {},
		disadvantages: {},
		restrictions: {},
		manifestation: {}
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
		<span>${this.name}</span><span class='centered'>${this.source}</span><span class='centered'>${this.level}</span>
		<span>${this.type}</span><span>${this.association}</span><span>${this.description}</span>`;
	}
}

window.customElements.define('boon-view',BoonView);
