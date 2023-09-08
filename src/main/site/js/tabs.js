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
	/** @private */ tch;
	/** @private */ tabList = [];
	/** @private */ tabContents = [];

	constructor() {
		super();
		this.tch = this.tabClickHandler.bind(this);
	}

	render() {
		return html`<div class='tabpanel' part='container'>
				<div part='tabs' id='tabs'>
					<ul class='tabbar' part='tabbar'>
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
	addTab(tabtext,contents,isactive) {
		const id = "tabid" + Math.random().toString(16).slice(2)
		const ti = document.createElement('li');
//		ti.onmouseenter = this.tch;
		ti.id = "i" + id;
		ti.innerText = tabtext;
		ti.part = 'tabitem';
		this.tabList.push(ti);
		contents.id = "c" + id;
		contents.part = 'tabbody';
		this.tabContents.push(contents);
		if(isactive) { this.activateTab(ti,contents); }
		this.requestUpdate();
		ti.onclick = this.tch;
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
		tab.part="tabitem tiactive";
		contents.classList.remove('inactive');
		contents.classList.add('active');
		contents.part="tabbody tbactive"
	}
	
	_makeInactive(tab,contents) {
		tab.classList.remove('active');
		tab.classList.add('inactive');
		tab.part="tabitem";
		contents.classList.remove('active');
		contents.classList.add('inactive');
		contents.part="tabbody";
	}

	tabClickHandler(e) {
		const tab = e.target;
		this.activateTabById(tab.id);
	}	
}
window.customElements.define('tab-panel',TabPanel);

class TabItem extends LitElement {
	
	render() {
		return html`${this.innerHTML}`;
	}
}
// window.customElements.define('tab-item',TabItem);

class TabBody extends LitElement {
	
}

// window.customElements.define('tab-body',TabBody);
