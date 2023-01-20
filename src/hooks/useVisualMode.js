import { useState } from 'react'

export default function useVisualMode(initial) {
  let [history, setHistory] = useState([initial]); 

    //transition function
    function transition(currentMode, newMode = false) {
      if (newMode) {
        setHistory(prev => {
          return [...prev.slice(0, prev.length-1), currentMode]
        })
      }
      else {
        setHistory(prev => [...prev, currentMode])
      }
      // setHistory(prev => newMode ? [...prev.slice(0, -1), currentMode] : [...prev, currentMode]     );
    }

    //back function
    function back() {
      setHistory(prev => {  
        if (prev.length <= 1) {
          return prev;
        }
        return [...prev.slice(0, prev.length-1)]
      })
      // setHistory(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
    }

  return { mode: history[history.length-1], transition, back };
}