const form = document.getElementById("searchForm");
const result = document.getElementById("result");
const role = document.getElementById("role").innerText;

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
      responseFromAPI.data.forEach(pet => {
        //condicional if, if user is admin  entonces aparece botón delete
        //<input type="button" id="${pet._id}" ....
        if (role == "GUEST") {
          result.innerHTML += `<div class="pet">${pet.id} <input type="button" name="fav" id=${pet._id} value="<3"></div><br>`;
        } else if (role == "ADMIN") {
          //delete and edit
        } else {
          result.innerHTML += `<div class="pet">${pet.id} </div><br>`;
        }
      });
      const favButtons = document.getElementsByName("fav");
      addToFav(favButtons);
    })
    .catch(err => console.log(err));
}

form.addEventListener("submit", handleForm);

// hay que añadir un event listener para ese botón para que podamos borrar el pet de la base de datos

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
