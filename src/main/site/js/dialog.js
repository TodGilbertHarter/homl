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
import {ref, createRef } from 'https://unpkg.com/lit@2/directives/ref.js?module';

class DialogWidget extends LitElement {

	constructor() {
		super();
		this.fu = false;
	}

	render() {
		return html`<style>
			div.dialog {
				position: fixed;
				left: 500px; /* make this 50% at some point */
				top: 200px; /* make this 50% at some point */
				min-width: 200px;
				min-height: 200px;
				border: 1px solid black;
				border-radius: 5px;
				background-color: white;
				border-bottom: 0px;
				margin: 0px;
				padding: 0px;
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
				height: 170px;
				padding: 5px;
			}
		</style>
		<div class='dialog' part='container' id='container'>
			<div class='contents' ${ref(this.contentRef)}>
				<slot name='content'>Empty Dialog</slot>
			</div>
			<div class='buttonbar' part='buttonbar' id='buttonbar' ${ref(this.buttonRef)}>
				<slot name='buttonbar'><button id='dismiss' style='float: right;' @click=${this.dismissClickHandler}>dismiss</button></slot>
			</div>
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
		this.parentElement.removeChild(this);
	}

	dismissClickHandler = (e) => {
		this.dismiss();
	};
}

window.customElements.define('dialog-widget',DialogWidget);
