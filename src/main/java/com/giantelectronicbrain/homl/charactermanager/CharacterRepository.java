/**
 * This software is Copyright (C) 2021 Tod G. Harter. All rights reserved.
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
package com.giantelectronicbrain.homl.charactermanager;

import java.util.concurrent.ExecutionException;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QuerySnapshot;

/**
 * @author tharter
 *
 */
@ApplicationScoped
public class CharacterRepository {
	
	private Firestore firestore;
	
	@Inject
	public CharacterRepository(Firestore firestore) {
		this.firestore = firestore;
	}
	
	public HoMLCharacter getCharacterByName(final String characterName) throws InterruptedException, ExecutionException {
		CollectionReference characters = firestore.collection("characters");
		Query query = characters.whereEqualTo("name", characterName);
		ApiFuture<QuerySnapshot> querySnapshot = query.get();
		return querySnapshot.get().getDocuments().stream().map(document -> { return new HoMLCharacter(
				document.getString("name")
				,document.getString("species")
				,document.getString("calling")
				,document.getString("description")
				); }).reduce((first, second) -> first).get();
	}
}
