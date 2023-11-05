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
import { OriginRepository } from './originrepository.js';
import { BackgroundRepository } from './backgroundrepository.js';
import { EquipmentRepository } from './equipmentrepository.js';
import { BoonRepository } from './boonrepository.js';
import { FeatRepository } from './featrepository.js';

class Application {
	featRepo;
	boonRepo;
	equipmentRepo;
	playerRepo;
	gameRepo;
	characterRepo;
	callingRepo;
	speciesRepo;
	backgroundRepo;
	originRepo;
	authenticator;
	router;
	view;
	controller;
	theDocument;
	characterController;
	firestore;
	
	constructor(firestore,fbProject,aDocument) {
		this.firestore = firestore;
		this.theDocument = aDocument;
		this.featRepo = new FeatRepository(this,firestore);
		this.boonRepo = new BoonRepository(this,firestore);
		this.equipmentRepo = new EquipmentRepository(this,firestore);
		this.callingRepo = new CallingRepository(this,firestore);
		this.speciesRepo = new SpeciesRepository(this,firestore);
		this.backgroundRepo = new BackgroundRepository(this,firestore);
		this.originRepo = new OriginRepository(this,firestore);
		this.playerRepo = new PlayerRepository(this,firestore);
		this.gameRepo = new GameRepository(this,firestore);
		this.characterRepo = new CharacterRepository(this,firestore);
		this.characterController = new CharacterController(this.speciesRepo,this.callingRepo
			,this.backgroundRepo,this.originRepo,this.characterRepo,this.boonRepo,this.equipmentRepo);
		this.authenticator = new Authenticator(this,fbProject,this.playerRepo);
		this.router = new Router({ mode: 'hash', root: '/'});
		this.view = new NotView(this,this.theDocument);
		this.controller = new Controller(this,this.view,this.authenticator,
			this.router,this.gameRepo,this.characterRepo,this.characterController,
			this.callingRepo,this.speciesRepo,this.backgroundRepo,this.originRepo,this.equipmentRepo,this.boonRepo,this.featRepo,
			this.playerRepo);
	}
}

window.gebApp = new Application(window.firestore,window.fbProject,document);
