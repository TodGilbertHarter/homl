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
class FeatViewer extends LitElement {
	
	constructor() {
		super();
		this.featRepo = window.gebApp.featRepo;
		this.feats = [];
		this.featsRef = createRef();
	}
	
	connectedCallback() {
		super.connectedCallback();
		this.featRepo.addListener(this.featsUpdated);
		this.featRepo.getAllFeats((feats) => { this.featsUpdated(feats);  });
	}
	
	disconnectedCallback() {
		super.disconnectedCallback();
		this.featRepo.removeListener(this.featsUpdated);
	}
	
	featsUpdated(feats) {
		this.feats = feats.sort(
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
		this.featsRef.value.setFeatList(this.feats);
		this.requestUpdate();
	}

	render() {
		return html`
		<div>
			<h1 part='sectiontitle'>HoML Feats</h1>
			<feat-list id='feats' ${ref(this.featsRef)}></feat-list>
		</div>`
	}

}

window.customElements.define('feat-viewer',FeatViewer);

class FeatDetailRenderer {
	feat;
	
	constructor(feat) {
		this.feat = feat;
	}
	
	conditionalRender(value,label) {
		if(value) {
			return html`<div class='widetrait'><span class='bold'>${label}:</span>${value}</div>`;
		}
		return '';
	}
	
	renderTrigger() {
		return this.conditionalRender(this.feat.trigger,'Trigger');
	}
	
	renderTypeTarget() {
		return this.conditionalRender(this.feat.typetarget,'Type/Target');
	}
	
	renderEnhancedSuccess() {
		return this.conditionalRender(this.feat.enhancedsuccess,'Enhanced Success');
	}
	
	renderCompleteSuccess() {
		return this.conditionalRender(this.feat.completesuccess,'Complete Success');
	}
	
	renderSuccess() {
		return this.conditionalRender(this.feat.success,'Success');
	}
	
	renderFailure() {
		return this.conditionalRender(this.feat.failure,'Failure');
	}
	
	renderFlavor() {
		if(this.feat.flavortext) {
			return html`<div class='flavortext'>${this.feat.flavortext}</div>`;
		}
		return '';
	}
	
	renderAttack() {
		return this.conditionalRender(this.feat.attack,'Attack');
	}
	
	renderEffects() {
		return this.conditionalRender(this.feat.effects,'Effects');
	}
	
	renderCheck() {
		return this.conditionalRender(this.feat.check,'Check');
	}

	renderComponents() {
		return this.conditionalRender(this.feat.components,'Components');
	}

	renderCosts() {
		return this.conditionalRender(this.feat.costs,'Costs');
	}
	
	renderDefense() {
		return this.conditionalRender(this.feat.defense,'Defense');
	}

	renderDuration() {
		return this.conditionalRender(this.feat.duration,'Duration');
	}

	renderRequirements() {
		return this.conditionalRender(this.feat.requirements,'Requirements');
	}

	renderSpecial() {
		return this.conditionalRender(this.feat.special,'Special');
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

class FeatList extends LitElement {
	constructor() {
		super();
		this.feats = [];
		this.item = null;
		this.detailRenderer = new FeatDetailRenderer(this.item);
		
		this.onClick = (e) => {
			const id = e.target.id;
			const dialog = document.createElement('dialog-widget');
			this.item = this.lookupItem(id);
			this.detailRenderer.feat = this.item;
			render(this.detailRenderer.render(),dialog);
			document.getElementsByTagName('body')[0].appendChild(dialog);
		}
	}

	lookupItem(id) {
		for(var i = 0; i < this.feats.length; i++) {
			if(this.feats[i].id === id) {
				return this.feats[i];
			}
		}
	}
	
	setFeatList(list) {
		this.feats = list;
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
			feat-view {
				display: table-row;
			}
			feat-view:nth-child(odd) {
				background-color: var(--theme-bg-dark);
			}
		</style>
		<div class='table'>
			<span>Feats</span>
			<div class='tr'><span>Name</span><span>Action</span><span>Level</span><span>Origin</span><span>Source</span><span>Flavor Text</span></div>
			${repeat(this.feats,(item,index) => html`<feat-view  @click=${this.onClick} name=${item.name} id=${item.id} action=${item.action}
				level=${item.level} origin=${item.origin} source=${item.source} flavortext=${item.flavortext}></feat-view>`)}
		</div>`;
	}
}

window.customElements.define('feat-list',FeatList);

class FeatView extends LitElement {
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

window.customElements.define('feat-view',FeatView);

export { FeatDetailRenderer };
