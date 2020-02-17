const { withDbConnection } = require("../lib/withDbConnection.js");
const mongoose = require("mongoose");
const animals = require("../models/animals");
const { animals: petsArray } = require("./cat/example.json");

withDbConnection(async () => {
  await animals.create(
    petsArray.map(pet => ({
      id: pet.id,
      organization_id: pet.organization,
      url: pet.url,
      type: pet.type,
      species: pet.species,
      breeds: {
        primary: pet.breeds.primary,
        secondary: pet.breeds.secondary,
        mixed: pet.breeds.mixed,
        unknown: pet.breeds.unknown
      },
      color: pet.colors.primary,
      age: pet.age,
      gender: pet.gender,
      size: pet.size,
      coat: pet.coat,
      attributes: {
        spayed_neutered: pet.attributes.spayed_neutered,
        house_trained: pet.attributes.house_trained,
        declawed: pet.attributes.declawed,
        special_needs: pet.attributes.special_needs,
        shots_current: pet.attributes.shots_current
      },
      environment: {
        children: pet.environment.children,
        dogs: pet.environment.dogs,
        cats: pet.environment.cats
      },
      tags: pet.tags,
      name: pet.name,
      description: pet.name,
      photos: {
        small: pet.photos.map(e => e.small),
        medium: pet.photos.map(e => e.medium),
        large: pet.photos.map(e => e.large),
        full: pet.photos.map(e => e.full)
      },
      contact: {
        email: pet.contact.email,
        phone: pet.contact.phone,
        address: {
          address1: pet.contact.address.address1,
          address2: pet.contact.address.address2,
          city: pet.contact.address.city,
          state: pet.contact.address.state,
          postcode: pet.contact.address.postcode,
          country: pet.contact.address.country
        }
      },
      links: {
        petfinder: pet._links.self.href,
        organization: pet._links.organization.href
      }
    }))
  );
});
