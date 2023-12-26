import { NotView } from './notview.js';
import { Controller } from './controller.js';
import { CharacterController } from './charactersheet.js';
import VERSION from './version.js';
import { DataManager } from './datamanager.js';

class Application {
	view;
	controller;
	theDocument;
	characterController;
	firestore;
	
	constructor(firestore,fbProject,aDocument) {
		this.firestore = firestore;
		this.theDocument = aDocument;
		this.characterController = new CharacterController();
		this.view = new NotView(this,this.theDocument);
		this.controller = new Controller(this.view,this.characterController);
	}
	
	version() {
		return VERSION();
	}
}

window.gebApp = new Application(window.firestore,window.fbProject,document);
