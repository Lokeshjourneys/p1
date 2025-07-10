import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';
import { useEffect } from 'react';

function App() {
  const [jokes, setJokes] = useState([]);

  useEffect(()=> {
    axios.get("/api/jokes")
      .then((response) => {
        setJokes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching jokes:", error);
      }
    );
  });
  return (
    <>
      <div>
        <h1>Welcome to the Joke App</h1>
        <p>JOKES: {jokes.length}</p>
      </div>

      {
        jokes.map((joke, index) => (
          <div key={index} className="joke">
            <p>{joke.joke}</p>
          </div>
        ))
      }
    </>
  )
}

export default App
