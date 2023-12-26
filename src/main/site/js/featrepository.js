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
import { Feat } from './feat.js';
import { collections } from './schema.js';
import { BaseRepository, EntityId } from './baserepository.js';

const featConverter = {
	toFirestore(feat) {
		throw new Error("Feats are not writeable");
	},
	
	fromFirestore(snapshot, options) {
		const id = snapshot.id;
		const eid = EntityId.create(collections.feats,id);
		const data = snapshot.data(options);
		return new Feat(eid,data.name,data.source,data.level,data.origin,data.tags,data.tier,data.effects,data.costs,data.components,data.action,data.attack
		,data.completesuccess,data.enhancedsuccess,data.success,data.failure,data.flavortext,data.special,data.typetarget,data.trigger,data.check
		,data.defense,data.duration,data.requirements);
	}
}

class FeatRepository extends BaseRepository {

    constructor() {
		super(featConverter,collections.feats);
    }

	/**
	 * Get a feat by name. Technically multiple feats with the same name could exist, onDataAvailable will be
	 * called for each one, but this kind of duplication should not exist in practice.
	 */
    async getFeatByName(name) {
		return await this.findEntity("name",name,"==");
    }
	
}

export { FeatRepository };

