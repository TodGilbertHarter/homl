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

import java.util.Map;

import lombok.Builder;
import lombok.Value;

/**
 * @author tharter
 *
 */
@Value
@Builder
public class HoMLCharacter {
	String name;
	String species;
	String calling;
	String description;
	Map<String,String> personality;
	Map<String,String> background;
	String wealth;
	String strength;
	String constitution;
	String dexterity;
	String intelligence;
	String wisdom;
	String charisma;
	
}
