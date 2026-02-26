import React, { useState, useEffect } from 'react';
import PokemonCard from './PokemonCard';
import PokemonModal from './PokemonModal';
import PokemonSkeleton from './PokemonSkeleton';

const pokemonTypes = [
  'all', 'normal', 'fire', 'water', 'grass', 'electric', 'ice', 
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

// CHANGED: We now use the soft pastel colors to perfectly match your cards!
const typeColors = {
  normal: '#f3f4f6',   
  fire: '#fee2e2',     
  water: '#dbeafe',    
  electric: '#fef3c7', 
  grass: '#dcfce7',    
  ice: '#e0f2fe',      
  fighting: '#ffedd5', 
  poison: '#f3e8ff',   
  ground: '#fef08a',   
  flying: '#e0e7ff',   
  psychic: '#fce7f3',  
  bug: '#ecfccb',      
  rock: '#ffedd5',     
  ghost: '#ede9fe',    
  dragon: '#c7d2fe',   
  dark: '#f3f4f6',     
  steel: '#f1f5f9',    
  fairy: '#fbcfe8',    
};

export default function App() {
  const [pokemons, setPokemons] = useState([]);
  const [offset, setOffset] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedPokemon, setSearchedPokemon] = useState(null);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchPokemons = async (currentOffset) => {
    setLoading(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${currentOffset}`);
      const data = await res.json();
      
      setPokemons(data.results);
      setOffset(currentOffset);
      
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } catch (err) {
      setError("Failed to load Pokémon list.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    fetchPokemons(offset + 20);
  };

  const handlePrevPage = () => {
    if (offset >= 20) {
      fetchPokemons(offset - 20);
    }
  };

  const fetchByType = async (type) => {
    setSelectedType(type);
    setSearchQuery(''); 
    setSearchedPokemon(null);
    setError('');
    
    if (type === 'all') {
      setPokemons([]);
      fetchPokemons(0);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      const data = await res.json();
      const typedPokemons = data.pokemon.map(p => p.pokemon);
      setPokemons(typedPokemons);
    } catch (err) {
      setError("Failed to fetch type data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons(0);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    
    if (!query) {
      setSearchedPokemon(null);
      setError('');
      return;
    }

    setLoading(true);
    setError('');
    setSelectedType('all'); 
    
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
      if (!res.ok) throw new Error('Pokémon not found!');
      const data = await res.json();
      setSearchedPokemon([{ name: data.name, url: `https://pokeapi.co/api/v2/pokemon/${data.id}/` }]);
    } catch (err) {
      setSearchedPokemon([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const displayList = searchedPokemon !== null ? searchedPokemon : pokemons;
  const isCurrentlySearching = loading && searchQuery !== '' && searchedPokemon === null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      <header className="bg-red-600 border-b-[12px] border-gray-900 pt-8 pb-10 px-6 relative z-20 shadow-md">
        <div className="max-w-7xl mx-auto relative flex flex-col items-center">
          
          <div className="absolute top-0 left-0 flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-500 border-4 border-white shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-gray-900 mt-1"></div>
            <div className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-gray-900 mt-1"></div>
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-gray-900 mt-1"></div>
          </div>

          <h1 
            className="text-5xl md:text-6xl font-black text-center tracking-widest mt-16 md:mt-4 mb-8 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => {
               setSearchQuery(''); setSearchedPokemon(null); setSelectedType('all'); fetchPokemons(0);
            }}
            style={{ 
              color: '#ffcb05', 
              WebkitTextStroke: '3px #111827', 
              textShadow: '5px 5px 0 #111827'  
            }}
          >
            Pokédex
          </h1>
          
          <div className="w-full max-w-xl px-4 z-30 mb-2">
            <form onSubmit={handleSearch} className="flex bg-white shadow-xl rounded-full overflow-hidden border-4 border-gray-900 focus-within:ring-4 focus-within:ring-red-400 transition-all">
              <div className="flex-1 flex items-center px-6">
                <svg className="w-6 h-6 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Search Pokémon..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-4 text-lg font-medium text-gray-800 focus:outline-none bg-transparent"
                />
              </div>
              <button 
                type="submit"
                className="bg-gray-900 text-white px-8 py-4 font-bold text-lg hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>
            
            {searchedPokemon && searchedPokemon.length > 0 && (
              <div className="flex justify-center mt-4">
                <button 
                  onClick={() => { setSearchQuery(''); setSearchedPokemon(null); setError(''); }}
                  className="bg-gray-200 text-gray-800 font-bold px-6 py-2 rounded-full border-2 border-gray-900 hover:bg-gray-300 transition-colors shadow-sm cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="absolute -bottom-[36px] left-1/2 transform -translate-x-1/2 w-[72px] h-[72px] bg-white border-[12px] border-gray-900 rounded-full z-20 flex items-center justify-center">
          <div className="w-[30px] h-[30px] bg-white border-[4px] border-gray-900 rounded-full"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        
        <div className="flex gap-3 overflow-x-auto py-4 mb-8 no-scrollbar scroll-smooth">
          {pokemonTypes.map((type) => {
            const isSelected = selectedType === type;
            const bgColor = typeColors[type] || typeColors.normal;

            return (
              <button
                key={type}
                onClick={() => fetchByType(type)}
                // Removed 'text-white' from the selected state here so we can control it in the style tag
                className={`px-5 py-2 rounded-full font-bold capitalize whitespace-nowrap border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'shadow-md scale-105'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-800'
                }`}
                style={
                  isSelected 
                    ? { 
                        // If 'all' is selected, make it black. Otherwise use the pastel color.
                        backgroundColor: type === 'all' ? '#111827' : bgColor, 
                        borderColor: type === 'all' ? '#111827' : bgColor,
                        // If 'all' is selected, use white text. Otherwise use dark text so it's readable on pastels.
                        color: type === 'all' ? '#ffffff' : '#111827'
                      } 
                    : {}
                }
              >
                {type}
              </button>
            );
          })}
        </div>

        {isCurrentlySearching || (loading && pokemons.length === 0) ? (
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 20 }).map((_, index) => (
              <PokemonSkeleton key={`skeleton-${index}`} />
            ))}
          </div>

        ) : !loading && searchedPokemon !== null && searchedPokemon.length === 0 ? (
          
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
            <img 
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png" 
              alt="Confused Psyduck" 
              className="w-56 h-56 drop-shadow-2xl hover:scale-105 transition-transform"
              style={{ animation: 'bounce 3s infinite' }}
            />
            <h2 className="text-4xl font-black text-gray-900 mt-8 mb-3">
              Wild Pokémon fled!
            </h2>
            <p className="text-gray-500 font-semibold text-lg max-w-md mb-8">
              We couldn't find any Pokémon matching "{searchQuery}". Try checking your spelling or use the type filters above!
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setSearchedPokemon(null); setError(''); }}
              className="bg-red-500 text-white px-10 py-4 rounded-full font-black text-lg border-4 border-gray-900 shadow-[0_6px_0_rgb(17,24,39)] hover:shadow-[0_2px_0_rgb(17,24,39)] hover:translate-y-1 transition-all cursor-pointer"
            >
              Clear Search
            </button>
          </div>

        ) : (
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {displayList.map((p) => {
              const id = p.url.split('/').filter(Boolean).pop();
              return (
                <PokemonCard 
                  key={id} 
                  pokemon={p} 
                  onClick={(id) => setSelectedId(id)} 
                />
              );
            })}
          </div>
        )}

        {searchedPokemon === null && selectedType === 'all' && displayList.length > 0 && !loading && (
          <div className="mt-16 flex justify-center items-center gap-4 sm:gap-8">
            <button
              onClick={handlePrevPage}
              disabled={offset === 0}
              className="bg-white text-gray-900 px-6 sm:px-8 py-3 rounded-full font-black text-sm sm:text-lg border-4 border-gray-900 shadow-[0_6px_0_rgb(17,24,39)] hover:shadow-[0_2px_0_rgb(17,24,39)] hover:translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[0_6px_0_rgb(17,24,39)] transition-all cursor-pointer"
            >
              &larr; PREV
            </button>
            
            <span className="font-black text-lg sm:text-xl text-gray-700 bg-gray-200 px-6 py-2 rounded-full border-2 border-gray-300">
              Page {Math.floor(offset / 20) + 1}
            </span>

            <button
              onClick={handleNextPage}
              className="bg-gray-900 text-white px-6 sm:px-8 py-3 rounded-full font-black text-sm sm:text-lg border-4 border-gray-900 shadow-[0_6px_0_rgb(0,0,0)] hover:shadow-[0_2px_0_rgb(0,0,0)] hover:translate-y-1 transition-all cursor-pointer"
            >
              NEXT &rarr;
            </button>
          </div>
        )}
      </main>

      {selectedId && (
        <PokemonModal 
          pokemonId={selectedId} 
          onClose={() => setSelectedId(null)} 
        />
      )}

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 border-[3px] border-gray-900 rounded-full shadow-2xl flex items-center justify-center z-40 hover:scale-110 hover:-translate-y-2 transition-all duration-300 cursor-pointer group overflow-hidden animate-fade-in"
        >
          <div className="absolute top-0 w-full h-1/2 bg-red-600"></div>
          <div className="absolute bottom-0 w-full h-1/2 bg-white"></div>
          <div className="absolute w-full h-[6px] bg-gray-900"></div>
          <div className="absolute w-5 h-5 bg-white border-[3px] border-gray-900 rounded-full shadow-inner group-hover:bg-gray-200 transition-colors"></div>
        </button>
      )}

    </div>
  );
}