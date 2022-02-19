import React, { useState, useEffect } from 'react';
import Navbar from './BarraNav';
import Card from './Card';
import { getPokemon, getAllPokemon } from './pokemon';
import './App.css';

function App() {
  const [pokemonData, setPokemonData] = useState([])
  const [nextUrl, setNextUrl] = useState('');
  const [prevUrl, setPrevUrl] = useState('');
  const [carregando, setcarregando] = useState(true);
  const initialURL = 'https://pokeapi.co/api/v2/pokemon'

  useEffect(() => {
    async function fetchData() {
      let response = await getAllPokemon(initialURL)
      setNextUrl(response.next);
      setPrevUrl(response.previous);
      await loadPokemon(response.results);
      setcarregando(false);
    }
    fetchData();
  }, [])

  const next = async () => {
    setcarregando(true);
    let data = await getAllPokemon(nextUrl);
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setcarregando(false);
  }

  const prev = async () => {
    if (!prevUrl) return;
    setcarregando(true);
    let data = await getAllPokemon(prevUrl);
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setcarregando(false);
  }

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(data.map(async pokemon => {
      let pokemonRecord = await getPokemon(pokemon)
      return pokemonRecord
    }))
    setPokemonData(_pokemonData);
  }

  return (
    <>
      <Navbar />
      <div>
        {carregando ? <h1 style={{ textAlign: 'center' }}>carregando...</h1> : (
          <>
            <div className="btn">
              <button onClick={prev}>Voltar</button>
              <button onClick={next}>Prox</button>
            </div>
            <div className="grid-container">
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon} />
              })}
            </div>
            <div className="btn">
              <button onClick={prev}>Voltar</button>
              <button onClick={next}>Prox</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;