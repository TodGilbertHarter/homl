package com.giantelectronicbrain.homl.charactermanager;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

@QuarkusTest
public class CharacterServiceTest {

    @Test
    public void testGetCharacterByNameEndpoint() {
        given()
          .when().get("/characters?characterName=Squawk")
          .then()
             .statusCode(200)
             .body(is("Hello RESTEasy"));
    }

}