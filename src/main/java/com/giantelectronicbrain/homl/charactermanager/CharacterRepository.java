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

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

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
	
	/**
	 * Returns a single character by name. If more than one character exists with the same name, it is undefined which one will
	 * be returned, but only one of them will. If no character matches, then an empty character will be returned.
	 * 
	 * @param characterName name of the character to search for.
	 * @return HoMLCharacter a character the given name.
	 * @throws InterruptedException if the query is interrupted
	 * @throws ExecutionException if the query fails for some other reason
	 */
	public HoMLCharacter getCharacterByName(final String characterName) throws InterruptedException, ExecutionException {
		CollectionReference characters = firestore.collection("characters");
		Query query = characters.whereEqualTo("name", characterName);
		ApiFuture<QuerySnapshot> querySnapshot = query.get();
		return querySnapshot.get().getDocuments().stream().map(document -> { 
			return HoMLCharacter.builder()
				.name(document.getString("name"))
				.species(document.getString("species"))
				.calling(document.getString("calling"))
				.description(document.getString("description"))
				.personality((Map<String,String>)document.get("personality"))
				.background((Map<String,String>)document.get("background"))
				.wealth(document.getString("wealth"))
				.strength(document.getString("strength"))
				.constitution(document.getString("constitution"))
				.dexterity(document.getString("dexterity"))
				.intelligence(document.getString("intelligence"))
				.wisdom(document.getString("wisdom"))
				.charisma(document.getString("charisma"))
				.build(); }).reduce((first, second) -> first).get();
	}
	
	/**
	 * Get ALL characters in the database, this could be a bad idea, we will add a limit and offset later.
	 * @return List of all characters
	 * @throws InterruptedException if the query is interrupted
	 * @throws ExecutionException if the query fails for some other reason
	 */
	public List<HoMLCharacter> getCharacters() throws InterruptedException, ExecutionException {
		CollectionReference characters = firestore.collection("characters");
		ApiFuture<QuerySnapshot> querySnapshot = characters.get();
		return querySnapshot.get().getDocuments().stream().map(document -> { 
			return HoMLCharacter.builder()
				.name(document.getString("name"))
				.species(document.getString("species"))
				.calling(document.getString("calling"))
				.description(document.getString("description"))
				.personality((Map<String,String>)document.get("personality"))
				.background((Map<String,String>)document.get("background"))
				.wealth(document.getString("wealth"))
				.strength(document.getString("strength"))
				.constitution(document.getString("constitution"))
				.dexterity(document.getString("dexterity"))
				.intelligence(document.getString("intelligence"))
				.wisdom(document.getString("wisdom"))
				.charisma(document.getString("charisma"))
				.build(); }).collect(Collectors.toList());
		
	}
}
