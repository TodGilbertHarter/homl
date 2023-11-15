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
import { html, LitElement } from 'lit2';
import {ref, createRef } from 'lit2/ref';

/**
 * Encapsulate a canvas in a web component
 */
class Renderer extends LitElement {
	static properties = {
		width: {},
		height: {},
		_instructions: {attribute: false, state: true}
	}
	
	constructor() {
		super();
		this.width = 300;
		this.height = 150;
		this.canvasRef = createRef();
		this._instructions = [];
		this._context = null;
	}

	set instructions(instructions) {
		this._instructions = instructions;
	}

	addInstruction(instruction) {
		this._instructions.push(instruction);
		if(this._context)
			instruction.execute(this.canvasRef.value,this._context);
	}
	
	render() {
		return html`<canvas ${ref(this.canvasRef)} part='canvas' width=${this.width} height=${this.height}></canvas>`;
	}

	firstUpdated() {
		const canvas = this.canvasRef.value;
		this._context = canvas.getContext("2d");
	}
	
	updated() {
		const canvas = this.canvasRef.value;
		this._instructions.forEach((instruction) => {
			instruction.execute(canvas,this._context);
		});
	}	
}

class RenderInstruction {
	name;
	_deferredExec;
	
	constructor(name) {
		this.name = name;
		this._deferredExec = () => {}
	}

	_executeDeferred() {
		this._deferredExec();
	}
	
	_deferExecution(canvas,context) {
		this._deferredExec = () => { this.execute(canvas,context)}
	}	
	
	execute(canvas,context) {
		console.debug("executed render instruction called:" + this.name);
	}
}

class DrawImageInstruction extends RenderInstruction {
	src;
	img;
	loaded;
	xoffset;
	yoffset;
	
	constructor(name,src,xoffset,yoffset) {
		super(name);
		this.xoffset = xoffset;
		this.yoffset = yoffset;
		this.loaded = false;
		this.src = src;
		this.img = new Image();
		this.img.addEventListener('load',() => {
			this.loaded = true;
			this._executeDeferred();
		});
		this.img.src = this.src; 
	}

	execute(canvas,context) {
		if(this.loaded === false) {
			this._deferExecution(canvas,context);
		} else {
			super.execute(canvas);
			context.drawImage(this.img,this.xoffset,this.yoffset);
		}
	}
}

window.customElements.define('canvas-renderer',Renderer);

export { DrawImageInstruction };
