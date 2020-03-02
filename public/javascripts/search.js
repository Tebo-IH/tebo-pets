document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");
  const result = document.getElementById("result");
  const btns = document.getElementById("resultBtns");
  const numResults = document.getElementById("numberOfResults");
  let maxIdx = 20;

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
        numResults.innerHTML = `${pets.length} results`
        $('#collapseFilter').collapse('hide');
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
      let petHTML = `<div class="pet"><h4>${pet.name}</h4><br><a href="${pet.url}">`
      if (pet.photos.large.length == 0) {
        petHTML += `
        <img class="default-img" src="./images/default-paw.svg"></img>`;
      } else {
        petHTML += `
        <img src=${pet.photos.large[0]}></img>`;
      }

      petHTML += `</a><p>
      Sex: ${pet.gender}<br>
      Age: ${pet.age}<br>
      Size: ${pet.size}<br>
      Breed: ${pet.breeds.primary}<br>
      </p>`


      //adds buttons if role
      if (role == "GUEST") {
        petHTML += ` 
        <input class="btn-basic" type="button" name="fav" id=${pet._id} value="♡">
        <br>`;
      } else if (role == "ADMIN") {
        petHTML += ` 
        <input class="btn-basic" type="button" name="delete" id='${pet._id}' value="Delete from database">
        <br>`;
        /*petDisplay.innerHTML += ` 
        <input type="button" name="delete" id='${pet._id}' value="delete">
        <input type="button" name="edit" id='${pet._id}' value="edit">
        </div>
        <br>`;*/
      }
      petHTML += `</div>`;
      result.innerHTML += petHTML;
    });

    //buttons functions
    const favButtons = document.getElementsByName("fav");
    addToFav(favButtons);
    const deleteButtons = document.getElementsByName("delete");
    deletePets(deleteButtons, pets, role);
    console.log(maxIdx);

    //add pagination buttons:
    btns.innerHTML = ``;
    btns.innerHTML += `<input type="button" class="btn-basic page-btn next" id="nextPageBtn" name="nextPage" value="next page">`;

    if (maxIdx > 20) {
      btns.innerHTML += `<input type="button" class="btn-basic page-btn previous" id="previousPageBtn" name="previousPage" value="previous page">`;
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
      coat: [],
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

//change text in collapse btn

$('#collapseFilter').on('shown.bs.collapse', function () {
  $('#collapseBtn').text('Collapse filters');
});
$('#collapseFilter').on('hidden.bs.collapse', function () {
  $('#collapseBtn').text('Show filters');
});


/*
$('#nextPageBtn').on('click', function () {
  $('html,body').animate({ scrollTop: 2000 }, 2000);
  $('html').animate({ scrollTop: 2000 }, 2000); // works in Firefox and Chrome
  $('body').animate({ scrollTop: 2000 }, 2000); // works in Safari
});*/
