import React, { Component } from "react";

class Cards extends Component {
  render() {
    const { results } = this.props;

    let display;
    if (results === null) {
      // no search, nothing to display
      display = "";
    } else if (results.length) {
      // search and results to display, according to category of each result
      display = results.map(result => {
        switch (result.category) {
          case "people": {
            const {
              name,
              category,
              height,
              hair_color: hairColor,
              skin_color: skinColor
            } = result;
            return (
              <div className="one-card" key={name}>
                <img
                  src="images/people.png"
                  className="card-image"
                  alt="people"
                />
                <ul>
                  <li>
                    <b>{name}</b>
                  </li>
                  <li>category: {category}</li>
                  <li>height: {height}</li>
                  <li>hair color: {hairColor}</li>
                  <li>skin color: {skinColor}</li>
                </ul>
              </div>
            );
          }
          case "planets": {
            const { name, category, climate, population, terrain } = result;
            return (
              <div className="one-card" key={name}>
                <img
                  src="images/planet.png"
                  className="card-image"
                  alt="planet"
                />
                <ul>
                  <li>
                    <b>{name}</b>
                  </li>
                  <li>category: {category}</li>
                  <li>climate: {climate}</li>
                  <li>population: {population}</li>
                  <li>terrain: {terrain}</li>
                </ul>
              </div>
            );
          }
          case "species": {
            const {
              name,
              category,
              language,
              average_height: averageHeight,
              average_lifespan: averageLifespan,
              skin_colors: skinColors
            } = result;
            return (
              <div className="one-card" key={name}>
                <img
                  src="images/species.png"
                  className="card-image"
                  alt="species"
                />
                <ul>
                  <li>
                    <b>{name}</b>
                  </li>
                  <li>category: {category}</li>
                  <li>language: {language}</li>
                  <li>average height: {averageHeight}</li>
                  <li>average lifespan: {averageLifespan}</li>
                  <li>skin colors: {skinColors}</li>
                </ul>
              </div>
            );
          }
          case "starships":
          case "vehicles": {
            const { name, category, model, crew, passengers } = result;
            const image =
              result.category === "vehicles" ? (
                <img
                  src="images/vehicle.png"
                  className="card-image"
                  alt="vehicle"
                />
              ) : (
                <img
                  src="images/starship.png"
                  className="card-image"
                  alt="starship"
                />
              );
            return (
              <div className="one-card" key={name}>
                {image}
                <ul>
                  <li>
                    <b>{name}</b>
                  </li>
                  <li>category: {category}</li>
                  <li>model: {model}</li>
                  <li>crew: {crew}</li>
                  <li>passengers: {passengers}</li>
                </ul>
              </div>
            );
          }
          default:
            return "";
        }
      });
    } else {
      // search and no results to display
      display = (
        <div className="no-results">There are no results for your search.</div>
      );
    }

    return <div className="cards">{display}</div>;
  }
}

export default Cards;
