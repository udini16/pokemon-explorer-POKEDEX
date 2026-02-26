import React, { useEffect, useState } from 'react';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const data = await res.json();
        setDetails(data);
      } catch (error) {
        console.error("Failed to fetch details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
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
        className="w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl relative flex flex-col border-[12px] border-gray-900 bg-white"
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
              className="relative pt-8 pb-10 px-6 border-b-[12px] border-gray-900 flex flex-col items-center z-10"
              style={{ backgroundColor: modalColor }} 
            >
              <div className="absolute -bottom-[42px] left-1/2 transform -translate-x-1/2 w-[72px] h-[72px] bg-white border-[12px] border-gray-900 rounded-full flex items-center justify-center z-20">
                <div className="w-[24px] h-[24px] border-[4px] border-gray-900 rounded-full bg-white shadow-inner"></div>
              </div>

              {/* UPDATED: Image Container. Kept the group hover for a clean scale effect. */}
              <div 
                className="relative cursor-pointer group" 
                onClick={playCry}
                title={`Click to hear ${details.name}!`}
              >
                <div className="absolute inset-0 bg-white/40 rounded-full scale-110 group-hover:scale-125 transition-transform duration-300"></div>
                
                {/* REMOVED: animate-spin-slow-3d and perspective-1000. It now stands clean and static. */}
                <img 
                  src={details.sprites.other['official-artwork'].front_default} 
                  alt={details.name} 
                  className="w-48 h-48 object-contain relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              <h2 className="text-4xl font-black capitalize mt-4 text-gray-900 tracking-tight">
                {details.name}
              </h2>
              
              <div className="flex gap-2 mt-3 mb-2">
                {details.types.map((t) => (
                  <span 
                    key={t.type.name} 
                    className="px-4 py-1.5 bg-gray-900 text-white shadow-sm rounded-full text-sm font-bold capitalize"
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white px-6 pt-16 pb-8 z-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div>
                  <h3 className="font-black text-gray-900 mb-3 text-lg border-b-4 border-gray-200 pb-1">Abilities</h3>
                  <ul className="text-sm text-gray-700 space-y-2 font-semibold">
                    {details.abilities.map((a) => (
                      <li key={a.ability.name} className="capitalize flex items-start gap-2">
                        <span className="w-2 h-2 mt-1.5 bg-gray-900 rounded-full shrink-0"></span>
                        <span>
                          {a.ability.name.replace('-', ' ')} 
                          {a.is_hidden && <span className="text-xs text-gray-400 italic block"> (Hidden)</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-black text-gray-900 mb-3 text-lg border-b-4 border-gray-200 pb-1">Base Stats</h3>
                  <div className="space-y-3 text-sm">
                    {details.stats.map((s) => {
                      const statName = s.stat.name;
                      const barColor = statColors[statName] || '#9ca3af'; 

                      return (
                        <div key={statName}>
                          <div className="flex justify-between capitalize text-gray-800 text-xs font-bold mb-1">
                            <span>{statName.replace('special-', 'Sp. ')}</span>
                            <span>{s.base_stat}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden border border-gray-300">
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}