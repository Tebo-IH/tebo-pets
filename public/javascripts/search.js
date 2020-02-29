document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");
  const result = document.getElementById("result");
<<<<<<< HEAD
  const btns = document.getElementById("resultBtns");
  let maxIdx = 20;
=======
>>>>>>> develop

  function handleForm(event) {
    event.preventDefault();

    const formData = getFormData();
    console.log(formData);
    axios
      //recieves search parameters and posts them to /search/test
      .post("/search/db", formData)
      // you get a promise and wait for crud.js response (router.post("/test"))
      .then(responseFromAPI => {
        console.log(responseFromAPI.data);
        const pets = responseFromAPI.data.pet;
        const user = responseFromAPI.data.user;
        const role = user ? user.role : null;

        showPets(pets, role);
      })
      .catch(err => console.log(err));
  }

  form.addEventListener("submit", handleForm);

  function showPets(pets, role) {
    let pagePets = pets.slice(0, maxIdx);

    paginatePets(pagePets, pets, role);
  }

  function paginatePets(pagePets, pets, role) {
    result.innerHTML = ``;
    pagePets.forEach(pet => {
      result.innerHTML += `
      <div class="pet">${pet.name}<br>
      <img src=${pet.photos.small[0]}>
      `;

      //adds buttons if role
      if (role == "GUEST") {
        result.innerHTML += ` 
        <input type="button" name="fav" id=${pet._id} value="<3">
        <br>`;
      } else if (role == "ADMIN") {
        result.innerHTML += ` 
        <input type="button" name="delete" id='${pet._id}' value="delete">
        <br>`;
        /*result.innerHTML += ` 
        <input type="button" name="delete" id='${pet._id}' value="delete">
        <input type="button" name="edit" id='${pet._id}' value="edit">
        </div>
        <br>`;*/
      }
      result.innerHTML += `</div>`;
    });

    //buttons functions
    const favButtons = document.getElementsByName("fav");
    addToFav(favButtons);
    const deleteButtons = document.getElementsByName("delete");
    deletePets(deleteButtons, pets, role);
    console.log(maxIdx);

    //add pagination buttons:
    btns.innerHTML = ``;
    btns.innerHTML += `<input type="button" class="page-btn next" id="nextPageBtn" name="nextPage" value="next page">`;

    if (maxIdx > 20) {
      btns.innerHTML += `<input type="button" class="page-btn previous" id="previousPageBtn" name="previousPage" value="previous page">`;
      const previousBtn = document.getElementById("previousPageBtn");
      previousBtn.addEventListener("click", () => {
        maxIdx -= 20;
        let pagePets = pets.slice(maxIdx, maxIdx + 20);
        paginatePets(pagePets, pets, role);
      });
    }

    const nextBtn = document.getElementById("nextPageBtn");
    nextBtn.addEventListener("click", () => {
      maxIdx += 20;
      let pagePets = pets.slice(maxIdx, maxIdx + 20);
      paginatePets(pagePets, pets, role);
    });
  }

  function deletePets(deleteButtons, pets, role) {
    deleteButtons.forEach(button => {
      button.addEventListener("click", () => {
        //delete from list
        console.log("delete button clicked of " + button.id);
        const myPet = pets.filter(pet => pet._id == button.id);
        let indice = pets.indexOf(myPet[0]);
        pets.splice(indice, 1);
        //delete from database
        axios
          .post("/search/delete", { pet: button.id })
          .then(responseFromAPI => {
            console.log(responseFromAPI);
            showPets(pets, role);
          })
          .catch(error => console.log(error));
      });
    });
  }

  function addToFav(favButtons) {
    favButtons.forEach(button => {
      button.addEventListener("click", () => {
        console.log("fav button clicked", button.id);
        axios
          .post("/search/fav", { id: button.id })
          .then(responseFromAPI => console.log(responseFromAPI))
          .catch(error => console.log(error));
      });
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
