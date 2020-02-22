const form = document.getElementById("form");
const result = document.getElementById("result");

function handleForm(event) {
  event.preventDefault();

  const formData = getFormData();
  console.log(formData);

  axios
    //recieves search parameters and posts them to /search/test
    .post("/search/db", formData)
    // you get a promise and wait for crud.js response (router.post("/test"))
    .then(responseFromAPI => {
      console.log(responseFromAPI);
      responseFromAPI.data.forEach(
        //condicional if, if user is admin  entonces aparece botón delete
        //<input type="button" id="${pet._id}" ....
        pet => (result.innerHTML += `${pet.id} <br>`)
      );
    })
    .catch(err => console.log(err));
}

form.addEventListener("submit", handleForm);
// hay que añadir un event listener para ese botón para que podamos borrar el pet de la base de datos

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
