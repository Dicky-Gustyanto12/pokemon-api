import React, { useState, useEffect } from "react";

export default function Select() {
  const [sources, setSources] = useState([]); // State for Pokémon list
  const [listPilihan, setListPilihan] = useState(""); // State for selected Pokémon
  const [tampilBtn, setTampilBtn] = useState(false); // State to show button
  const [pokemonImage, setPokemonImage] = useState(""); // State for storing image link
  const [effectEntries, setEffectEntries] = useState(""); // State for ability description

  const poke = async () => {
    const linkk = await fetch("https://pokeapi.co/api/v2/");
    const dt = await linkk.json()
    console.log(dt)
  }

  // API to fetch Pokémon list
  const pokemonApi = async () => {
    try {
      const url = await fetch("https://pokeapi.co/api/v2/pokemon/");
      const ambilData = await url.json();
      const sumberData = await Promise.all(
        ambilData.results.map(async (isiNama) => {
          const detailPokemon = await fetch(isiNama.url);
          const pokemonDetail = await detailPokemon.json();
          return {
            label: isiNama.name,
            value: isiNama.name,
            image: pokemonDetail.sprites.other.home.front_default,
            abilities: pokemonDetail.abilities // Store abilities for later use
          };
        })
      );
      setSources(sumberData.sort((a, b) => a.label.localeCompare(b.label)));
    } catch (error) {
      console.error("Error fetching Pokémon list: ", error);
    }
  };

  // API to fetch ability details based on selected Pokémon
  const fetchAbilityData = async (abilityUrl) => {
    try {
      const abilityDetailResponse = await fetch(abilityUrl);
      const abilityDetailData = await abilityDetailResponse.json();
      const englishEntry = abilityDetailData.effect_entries.find(
        (entry) => entry.language.name === "en"
      );

      if (englishEntry) {
        setEffectEntries(englishEntry.effect);
      } else {
        setEffectEntries("No English description available.");
      }
    } catch (error) {
      console.error("Error fetching ability data: ", error);
      setEffectEntries("Failed to fetch ability description.");
    }
  };

  useEffect(() => {
    pokemonApi();
    poke();
  }, []);

  // Handle dropdown change
  const handleChange = (event) => {
    const selectedPokemon = sources.find(item => item.value === event.target.value);
    if (selectedPokemon) {
      setListPilihan(selectedPokemon.value);
      setTampilBtn(false); // Reset display when selection changes
      setPokemonImage(selectedPokemon.image); // Set image based on selection
      setEffectEntries(""); // Reset effectEntries until the button is clicked
    }
  };

  // Handle button click to show ability details
  const handleSubmit = () => {
    if (listPilihan) {
      const selectedPokemon = sources.find(item => item.value === listPilihan);
      if (selectedPokemon && selectedPokemon.abilities.length > 0) {
        // Fetch ability details for the first ability of the selected Pokémon
        fetchAbilityData(selectedPokemon.abilities[0].ability.url);
        setTampilBtn(true); // Show image and description when button is clicked
      }
    }
  };

  return (
    <div className="container px-4 mx-auto">
      <div className="flex justify-center mb-4">
        <select 
          className="w-full max-w-xs capitalize select select-error"
          onChange={handleChange}
          value={listPilihan}
        >
          <option disabled value="">
            Cari Pokémon...
          </option>
          {sources.map((source, index) => (
            <option key={index} value={source.value}>
              {source.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-center mb-4">
        <Button handleSubmit={handleSubmit} />
      </div>

      {/* Display image and description only if the button is clicked */}
      {tampilBtn && listPilihan && (
        <div className="flex flex-col items-center justify-center pb-1 mt-10 sm:flex-row ">
          <div className="flex flex-col items-center ">
            <h1 className="mb-1 text-lg font-bold text-white uppercase sm:text-4xl">{listPilihan}</h1>
            <img 
              src={pokemonImage} 
              alt={`Gambar dari ${listPilihan}`} 
              className="mb-2 w-44 h-44 sm:-mt-3 sm:w-72 sm:h-72"
            />
          </div>
          <div className="flex flex-col items-center sm:-mt-28 sm:items-start sm:w-[30rem]">
            <h1 className="text-lg text-center text-white sm:text-left">Ability :</h1>
            <p className="w-full mt-1 mb-3 text-sm font-light text-justify text-white">{effectEntries}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Button component
export function Button({ handleSubmit }) {
  return (
    <button
      onClick={handleSubmit}
      className="mt-4 text-black bg-slate-200 btn"
    >
      Lihat Pokémon!
    </button>
  );
}
