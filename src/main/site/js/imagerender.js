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
import { Application, Assets, Sprite } from 'pixijs';
import { Grid, GridTypes } from './graphics.js';

/**
 * Encapsulate a PIXI Application in a web component. This is intended
 * to allow for creating relatively static layered map-like renderings, or
 * simply displaying images.
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
		this._pixiApplication = new Application({width: this.width, height: this.height});
		this._ref = createRef();
		this._instructions = [];
	}

	set instructions(instructions) {
		this._instructions = instructions;
	}

	addInstruction(instruction) {
		this._instructions.push(instruction);
		if(this._ref.value)
			instruction.execute(this._pixiApplication);
	}
	
	render() {
		return html`<div ${ref(this._ref)} part='renderer' width=${this.width} height=${this.height}></div>`;
	}

	firstUpdated() {
		this._ref.value.appendChild(this._pixiApplication.view);
	}
	
	updated() {
		this._instructions.forEach((instruction) => {
			instruction.execute(this._pixiApplication);
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
	
	_deferExecution(pixiApplication) {
		this._deferredExec = () => { this.execute(pixiApplication)}
	}	
	
	execute(pixiApplication) {
		console.debug("executed render instruction called:" + this.name);
	}
}

class DrawImageInstruction extends RenderInstruction {
	src;
	asset;
	loaded;
	xoffset;
	yoffset;
	
	constructor(name,src,xoffset,yoffset) {
		super(name);
		this.xoffset = xoffset;
		this.yoffset = yoffset;
		this.loaded = false;
		this.src = src;
// Dunno why the 'Assets' stuff doesn't work, but it is borked.
/*		Assets.load(this.src).then((asset) => {
			this.asset = asset;
			this.loaded = true;
			this._executeDeferred();
		}); */
		this.asset = Sprite.from(this.src);
		this.loaded = true;
		this._executeDeferred();
	}

	execute(application) {
		if(this.loaded === false) {
			this._deferExecution(application);
		} else {
			super.execute(application);
			application.stage.addChild(this.asset);
		}
	}
}

class DrawGridInstruction extends RenderInstruction {
	rows;
	cols;
	gridType;
	gridColor;
	grid;
	
	constructor(name,rows, cols, gridType, gridColor) {
		super(name);
		this.rows = rows;
		this.cols = cols;
		this.gridType = gridType;
		this.gridColor = gridColor;
	}
	
	execute(application) {
		super.execute(application);
		this.grid = new Grid(rows,cols,application.stage,gridType,gridColor,null);
	}
}

window.customElements.define('canvas-renderer',Renderer);

export { DrawImageInstruction };
