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
import * as PIXI from 'pixijs';

/* Enum of all possible grid types, row major hex, column major hex, and square. Technically triangular grids could also be defined, but nobody wants them. */

export class GridTypes {
	static #_SQUARE = Object.freeze({name: "SQUARE", oddoffset: 0, byrow: true, sides: 4, rotation: Math.PI/4});
	static #_HEXCOL = Object.freeze({name: "HEXCOL", oddoffset: 0.5, byrow: false, sides: 6, rotation: Math.PI/6});
	static #_HEXROW = Object.freeze({name: "HEXROW", oddoffset: 0.5, byrow: true, sides: 6, rotation: 0});
	
	static get SQUARE() { return this.#_SQUARE; }
	static get HEXCOL() { return this.#_HEXCOL; }
	static get HEXROW() { return this.#_HEXROW; }
}

/**
 * Grid class, this provides all the functionality needed to render a grid, and
 * should also contain the functions needed to localize UI events to a specific
 * grid coordinate. It supports all of the above defined grid types.
 */

export class Grid {
	rows;
	cols;
	container;
	gridType;
	lineColor;
	fillColor;
	size = 10;
	
	constructor(rows, cols, container, gridType, lineColor, fillColor) {
		this.rows = rows;
		this.cols = cols;
		this.container = container;
		this.gridType = gridType;
		this.lineColor = lineColor;
		this.fillColor = fillColor;
	}
	
	_points() {
		let sides = this.gridType.sides;
		let rot = this.gridType.rotation;
		let points = [];
		for(let i = 0; i < sides; i++) {
			const rotation = rot + ((Math.PI * 2) / sides) * i;
			points.push(this.size * Math.cos(rotation));
			points.push(this.size * Math.sin(rotation));
		}
		return points;	
	}

	_polygon() {
		this.gitem = new PIXI.Graphics();
		if(this.fillColor) { this.gitem.beginFill(this.fillColor); }
		this.gitem.lineStyle(1,this.lineColor);
		this.gitem.drawPolygon(this._points());
		if(this.fillColor) { this.gitem.endFill(); }
	}
	
	_buildByRow() {
		let y = 0;
		const oddOffset = this.gridType.oddoffset * this.size;
		for(let i = 0; i < this.rows; i++) {
			let x = i % 2 != 0 ? oddOffset : 0;
			for(let j = 0; j < this.cols; j++) {
				console.log(`${j},${i} - ${x},${y}`);
				let poly = this.gitem.clone();
				poly.x = x;
				poly.y = y;
				this.container.addChild(poly);
				x += this.size * 1.5;
			}
			y += this.size * 1.5;
		}
	}
	
	_buildByCol() {
		throw new Error("not implemented");
	}
	
	build() {
		this._polygon();
		const order = this.gridType.byrow;
		if(order) {
			this._buildByRow();
		} else {
			this._buildByCol();
		}
	}
}