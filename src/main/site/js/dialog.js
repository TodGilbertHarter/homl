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
class DialogWidget extends HTMLElement {
	static #template;
	static {
		this.template = document.createElement('template');
		this.template.innerHTML = `<style>
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
			<div class='contents'>
				<slot name='contents'>put stuff here</slot>
			</div>
			<div class='buttonbar' part='buttonbar' id='buttonbar'>
				<slot name='buttonbar'><button id='dismiss' style='float: right;'>dismiss</button></slot>
			</div>
		</div>`;
		}
	#dch;

	constructor() {
		super();
		const content = DialogWidget.template.content;
        const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(content.cloneNode(true));
		this.dch = this.dismissClickHandler.bind(this);
	}
	
	connectedCallback() {
		const dismiss = this.shadowRoot.getElementById('dismiss');
		if(dismiss != null) {
			dismiss.addEventListener('click',this.dch);
		}
	}
	
	dismiss() {
		this.parentElement.removeChild(this);
	}
	
	dismissClickHandler(e) {
		this.dismiss();
	}
}

window.customElements.define('dialog-widget',DialogWidget);
