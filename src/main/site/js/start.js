import { PlayerRepository } from './playerrepository.js';
import { GameRepository } from './gamerepository.js';
import { Authenticator } from './authenticator.js';
import { Router } from './router.js';
import { NotView } from './notview.js';
import { Controller } from './controller.js';
import { CharacterRepository } from './characterrepository.js';
import { CharacterController } from './charactersheet.js';
import { CallingRepository } from './callingrepository.js';
import { SpeciesRepository } from './speciesrepository.js';


class Application {
	playerRepo;
	gameRepo;
	characterRepo;
	callingRepo;
	speciesRepo;
	authenticator;
	router;
	view;
	controller;
	theDocument;
	characterController;
	
	constructor(firestore,fbProject,aDocument) {
		this.theDocument = aDocument;
		this.callingRepo = new CallingRepository(this,firestore);
		this.speciesRepo = new SpeciesRepository(this,firestore);
		this.characterController = new CharacterController();
		this.playerRepo = new PlayerRepository(this,firestore);
		this.gameRepo = new GameRepository(this,firestore);
		this.characterRepo = new CharacterRepository(this,firestore);
		this.authenticator = new Authenticator(this,fbProject,this.playerRepo);
		this.router = new Router({ mode: 'hash', root: '/'});
		this.view = new NotView(this,this.theDocument);
		this.controller = new Controller(this,this.view,this.authenticator,
			this.router,this.gameRepo,this.characterRepo,this.characterController,
			this.callingRepo,this.speciesRepo);
	}
}

window.gebApp = new Application(window.firestore,window.fbProject,document);
