const form = document.getElementById("form");

function handleForm(event) {
  event.preventDefault();

  axios
    //recieves search parameters and posts them to /search/test
    .post("/search/test", { name: "Kyle" })
    // you get a promise and wait for crud.js response (router.post("/test"))
    .then(responseFromAPI => {
      console.log(responseFromAPI.data);
    })
    .catch(err => console.log(err));
}
form.addEventListener("submit", handleForm);
