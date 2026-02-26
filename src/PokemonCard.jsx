import React, { useState, useEffect } from 'react';

// Define the colors outside the component
const typeColors = {
  normal: '#f3f4f6',   // gray-100
  fire: '#fee2e2',     // red-100
  water: '#dbeafe',    // blue-100
  electric: '#fef3c7', // yellow-100
  grass: '#dcfce7',    // green-100
  ice: '#e0f2fe',      // sky-100
  fighting: '#ffedd5', // orange-100
  poison: '#f3e8ff',   // purple-100
  ground: '#fef08a',   // yellow-200
  flying: '#e0e7ff',   // indigo-100
  psychic: '#fce7f3',  // pink-100
  bug: '#ecfccb',      // lime-100
  rock: '#ffedd5',     // orange-100
  ghost: '#ede9fe',    // violet-100
  dragon: '#c7d2fe',   // indigo-200
  dark: '#f3f4f6',     // gray-100
  steel: '#f1f5f9',    // slate-100
  fairy: '#fbcfe8',    // pink-200
};

export default function PokemonCard({ pokemon, onClick }) {
  const id = pokemon.url.split('/').filter(Boolean).pop();
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  // Create state to hold the type once we fetch it
  const [pokemonType, setPokemonType] = useState('normal'); 

  // Fetch the specific Pokemon's data to get its type when the card loads
  useEffect(() => {
    const fetchType = async () => {
      try {
        const response = await fetch(pokemon.url);
        const data = await response.json();
        // Grab the first type (e.g., "grass") from the API response
        setPokemonType(data.types[0].type.name); 
      } catch (error) {
        console.error("Error fetching type:", error);
      }
    };
    
    fetchType();
  }, [pokemon.url]);

  // Get the correct color based on the fetched type
  const cardColor = typeColors[pokemonType] || typeColors.normal;

  return (
    <div 
      onClick={() => onClick(id)}
      className="group rounded-xl shadow-md p-4 cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center"
      style={{ backgroundColor: cardColor }} 
    >
      <img 
        src={imageUrl} 
        alt={pokemon.name} 
        // This makes the image pop out to greet the user when the card is hovered!
        className="w-32 h-32 object-contain bg-white/60 rounded-full p-2 mb-4 shadow-sm transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />
      <h2 className="text-xl font-semibold capitalize">{pokemon.name}</h2>
      <p className="text-gray-500 text-sm mt-1">#{id.padStart(3, '0')}</p>
    </div>
  );
}