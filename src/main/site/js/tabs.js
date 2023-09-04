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
import { html, LitElement } from 'https://unpkg.com/lit@2/index.js?module';

class TabPanel extends LitElement {
	/** @private */ tabList = [];
	/** @private */ tabContents = [];

	constructor() {
		super();
	}

	render() {
		return html`<div class='tabpanel' part='container'>
				<div part='tabs' id='tabs' @click=${this.tabClickHandler}>
					<ul>
					${this.tabList}
					</ul>
				</div>
				<div part='tabcontents' id='tabcontents'>
					${this.tabContents}
				</div>
			</div>`;
	}
	
	/**
	 * Add a tab and associated contents, and make it active if isactive is true.
	 */
	addTab(tab,contents,isactive) {
		this.tabList.push(tab);
		this.tabContents.push(contents);
		if(isactive) { this.activateTab(tab,contents); }
		this.requestUpdate();
	}
	
	/**
	 * Inactivate all other tabs and make the one with the given id active.
	 */
	activateTabById(tabid) {
		this._makeAllInactive();
		this._makeActiveById(tabid);
	}
	
	_makeActiveById(tabid) {
		for(var i = 0;i < this.tabList.length;i++) {
			if(tabid === this.tabList[i].id) {
				this._makeActive(this.tabList[i],this.tabContents[i]);
				return;
			}
		}
	}
	
	/**
	 * Make the given tab and its contents active.
	 */
	activateTab(tab,contents) {
		this._makeAllInactive();
		this._makeActive(tab,contents);
	}
	
	_makeAllInactive() {
		for(var i = 0;i < this.tabList.length;i++) {
			this._makeInactive(this.tabList[i],this.tabContents[i]);
		}
	}
	
	_makeActive(tab,contents) {
		tab.classList.remove('inactive');
		tab.classList.add('active');
		contents.classList.remove('inactive');
		contents.classList.add('active');
	}
	
	_makeInactive(tab,contents) {
		tab.classList.remove('active');
		tab.classList.add('inactive');
		contents.classList.remove('active');
		contents.classList.add('inactive');
	}

	tabClickHandler(e) {
		console.log("clicked on "+e.target.innerHTML);
		const tab = e.target;
		e.target.classList.add('active');
		this.activateTabById(tab.id);
	}	
}
window.customElements.define('tab-panel',TabPanel);

class TabItem extends LitElement {
	
	render() {
		return html`<li>${this.innerHTML}</li>`;
	}
}
window.customElements.define('tab-item',TabItem);

class TabBody extends LitElement {
	
}

window.customElements.define('tab-body',TabBody);
