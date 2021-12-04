package com.giantelectronicbrain.homl.charactermanager;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.equalTo;

@QuarkusTest
public class CharacterServiceTest {

    @Test
    public void testGetCharacterByNameEndpoint() {
       given()
          .when().get("/characters?characterName=Test2")
          .then()
             .statusCode(200)
             .body("name",equalTo("Test2"));
    }
}