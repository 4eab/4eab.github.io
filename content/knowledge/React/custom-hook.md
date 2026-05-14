---
title: "Custom Hook"
date: "2026-05-13"
tags: ["Hook", "Basis"]
---

> React comes with several built-in Hooks like `useState`, `useContext`, and `useEffect`. 
> Sometimes, you’ll wish that there was a Hook for some more specific purpose. 
> You might not find these Hooks in React, but you can create your own Hooks for your application’s needs.

Source: https://react.dev/learn/reusing-logic-with-custom-hooks

# Hook

> You can imagine that, deep inside React, there lies a vast library of capabilities.
>
> Originally, functional components couldn't access this library.
>
> Consequently, React's functional components were much like a "static" photograph: whatever data you fed them, that is exactly what they would render—and once the rendering was complete, that was the end of it. 
>
> They couldn't store any internal state of their own, nor could they quietly perform background tasks after the rendering process finished.
>
> However, thanks to Hooks, you can now extend a "hook" from within your function to latch onto a specific internal React capability, effectively dragging it into your component for use.

---

- `useState`: Hooks into "Memory" (for storing data).
- `useRef`: Hooks into a "Locker" (for storing items—specifically, things you don't want React to notice have changed).
- `useCallback` / `useMemo`: Hooks into the "Brain" (for remembering complex results calculated previously, so you don't have to recalculate them every single time).
- `useEffect`: Hooks into an "Alarm Clock" (to tell React: "Once you're done rendering, remember to help me perform a specific task—such as calling an API or connecting to a device").

Source: Gemini

---


# Custom Hook

> A Custom Hook is, in essence, a "package of encapsulated logic" or an "assembly component" built from native Hooks.

**Native Hooks** are the basic building blocks.
**Custom Hooks** are what you create when you piece those basic blocks together.

> Of course, you *could* start building from the very basic blocks every single time you want to construct a vehicle. 
> 
> However, if you’ve already assembled an "engine" (`useEngine`), the next time you want to build a truck, a sports car, or an airplane—provided they require an engine—you can simply drop that pre-assembled "component" right in.

Source: Gemini

---

If you don't modularize your code, your component might look something like this:

```tsx
function MusicPlayer() {
  const [active, setActive] = useState(null);
  const [nodes, setNodes] = useState([]);
  const synth = useRef(null);
  const run = () => { /* 100 lines of complex code */ };

  return <button onClick={run}>Play {active}</button>;
}
```

Once assembled into a Custom Hook, your component becomes **clean**:

```tsx
function MusicPlayer() {
  const { active, runBFS } = useMusicEngine(nodes, links);

  return <button onClick={runBFS}>Play {active}</button>;
}

```

---

# The Key Point: A Custom Hook is still a "Native Hook"

> When you plug this assembled module into your component, every single native Hook contained within it still adheres to React's rules.

*   The `useState` calls inside your Custom Hook will still retain their state across component re-renders.
*   The `useEffect` calls inside your Custom Hook will still execute their side effects after the component mounts.

Therefore, **the essence of a Custom Hook is simply this:**

> **A logical function that encapsulates native Hooks.**

It allows you to **reuse logical units** in the same way you reuse UI units (components). This is one of the core reasons why React is such a powerful force in the front-end development landscape.

# Example: `useMusicEngine` in [My Project](https://github.com/4eab/graph-music-engine)

## States & Refs
```ts
const [active, setActive] = useState<string | null>(null); // the current active Music Note
const [queue, setQueue] = useState<string[]>([]);          // the waiting queue of Music Notes to be played
const [visited, setVisited] = useState<Set<string>>(new Set()); // the set of already played (visited) Music Notes

const synth = useRef<Tone.PolySynth | null>(null);         // holds a reference to the synthesizer instance (does not trigger a re-render)
const isRunning = useRef(false);                           // indicates whether the music engine is currently running
```
- `useState` is used to store data that needs to be reflected in the UI (for example, to highlight the current node on the screen).
- `useRef` is used to store data that does not need to trigger a re-render but needs to persist across rendering cycles (such as Tone.js audio objects).

## Core Mechanism 
```ts
const runBFS = useCallback(async () => {
    if (nodes.length === 0 || isRunning.current) return; 

    // Set Start Note

    isRunning.current = true;
    
    // Initialize Audio: 
    // Call `Tone.start()` to activate the browser's audio context
    // configure the Synthesizer (Synth), Filter, and Reverb.
    
    const q = [randomStartNode];
    const v: string[] = [];

    const process = () => {
      if (q.length === 0 || !isRunning.current) {
        setActive(null);
        isRunning.current = false;
        return;
      }

      // use BFS to play music in the grid map
      // ...
      const note = getGridNote(current, scaleName, rootNote);
      // ...

      setActive(current);
      setQueue([...q]);
      setVisited(new Set([...v])); 
 
      const nextTime = 700 + Math.random() * 400;
      setTimeout(process, nextTime);
    };

    process(); 
  }, [nodes, links, scaleName, rootNote]); // Determine note requires scale & root

```


## Reset & Return

```ts
const reset = useCallback(() => {
  isRunning.current = false;
  setActive(null);
  setQueue([]);
  setVisited(new Set());
}, []); 

// The hook returns an object to the component:
// Methods: 
// runBFS() to start, reset() to stop.
// Data: 
// active, queue, visited for UI highlighting.
return { runBFS, reset, active, queue, visited };
```