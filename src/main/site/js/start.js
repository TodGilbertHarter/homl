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
import { NpcRepository } from './npcrepository.js';
import { ImageRepository } from './imagerepository.js';
import { registerRepository, schema } from './schema.js';
import { ConversationRepository } from './chat.js';
import VERSION from './version.js';

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
	npcRepo;
	imageRepo;
	conversationRepo;
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
		this.conversationRepo = new ConversationRepository(this,firestore);
		registerRepository(schema.conversations,this.conversationRepo);
		this.featRepo = new FeatRepository(this,firestore);
		registerRepository(schema.feats,this.featRepo);
		this.boonRepo = new BoonRepository(this,firestore);
		registerRepository(schema.boons,this.boonRepo);
		this.equipmentRepo = new EquipmentRepository(this,firestore);
		registerRepository(schema.equipment,this.equipmentRepo);
		this.callingRepo = new CallingRepository(this,firestore);
		registerRepository(schema.callings,this.callingsRepo);
		this.speciesRepo = new SpeciesRepository(this,firestore);
		registerRepository(schema.species,this.speciesRepo);
		this.backgroundRepo = new BackgroundRepository(this,firestore);
		registerRepository(schema.backgrounds,this.backgroundRepo);
		this.originRepo = new OriginRepository(this,firestore);
		registerRepository(schema.origins,this.originsRepo);
		this.playerRepo = new PlayerRepository(this,firestore);
		registerRepository(schema.players,this.playerRepo);
		this.gameRepo = new GameRepository(this,firestore);
		registerRepository(schema.games,this.gameRepo);
		this.characterRepo = new CharacterRepository(this,firestore);
		registerRepository(schema.characters,this.characterRepo);
		this.npcRepo = new NpcRepository(this,firestore);
		registerRepository(schema.npcs,this.npcRepo);
		this.imageRepo = new ImageRepository();
		registerRepository(schema.images,this.imageRepo);
		this.characterController = new CharacterController(this.speciesRepo,this.callingRepo
			,this.backgroundRepo,this.originRepo,this.characterRepo,this.boonRepo,this.equipmentRepo);
		this.authenticator = new Authenticator(this,fbProject,this.playerRepo);
		this.router = new Router({ mode: 'hash', root: '/'});
		this.view = new NotView(this,this.theDocument);
		this.controller = new Controller(this,this.view,this.authenticator,
			this.router,this.gameRepo,this.characterRepo,this.characterController,
			this.callingRepo,this.speciesRepo,this.backgroundRepo,this.originRepo,this.equipmentRepo,this.boonRepo,this.featRepo,
			this.playerRepo,this.npcRepo,this.imageRepo,this.conversationRepo);
	}
	
	version() {
		return VERSION();
	}
}

window.gebApp = new Application(window.firestore,window.fbProject,document);
