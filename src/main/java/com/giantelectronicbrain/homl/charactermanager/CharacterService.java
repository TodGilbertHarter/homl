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
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

/**
 * @author tharter
 *
 */
@Path("/characters")
@ApplicationScoped
public class CharacterService {

	private CharacterRepository repository;
	
	@Inject
	public CharacterService(CharacterRepository repository) {
		this.repository = repository;
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public HoMLCharacter getCharacter(@QueryParam(value = "characterName") String characterName) throws InterruptedException, ExecutionException {
		return repository.getCharacterByName(characterName);
		
	}
}
