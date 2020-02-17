const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    id: Number,
    organization_id: String,
    url: String,
    type: String,
    species: String,
    breeds: {
      primary: String,
      secondary: String,
      mixed: Boolean,
      unknown: Boolean
    },
    color: String, //primary
    age: String,
    gender: String,
    size: String,
    coat: String,
    attributes: {
     spayed_neutered: Boolean,
     house_trained: Boolean,
     declawed: Boolean,
     special_needs: Boolean,
     shots_current: Boolean
    },
    environment:{
      children: Boolean,
      dogs: Boolean,
      cats: Boolean
    },
    tags: Array,
    name: String,
    description: String,
    photos:{
      small: Array,
      medium: Array,
      large: Array,
      full: Array
    },
    contact:{
      email: String,
      phone: String,
      address:{
        address1: String,
        address2: String,
        city: String,
        state:String,
        postcode: String,
        country: String
      }
    },
    links:{
      petfinder: String,
      organization: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("animals", schema);


