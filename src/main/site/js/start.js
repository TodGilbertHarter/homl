import { PlayerRepository } from './playerrepository.js';
import { GameRepository } from './gamerepository.js';
import { Authenticator } from './authenticator.js';
import { Router } from './router.js';
import { NotView } from './notview.js';
import { Controller } from './controller.js';
import { CharacterRepository } from './characterrepository.js';
import { CharacterController } from './charactersheet.js';
import { Rules } from './rules.js';

class Application {
	playerRepo;
	gameRepo;
	characterRepo;
	authenticator;
	router;
	view;
	controller;
	theDocument;
	rules;
	characterController;
	
	constructor(firestore,fbProject,aDocument) {
		this.theDocument = aDocument;
		this.rules = new Rules();
		this.characterController = new CharacterController(this.rules);
		this.playerRepo = new PlayerRepository(this,firestore);
		this.gameRepo = new GameRepository(this,firestore);
		this.characterRepo = new CharacterRepository(this,firestore);
		this.authenticator = new Authenticator(this,fbProject,this.playerRepo);
		this.router = new Router({ mode: 'hash', root: '/'});
		this.view = new NotView(this,this.theDocument);
		this.controller = new Controller(this,this.view,this.authenticator,
			this.router,this.gameRepo,this.characterRepo,this.characterController,this.rules);
	}
}

window.gebApp = new Application(window.firestore,window.fbProject,document);
