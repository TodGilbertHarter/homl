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
import { html, LitElement } from 'lit3';

class DialogWidget extends LitElement {
	static properties = {
		buttonbarbisabled: {},
		closewidget: {},
		left: {},
		top: {},
		maxheight: {},
		maxwidth: {}
	}

	constructor() {
		super();
		this.fu = false;
		this.buttonbardisabled = false;
		this.closewidget = false;
		this.left = '500px';
		this.top = '200px';
		this.maxwidth = '800px';
	}
	
	drawCloseWidget() {
		if(this.closewidget) {
			return html`<button class='closewidget' @click=${this.dismissClickHandler}>X</button>`;
		}
		return null;
	}

	drawButtonBar() {
		if(!this.buttonbardisabled) {
			return html`<div class='buttonbar' part='buttonbar' id='buttonbar'>
				<slot name='buttonbar'><button id='dismiss' style='float: right;' @click=${this.dismissClickHandler}>dismiss</button></slot>
			</div>`;
		}
		return null;
	}
	
	render() {
		const maxheight = this.maxheight ? html`max-height: ${this.maxheight};` : '';

		return html`<style>
			button.closewidget {
				position: absolute;
				right: 10px;
				top: 10px;
			}
			
			div.dialog {
				position: fixed;
				left: ${this.left}; /* make this 50% at some point */
				top: ${this.top}; /* make this 50% at some point */
				min-width: 200px;
				max-width: ${this.maxwidth};
				min-height: 200px;
				border: 1px solid black;
				border-radius: 5px;
				background-color: white;
				border-bottom: 0px;
				margin: 0px;
				padding: 0px;
				box-shadow: 3px 3px 5px 0px var(--shadow-color);
			}
			
			div.buttonbar {
				height: 30px;
				border-top: 1px solid black;
				background-color: lightgrey;
				border-bottom: 1px solid black;
				border-bottom-left-radius: 5px;
				border-bottom-right-radius: 5px;
				padding-right: 5px;
				padding-top: 5px;
			}
			div.contents {
				min-height: 170px;
				padding: 5px;
				${maxheight}
				overflow-y: scroll;
			}
		</style>
		<div class='dialog' part='container' id='container'>${this.drawCloseWidget()}
			<div class='contents' part='contents'>
				<slot name='content'>Empty Dialog</slot>
			</div>
			${this.drawButtonBar()}
		</div>`;
	}
	
	contentElement(selector) {
		const slot = this.shadowRoot.querySelector('slot[name=content]');
		return slot.assignedElements().filter((node) => node.matches(selector));
	}
	
	get buttons() {
		const slot = this.shadowRoot.querySelector('slot[name=buttonbar]');
		return slot.assignedElements().filter((node) => node.matches('button'));
	}
	
	populate(handlers) {
		this.handlers = handlers;
		if(this.fu) {
			this._populate();
		}
	}
	
	_depopulate() {
		const bb = this.buttons;
		for(var i = 0;i < bb.length; i++) {
			bb[i].onclick = null;
		}
	}
	
	_populate() {
		const bb = this.buttons;
		for(var i = 0;i < bb.length; i++) {
			bb[i].onclick = this.handlers[i];
		}
	}
	
	firstUpdated() {
		this.fu = true;
		if(this.handlers !== undefined) {
			this._populate();
		}
	}
	
	dismiss() {
		this._depopulate();
		this.parentElement.removeChild(this);
	}

	dismissClickHandler = (e) => {
		this.dismiss();
	};
}

window.customElements.define('dialog-widget',DialogWidget);
