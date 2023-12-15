/**
 * This software is Copyright (C) 2023 Tod G. Harter. All rights reserved.
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
import { html, LitElement, ref, createRef } from 'lit3';

/**
 * A large input area which will show how much text has been entered and how much can still be entered.
 */
class BigInput extends LitElement {
	static properties = {
		rows: {type: Number},
		cols: {type: Number},
		max: {type: Number},
		actual: {type: Number, reflect: true},
		value: {reflect: true},
		wrap: {},
		placeholder: {},
		enabled: {}
	};
	
	constructor() {
		super();
		this.rows = 10;
		this.cols = 60;
		this.actual = 0;
		this.value = '';
		this.wrap = 'hard';
		this.placeholder = '';
		this.enabled = 'true';
		this.taref = createRef();
 	}
 	
	render() {
		return html`<style>
		.container {
			width:fit-content;
		}
		.counter {
			color: blue;
			width: 100%;
			text-align: right;
		}
		</style>
		<div class='container'>
			<textarea placeholder=${this.placeholder} rows=${this.rows} cols=${this.cols} @input=${this.handleInput} ${ref(this.taref)} wrap=${this.wrap}>${this.value}</textarea>
			<div class='counter'>${this.actual}/${this.max}</div>
		</div>`;
	}
	
	setValue(v) {
		this.value = v;
		this.taref.value.value = v;
		this.actual = v.length;
	}
	
	handleInput(e) {
		const ta = this.taref.value;
		this.value = ta?.value;
		this.actual = this.value.length;
//		if(this.oninput)
//			this.oninput(this.value);
	}
	
	firstUpdated() {
		const nref = this.taref.value;
		this.actual = nref?.value.length;
	}
	
	updated() {
		const nref = this.taref.value;
		
		if(this.enabled === 'false') {
			nref.disabled = true;
		} else {
			nref.disabled = false;
		}
	}
}

window.customElements.define('big-input',BigInput);
