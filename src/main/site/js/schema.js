/**
 * This software is Copyright (C) 2022 Tod G. Harter. All rights reserved.
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

/*
 * Represents a HoML calling. It contains the rules calculator(s) for doing basic character calculations
 * related to the calling itself, along with things like choosers which allow for selecting of calling-related
 * options during chargen, etc.
 */
import { doc } from 'firebase-firestore';

const schema = {
	backgrounds: 'backgrounds',
	boons: 'boons',
	callings: 'callings',
	characters: 'characters',
	feats: 'feats',
	games: 'games',
	origins: 'origins',
	players: 'players',
	species: 'species',
	equipment: 'equipment',
	messages: 'messages',
	npcs: 'npcs',
	images: 'images',
	macros: 'macros',
	conversations: 'conversations'
};

const repoRegistry = {
	
};

/**
 * Register a repository instance to handle resolveReference
 * requests for a given FireStore collection. It is assumed this
 * is the same collection the schema entry references.
 */
const registerRepository = (schema,repoInstance) => {
	repoRegistry.schema = repoInstance;
}

const getRepository = (schema) => {
	return repoRegistry.schema;
}

const resolveReference = (ref,onSuccess) => {
	var schema = ref.path.split('/')[0];
	var repo = getRepoForSchema(schema);
	repo.dtoFromReference(ref,onSuccess);
}

const resolveReferenceAsync = async (ref) => {
	var schema = ref.path.split('/')[0];
	var repo = getRepoForSchema(schema);
	return await repo.dtoFromReferenceAsync(ref);
}

const getReference = (schema,id) => {
	return doc(getDb(),schema,id);
}

const refToId = (ref) => {
	return ref.id;
}

const getDb = () => { return window.gebApp.firestore }

export { schema, getReference, getDb, registerRepository, resolveReference, resolveReferenceAsync, getRepository, refToId };
