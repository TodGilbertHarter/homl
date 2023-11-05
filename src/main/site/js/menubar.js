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

/**
 * List-based menuing system which uses templates and slots coupled with
 * CSS and lit-based event handlers to implement a pretty good immitation of
 * standard application menus.
 */
class MyMenuItem extends LitElement {
	static properties = {
		label: {},
		target: {},
		decoration: {},
		enabled: {}
	}

	constructor() {
		super();
		this.enabled = 'true'
	}
	
	enable() {
		this.enabled = 'true';
	}
	
	disable() {
		this.enabled = 'false';
	}
	
	onClick(e) {
		const smens = this.querySelector('my-menu');
		if(smens !== null) {
			smens.makevisible();
		}
		if(this.parentElement.classList.contains('dropdown-menu')) {
			this.parentElement.makeinvisible();
		}
	}
	
	onSubMouseOut(e) {
		const smens = this.querySelector('my-menu');
		if(smens !== null && e.currentTarget !== e.relatedTarget.parentElement && this !== e.relatedTarget) {
			smens.makeinvisible();
		}
		e.cancelBubble = true;
	}
	
	onMouseOut(e) {
		const smens = this.querySelector('my-menu');
		if(e.relatedTarget.parentElement !== smens) {
			smens.makeinvisible();
		}
		e.cancelBubble = true;
	}
	
	connectedCallback() {
		super.connectedCallback();
		const smens = this.querySelector('my-menu');
		if(smens !== null) {
			smens.addEventListener('mouseout',this.onSubMouseOut.bind(this));
			this.addEventListener('mouseleave',this.onMouseOut.bind(this));
		}
	}
	
	render() {
		let aStyle = this.parentElement.classList.contains('vertical') ? 'block' : 'inline-block';
		let aDecoration = this.decoration === undefined ? '' : html`<span class='decoration'>${this.decoration}</span>`
		let aLink = this.target === undefined ? html`<div @click=${this.onClick} >${this.label}${aDecoration}</div>` 
			: html`<a @click=${this.onClick} href='${this.target}'><div>${this.label}${aDecoration}</div></a>`;
		return html`<style>
				:host {
					display: list-item;
				}
				
				a {
					display: ${aStyle};
					color: inherit;
					text-decoration: inherit;
				}
				
				a span.decoration {
					text-align: right;
					float: right;
				}
				
				a div {
					width: 100%;
				}
			</style>
			${aLink}<slot></slot>`;
	}
}

class MyMenu extends LitElement {

	constructor() {
		super();
		this.visible = this.classList.contains('visiblemenu');
	}

	makevisible() {
		this.classList.add('visiblemenu'); 
		this.visible = true;
	}
	
	makeinvisible() {
		this.classList.remove('visiblemenu');
		this.visible = false;
	}
	
	render() {
		return html`<style>
			
			:host(.horizontal) {
				padding: 0px;
				clear: left;
				width: 100%;
				background-color: inherit;
				white-space: nowrap;
				display: inline-block;
			}
			</style>
			<slot></slot>`;
	}
}

window.customElements.define('my-menu-item',MyMenuItem);
window.customElements.define('my-menu',MyMenu);
