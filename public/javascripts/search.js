const form = document.getElementById("searchForm");

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
    })
    .catch(err => console.log(err));
}
form.addEventListener("submit", handleForm);

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
