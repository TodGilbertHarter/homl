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

/** @private */ const TabPaneltemplate = document.createElement('template');
TabPaneltemplate.innerHTML = `<div class='tabpanel' part='container'>
				<div part='tabs' id='tabs'><slot name='tabs'></slot></div>
				<div part='tabcontents' id='tabcontents'><slot></slot></div>
			</div>`;

class TabPanel extends HTMLElement {
	/** @private */ static template = TabPaneltemplate;
	/** @private */ tch;
	/** @private */ tabList;
	/** @private */ tabContents;

	constructor() {
		super();
		const content = TabPanel.template.content;
        const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(content.cloneNode(true));
		this.tch = this.tabClickHandler.bind(this);
	}
	
	connectedCallback() {
		const tabs = this.shadowRoot.getElementById('tabs');
		const slot = tabs.firstChild;
		slot.addEventListener('slotchange', e => {
			const s = e.target;
			const assigned = s.assignedElements();
			const tablist = assigned[0];
			if(typeof tablist !== 'undefined') {
				this.tabList = tablist.childNodes;
				this.tabList.forEach(element => { 
					element.addEventListener('click',this.tch);
				});
			}
		});
		const views = this.shadowRoot.getElementById('tabcontents');
		const slot2 = views.firstChild;
		slot2.addEventListener('slotchange', e => {
			const s = e.target;
			this.tabContents = s.assignedElements();
		});
	}
	
	tabClickHandler(e) {
		console.log("clicked on "+e.target.innerHTML);
		const tab = e.target;
		e.target.classList.add('active');
		for(var i = 0; i < this.tabList.length; i++) {
			if(this.tabList[i] != tab) { 
				this.tabList[i].classList.remove('active');
				this.tabContents[i].classList.remove('active');
			} else {
				this.tabContents[i].classList.add('active');
			}
		}
	}	
}

window.customElements.define('tab-panel',TabPanel);
