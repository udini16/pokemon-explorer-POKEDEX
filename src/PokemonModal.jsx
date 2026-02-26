import React, { useEffect, useState } from 'react';

// Light pastel colors for the modal background
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

// NEW: Bold, saturated colors specifically for the Type Pills!
const typeBadgeColors = {
  normal: '#A8A77A',   
  fire: '#EE8130',     
  water: '#6390F0',    
  electric: '#F7D02C', 
  grass: '#7AC74C',    
  ice: '#96D9D6',      
  fighting: '#C22E28', 
  poison: '#A33EA1',   
  ground: '#E2BF65',   
  flying: '#A98FF3',   
  psychic: '#F95587',  
  bug: '#A6B91A',      
  rock: '#B6A136',     
  ghost: '#735797',    
  dragon: '#6F35FC',   
  dark: '#705746',     
  steel: '#B7B7CE',    
  fairy: '#D685AD',    
};

const statColors = {
  hp: '#22c55e',             
  attack: '#ef4444',         
  defense: '#3b82f6',        
  'special-attack': '#a855f7', 
  'special-defense': '#f59e0b',
  speed: '#ec4899',          
};

export default function PokemonModal({ pokemonId, onClose }) {
  const [details, setDetails] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailsAndEvolutions = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const data = await res.json();
        setDetails(data);

        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
        const speciesData = await speciesRes.json();

        const evoRes = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoRes.json();

        const chain = [];
        let currentEvo = evoData.chain;

        while (currentEvo) {
          const id = currentEvo.species.url.split('/').filter(Boolean).pop();
          chain.push({
            name: currentEvo.species.name,
            id: id,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
          });
          currentEvo = currentEvo.evolves_to[0]; 
        }
        
        setEvolutionChain(chain);

      } catch (error) {
        console.error("Failed to fetch details or evolutions", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetailsAndEvolutions();
  }, [pokemonId]);

  const playCry = () => {
    if (details && details.cries && details.cries.latest) {
      const audio = new Audio(details.cries.latest);
      audio.volume = 0.3; 
      audio.play().catch(err => console.log("Audio failed to play:", err));
    }
  };

  if (!pokemonId) return null;

  const primaryType = details?.types[0]?.type?.name || 'normal';
  const modalColor = typeColors[primaryType] || typeColors.normal;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose} 
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl relative flex flex-col border-[12px] border-gray-900 bg-white [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-r-[28px] [&::-webkit-scrollbar-thumb]:bg-red-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-gray-100 hover:[&::-webkit-scrollbar-thumb]:bg-red-700 transition-colors"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-900/20 hover:bg-gray-900 text-gray-900 hover:text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-xl transition-all z-30 cursor-pointer"
        >
          ✕
        </button>

        {loading ? (
          <div className="p-12 text-center text-gray-600 font-bold h-64 flex items-center justify-center animate-pulse">
            Scanning Pokédex...
          </div>
        ) : (
          <>
            <div 
              className="relative pt-8 pb-10 px-6 border-b-[12px] border-gray-900 flex flex-col items-center z-10 shrink-0"
              style={{ backgroundColor: modalColor }} 
            >
              <div className="absolute -bottom-[42px] left-1/2 transform -translate-x-1/2 w-[72px] h-[72px] bg-white border-[12px] border-gray-900 rounded-full flex items-center justify-center z-20">
                <div className="w-[24px] h-[24px] border-[4px] border-gray-900 rounded-full bg-white shadow-inner"></div>
              </div>

              <div 
                className="relative cursor-pointer group" 
                onClick={playCry}
                title={`Click to hear ${details.name}!`}
              >
                <div className="absolute inset-0 bg-white/40 rounded-full scale-110 group-hover:scale-125 transition-transform duration-300"></div>
                
                <img 
                  src={details.sprites.other['official-artwork'].front_default} 
                  alt={details.name} 
                  className="w-48 h-48 object-contain relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              <h2 className="text-4xl font-black capitalize mt-4 text-gray-900 tracking-tight">
                {details.name}
              </h2>
              
              {/* UPDATED: Type Pills now use the dynamic typeBadgeColors! */}
              <div className="flex gap-2 mt-3 mb-2">
                {details.types.map((t) => (
                  <span 
                    key={t.type.name} 
                    className="px-4 py-1.5 text-white shadow-sm rounded-full text-sm font-bold capitalize drop-shadow-sm"
                    style={{ backgroundColor: typeBadgeColors[t.type.name] || '#374151' }}
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white px-6 lg:px-12 pt-16 pb-12 z-0">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-black text-gray-900 mb-4 text-xl border-b-4 border-gray-200 pb-2">Abilities</h3>
                    <ul className="text-base text-gray-700 space-y-3 font-semibold">
                      {details.abilities.map((a) => (
                        <li key={a.ability.name} className="capitalize flex items-start gap-3">
                          <span className="w-2.5 h-2.5 mt-1.5 bg-gray-900 rounded-full shrink-0"></span>
                          <span>
                            {a.ability.name.replace('-', ' ')} 
                            {a.is_hidden && <span className="text-sm text-gray-400 italic block mt-0.5"> (Hidden)</span>}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-black text-gray-900 mb-4 text-xl border-b-4 border-gray-200 pb-2">Base Stats</h3>
                    <div className="space-y-4 text-sm">
                      {details.stats.map((s) => {
                        const statName = s.stat.name;
                        const barColor = statColors[statName] || '#9ca3af'; 

                        return (
                          <div key={statName}>
                            <div className="flex justify-between capitalize text-gray-800 text-sm font-bold mb-1.5">
                              <span>{statName.replace('special-', 'Sp. ')}</span>
                              <span>{s.base_stat}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden border border-gray-300">
                              <div 
                                className="h-full rounded-full transition-all duration-1000 ease-out" 
                                style={{ 
                                  width: `${Math.min(s.base_stat, 100)}%`, 
                                  backgroundColor: barColor 
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {evolutionChain.length > 1 && (
                  <div className="flex-1 border-t-4 lg:border-t-0 lg:border-l-4 border-gray-100 pt-8 lg:pt-0 lg:pl-10 flex flex-col justify-center">
                    <h3 className="font-black text-gray-900 mb-6 text-xl text-center lg:text-left border-b-4 lg:border-b-0 border-gray-200 lg:border-transparent pb-2 lg:pb-0">
                      Evolution Chain
                    </h3>
                    
                    <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-4 flex-nowrap pb-4">
                      {evolutionChain.map((evo, index) => (
                        <React.Fragment key={evo.id}>
                          
                          <div className="flex flex-col items-center">
                            <div className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-[3px] flex items-center justify-center p-2 shadow-sm transition-transform hover:scale-110 cursor-pointer ${evo.name === details.name ? 'bg-gray-900 border-gray-900 scale-110' : 'bg-gray-50 border-gray-200 hover:border-gray-400'}`}>
                              <img src={evo.image} alt={evo.name} className="w-full h-full object-contain drop-shadow-sm" />
                            </div>
                            <span className={`text-xs sm:text-sm lg:text-base font-bold capitalize mt-3 ${evo.name === details.name ? 'text-gray-900' : 'text-gray-500'}`}>
                              {evo.name}
                            </span>
                          </div>

                          {index < evolutionChain.length - 1 && (
                            <div className="text-gray-300 font-black text-xl sm:text-2xl lg:text-3xl mb-8">
                              &rarr;
                            </div>
                          )}
                          
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}