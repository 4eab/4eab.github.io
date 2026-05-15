---
title: "goroutine"
date: "2026-05-15"
level: "Beginner"
---

> It is a form of 'lightweight thread' provided by the Go language.
> 
> **Process**: Think of it as an **entire factory**—it possesses independent resources but entails significant overhead.
> 
> **Thread**: Think of it as a **workshop** within that factory—it shares resources, **yet still incurs substantial overhead** (typically consuming upwards of 1MB of memory).
> 
> **Goroutine**: Think of it as a **worker** within that workshop. They are extremely lightweight, with a single worker occupying only a few kilobytes of memory. A single thread (workshop) can accommodate thousands—or even tens of thousands—of these workers (Goroutines) simultaneously.
> 
> When you write `go func()`, you aren't requesting a costly new workshop (thread); rather, you are simply **recruiting a new worker** to pitch in alongside you, allowing the main workflow to continue without having to pause and wait for them.

Source: Gemini

# Example

```go
func (r *Room) run() {
	fmt.Println("ROOM RUN STARTED")
	for {
		msg := <-r.broadcast
		fmt.Println("broadcast:", string(msg))
	}
}
```

A WebSocket service performs two primary tasks:

- Task A: Listening for new client connections (Accept).

- Task B: Continuously waiting for and broadcasting messages from client (Broadcast Loop).

---

If you do not offload Task B into a Goroutine:

- Execution reaches the line `msg := <-r.broadcast`. 
- Since no messages are currently available, the program halts and waits at this exact spot.

The Result: If a new user attempts to connect to your WebSocket service at this moment, the code responsible for handling new connections will never be reached, because the program remains "stuck" within Task B, waiting for a message.

---

However, once you launch a Goroutine via `go r.run()`, the situation changes:

- The Main Goroutine: Continues executing to handle incoming user WebSocket connections and perform the handshake process.

- The Background Goroutine: Quietly monitors the `r.broadcast` channel. The moment a message is sent, it instantly "wakes up" to handle the broadcast; once finished, it returns to its dormant state.



# Main Goroutine


When you launch a Go program, the Go Runtime automatically creates a Goroutine for you to execute your `main` function. We typically refer to this as the **Main Goroutine**.


> **Gemini**: You can visualize your program as a small shop that has just opened for business.
> 
> *   **Main Goroutine:** This is the "Boss." As soon as the program starts, the Boss personally takes up their post at the counter (executing the `main` function).
> *   **Other Goroutines (Child Goroutines):** These are the "employees" hired by the Boss. When you write `go someFunction()`, it is essentially the Boss hiring a new employee to go work in the back room.


## The lifecycle of a Go program is determined by the main goroutine.

If the "Boss" (the Main Goroutine) clocks out, all the "Employees" (child goroutines) must immediately drop whatever they are doing and leave with the Boss—regardless of whether their work is finished or not.

```go
func main() {
go func() {
fmt.Println("I am an employee; I am working hard...")
}()

fmt.Println("I am the boss; I'm clocking out.")
// The program ends right here!
}
```

*   **What actually happens:** The screen might only display "I am the boss; I'm clocking out," after which the program exits immediately.
*   **The reason:** The main goroutine executes its final line of code and then simply exits; it does not automatically wait for the background child goroutines to finish.

## `http.ListenAndServe(":8080", nil)`

Its operational logic is very much like that of an extremely dedicated security guard:

*   **Step 1:** Rush over to Gate No. 8080 (the port).
*   **Step 2:** Enter an infinite loop.
*   **Step 3:** Whenever someone knocks on the door (initiates a request), **immediately summon a new employee (create a new Goroutine)** to handle that person's specific needs.
*   **Step 4:** The security guard himself remains stationed at the main gate, waiting for the next person to arrive.

---

In a Go program, execution proceeds from top to bottom. Since `ListenAndServe` is a **blocking** function
- meaning it remains stationed at the gate indefinitely unless the server encounters an error or is manually shut down
- it **never completes execution**.

*If you place this line at the very beginning, the code following it will never be reached.*

By placing it at the very end, it acts as the program's "anchor," holding the main program in place to prevent it from terminating, while simultaneously allowing the background Goroutines to continue performing their tasks.

---

```go
func main() {
  // 1. Initialize resources (e.g., create a Hub)

  // 2. Hire a background employee: specifically tasked with distributing messages to everyone. 
  // This runs in the background within an infinite loop, waiting for r.broadcast events.
  go r.run()

  // 3. Register routes: instruct the security guard which function to call whenever someone accesses "/ws".
  http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
    serveWs(hub, w, r)
  })

  // 4. The "Boss" (the main process) personally stands guard at the main gate (blocking execution).
  // As long as this line does not return an error, the program remains alive and running.
  http.ListenAndServe(":8080", nil)
}
```

### Every client request has a Goroutine

For every client request, Go automatically creates a dedicated Goroutine to handle it.

If 10,000 people initiate requests simultaneously, there will indeed be 10,000 Goroutines running concurrently. 

The reason Go is so powerful is that Goroutines are extremely lightweight.
- Upon creation, a single Goroutine consumes only about 2KB of memory.
- Consequently, 10,000 concurrently running Goroutines occupy a total of just $10,000 \times 2\text{KB} = 20\text{MB}$ of memory—a negligible amount for modern computers.
