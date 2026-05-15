---
title: "make and nil"
date: "2026-05-15"
level: "Beginner"
tags: ["Channel", "Map"]
---

<GoChannelTrapDemo />

# Zero Value

When a variable is declared but not explicitly initialized, Go automatically zeros out its memory:

Go allocates space in memory for the struct and, in accordance with the rules for each field's type, populates all of them with their respective "Zero Values."

```go
type Client struct {
  conn *websocket.Conn
  username string
}

var client = Client{}
```

- `conn`: This is `nil`. If you were to call `client.conn.WriteMessage(...)` at this point, the program would immediately crash.
- `username`: This is an empty string (`""`); it is *not* `nil` (Go strings can never be `nil`) and has a length of 0. Even if you haven't assigned a value to it, calling `fmt.Println(client.username)` will not cause a crash.


Simply put: **Go's "Zero Value" does not imply that the variable is "ready for use."**


# `nil` and `make`

For types such as `map` and `channel` (as well as `slice`), their zero value is `nil`.


## Why `make`?

In Go, `make` is specifically designed to allocate memory and initialize the internal structures for **slices, maps, and channels**.

### Map

In Go, you can read data from a `nil` map (which returns the zero value), but you **absolutely cannot write to it**. If you attempt `room.clients[c] = true` without first calling `make`, the program will immediately crash.


> Image you are holding nothing more than a shipping tracking number (the variable name); however, the actual cardboard box (the memory space) corresponding to that number has not yet been manufactured.
>
> Why doesn't reading cause a crash? Go is quite forgiving; when it sees you holding the tracking number and asking, "Is there anything inside?", it checks, discovers that the box doesn't exist, and simply tells you: "There is nothing inside" (by returning the zero value).
>
> Why does writing cause a crash? You are attempting to stuff something into the box, but the box itself does not exist; since you are trying to insert data into thin air, the system has no choice but to trigger a Panic.

**After calling `make`**: It creates a hash table structure in memory, at which point you can safely store data within it.

### Channel

In Go, **sending to or receiving from a `nil` channel will block forever.**

> Imagine a 'Complaint Processing' sign, yet there is absolutely no clerk present in the service hall to staff it.
>
> The Sender (`chan <- msg`): You are holding a document (data); you see the "Complaint Processing" sign, so you stand there waiting for a clerk to take it from you. You remain standing there, holding the document aloft, until the end of time. This is blocking.
>
> The Receiver (`<-chan`): You are sitting on a bench, waiting for the window to call your number so you can collect your results. Similarly, the window never buzzes, and no one ever hands anything out. You simply sit there and wait—indefinitely.

---

After `make`:

- Unbuffered Channel (`make(chan string)`):
  - The "window" is very narrow, with no "shelf" available to place files.
  - The sender must hand the file directly into the receiver's hands. 
  - If the receiver has not yet arrived, the sender must stand at the window holding the file and wait; conversely, if the sender has not yet arrived, the receiver must sit at the window and wait. 
  - This is known as *synchronous blocking*.

- Buffered Channel (`make(chan string, 10)`):
  - Next to the "window", there is an added "shelf" capable of holding up to 10 files. 
  - The sender can simply place a file on the "shelf" and leave, provided the shelf is not full; the receiver can retrieve a file from the "shelf" whenever one is available, without needing to wait for the sender in person.

## Why doesn't `sync.Mutex` require initialization?

```go
var room = Room{
  clients:   make(map[*Client]bool),
  broadcast: make(chan string),
  // mu?
}
```
This is because `sync.Mutex` is designed to be "zero-value usable." 

Its internal structure, when all fields are set to `0`, represents the "unlocked" state. 

Therefore, you do not need to—nor can you—use `make` to initialize it.