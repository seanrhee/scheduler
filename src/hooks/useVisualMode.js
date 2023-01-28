import { useState } from "react";

export default function useVisualMode(initial) {

  const [history, setHistory] = useState([initial])

  function transition(nextMode, replace = false) {
    console.log("state", history)
    if (replace) {
      setHistory((prev) => [...prev.slice(0, prev.length - 1), nextMode])
    }
    else {
      setHistory((prev) => [...prev, nextMode])
    }
  }

  function back() {
    console.log("state", history)
    setHistory((prev) => {
      if (prev.length <= 1) {
        return prev;
      }
      return [...prev.slice(0, prev.length - 1)]
    })
  }

  return { mode: history[history.length - 1], transition, back };
}