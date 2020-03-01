# teboo
Teboo is a Full-stack Web Application developed in two weeks by [@borja115](www.github.com/borja115) and [@pelinski](www.github.com/pelinski) for the Ironhack Web Development bootcamp. The app is built on Express and uses Node.js, HandlebarsJS, HTML5, CSS, SASS, MongoDB, AXIOS and other npm packages.

Try teboo [**here**](https://tebo-pets.herokuapp.com/).

## Ok, but what does it do?
Teboo helps you find your perfect pet match. Its main functionality is providing the user a wide set of filters to search for pets in adoption in the US and CA. These parameters include generalities such as sex or coat, but also more specific criteria such as 'spayed or neutered' or 'good with children', among others. Registered users can also have a list of favorite pets, while admins can delete pets from database directly from the app.

## Technicalities 
### Database 
We used **mongoDB** for the database. There are two models: one for pets and one for users. They can be found in the `models` folder. 
We did not create 600 pets for our database seed, they are actually real pets set for adoption in [Petfinder](www.petfinder.com). We used the [PetfinderAPI](https://www.petfinder.com/developers/) to import the pets to our database and adapted their profiles to our mongoDB model. See `seeds/seed.js`

### Authentication and roles
The **Passport** middleware is used for handling the authentication and roles in the app. There are three roles in our app: VISITOR, GUEST and ADMIN. 
Not authenticated users are VISITORS. They can only search for pets. GUESTs are authenticated users who can also add their favorite pets to their profile (favs) by clicking on the heart under the pet description. This is the default role when signing in. ADMINs can also delete pets from database. The ADMIN role can only be given by directly changing the user role in the database.

### Axios 
When the user applies its filters and clicks on the search button, the results appear at the bottom of the screen without reloading the page. This is done using Axios (see `public/javascript/search.js`), which handles the petition to the database. The results are then shown through DOM manipulation. Axios is also used for deleting pets from the database (only admins) and adding pets to the user favorite list (only guests).

The results have also been paginated so that only 20 pets are shown per page. The pagination is also done with DOM manipulation. This prevents the page from overloading due to a huge amount of pictures.


### Handlebars and SASS
Handlebars and SASS are used for a more effective HTML and CSS generation. Handlebar partials are also used for the navbar and the search filters form.

## There is always (a lot of) room for improvement
Due to time restrictions, a couple of aspects that were in our initial idea have been left undone. In order of importance:
* **Editing and updating pet data for admins**: So that the database can be entirely managed by admins from the web app (CRUD). 
* **Pet profiles**: In the search results, only the age, sex and breed are displayed. However, as it can be seen in `models/animals.js`, much more information about the pets is stored in the database. Ideally, when clicking on the pet, a page showing all the information should be displayed.
* **Graphic design**: The interface is quite basic and not quite responsive.
* **Password security**: Impose restrictions when creating a password. 

## License

Please refer to `LICENSE.md`. 

## Contributing

If you want to contribute to this project, please add yourself to `CONTRIBUTING.md`.
