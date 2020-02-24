document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");
  const result = document.getElementById("result");
  let pets;

  function handleForm(event) {
    event.preventDefault();

    const formData = getFormData();
    console.log(formData);
    axios
      //recieves search parameters and posts them to /search/test
      .post("/search/db", formData)
      // you get a promise and wait for crud.js response (router.post("/test"))
      .then(responseFromAPI => {
        //console.log(responseFromAPI.data);
        const pets = responseFromAPI.data.pet;
        const user = responseFromAPI.data.user;
        const role = user ? user.role : null;

        showPets(pets, role);
      })
      .catch(err => console.log(err));
  }

  form.addEventListener("submit", handleForm);

  function showPets(pets, role) {
    // adds buttons
    result.innerHTML = `<div class="petsList">`;
    pets.forEach(pet => {
      if (role == "GUEST") {
        result.innerHTML += `<div class="pet">${pet.name} 
        <input type="button" name="fav" id=${pet._id} value="<3">
        </div>
        <br>`;
      } else if (role == "ADMIN") {
        result.innerHTML += `<div class="pet">${pet.name} 
        <input type="button" name="delete" id='${pet.id}' value="delete">
        <input type="button" name="edit" id='${pet.id}' value="edit">
        </div>
        <br>`;
      } else {
        result.innerHTML += `<div class="pet">${pet.name}</div>`;
      }
    });
    result.innerHTML += `</div>`;

    //buttons functions
    const favButtons = document.getElementsByName("fav");
    addToFav(favButtons);
    const deleteButtons = document.getElementsByName("delete");
    deletePets(deleteButtons);
  }

  function deletePets(deleteButtons) {
    deleteButtons.forEach(button => {
      button.addEventListener("click", () => {
        console.log("delete button clicked of " + button.id);
        const myPet = pets.filter(pet => pet.id == button.id);
        console.log(myPet);
        let indice = pets.indexOf(myPet[0]);
        pets.splice(indice, 1);
        showPets(pets);
      });
    });
  }

  function addToFav(favButtons) {
    favButtons.forEach(button => {
      button.addEventListener("click", () => console.log("fav button clicked"));
      // to do: use axios to add to fav
    });
  }

  function getFormData() {
    const formData = {};
    const fields = {
      species: [],
      gender: [],
      age: [],
      size: [],
      attributes: {
        spayed_neutered: "",
        house_trained: "",
        //declawed: "",
        special_needs: "",
        shots_current: ""
      },
      environment: {
        children: "",
        dogs: "",
        cats: ""
      },
      "contact.address.country": "",
      photos: {}
    };

    //iterate over the fields and add to formData only the checked ones
    for (key in fields) {
      let values = Array.from(document.getElementsByName(key))
        .filter(e => e.checked) //get only the checked ones
        .map(e => e.value);
      if (values.length != 0) {
        // boolean cases, if checked are true
        if (["attributes", "environment"].includes(key)) {
          values.forEach(e => {
            formData[e] = true;
          });
        } else if (key == "photos") {
          formData["photos.full"] = { $not: { $size: 0 } };
          //string cases
        } else {
          formData[key] = values;
        }
      }
    }
    return formData;
  }
});
