/**
 * This software is Copyright (C) 2021-23 Tod G. Harter. All rights reserved.
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
import { Game } from './game.js';
import { BaseRepository, EntityId, ToReferences } from './baserepository.js';
import { collections, getReference } from './schema.js';

const gameConverter = {
	toFirestore(game) {
		const g = { version: 1.0 };
		for(const [key,value] of Object.entries(game)) {
			if(key === 'owner') {
				const playerDocRef = getReference(collections.players,value.id);
				g[key] = playerDocRef;
			} else if(key === 'players') {
				g[key] = ToReferences(value);
			} else if(key === 'npcs') {
				g[key] = ToReferences(value);
			} else if(key === 'images') {
				g[key] = ToReferences(value);
			} else if(key = 'id') {
				//DO NOT put ids in the data.
			} else {
				g[key] = value;
			}
		}
		return g;
	},
	
	fromFirestore(snapshot, options) {
		console.log("converting and id is "+snapshot.id);
		const id = snapshot.id;
		const eid = EntityId.create(collections.games,id);
		const data = snapshot.data(options);
		const owner = EntityId.EntityIdFromReference(data.owner);
		const characters = data.characters.map((character) => EntityId.EntityIdFromReference(character));
		const images = data.images.map((image) => EntityId.EntityIdFromReference(image));
		const npcs = data.npcs.map((npc) => EntityId.EntityIdFromReference(npc));
		const players = data.players.map((player) => EntityId.EntityIdFromReference(player));
		return new Game(eid,data.name,owner,characters,players,npcs,data.description, data.threads,images);
	}
}

const GetGameReference = (id) => {
	return getReference(schema.games,id);
};

class GameRepository extends BaseRepository {
    
    constructor() {
		super(gameConverter,collections.games);
    }
    
	getGameById(id,onDataAvailable) {
		const ref = this.getReference(id);
		this.dtoFromReference(ref,onDataAvailable);
	}
	
    getGamesByName(name,onDataAvailable) {
		this.findDtos("name",name,"==",onDataAvailable, () => { throw new Error("Can't find "+name)});
	}
    
	getGamesByOwner(playerId,onDataAvailable,onFailure) {
		const playerDocRef = getReference(schema.players,playerId);
		this.findDtos("owner",playerDocRef,"==",onDataAvailable,onFailure);
	}
	
	getPlayerGames(playerId,onDataAvailable,onFailure) {
		const playerDocRef = getReference(schema.players,playerId);
		this.findDtos("players",playerDocRef,"contains",onDataAvailable,onFailure);
	}
}

export { GameRepository, GetGameReference };

