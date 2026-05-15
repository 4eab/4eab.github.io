---
title: "struct"
date: "2026-05-15"
level: "Beginner with Java experience"
---

In Object-Oriented Programming (OOP), objects consist of **attributes** and **behaviors**. 

Go implements this in the same way:
- **Attributes:** Defined within the curly braces of a `struct`.
- **Behaviors:** Bound to the `struct` via **Receiver Functions**.

```go
type Room struct {
    Name string
}

func (r Room) SayHello() {
    fmt.Println("Welcome to", r.Name)
}
```

# V.S. `class` in Java

## `class A extends B` ✖️

If you want to reuse code, you would embed one struct inside another:
- Treat a struct **directly** as a field of another struct, **without assigning it a name**.

```go
type BaseRoom struct {
    Name     string
    Capacity int
}

func (b BaseRoom) ShowInfo() {
    fmt.Printf("Name: %s, Capacity: %d\n", b.Name, b.Capacity)
}

type StudyRoom struct {
    BaseRoom      // <--- 
    IsQuiet  bool
    Subject  string
}
```

When you embed `BaseRoom` into `StudyRoom`, `StudyRoom` automatically "inherits" all of `BaseRoom`'s members and methods.

You can access them directly, just as if they belonged to `StudyRoom`:

```go
func main() {
    sr := StudyRoom{
        BaseRoom: BaseRoom{Name: "201", Capacity: 50},
        IsQuiet:  true,
    }

    // You can access `Name` directly; you do not need to write `sr BaseRoom.Name`.
    fmt.Println(sr.Name) 

    // You can directly call the methods of BaseRoom.
    sr.ShowInfo() 
}
```

This method of "embedding" is highly flexible: Go's embedding encourages you to assemble functionality piece by piece, much like building with blocks.

- **Multiple Combinations**: You can embed multiple distinct structs within a single struct.

- **Avoiding Deep Nesting**: Java's inheritance chains can sometimes become extremely deep, rendering the code incredibly difficult to maintain. 

## It is a Value Type 

> Defaults to "Copying," Not "Referencing"

- **Java:** When you assign an object to another variable, both variables point to the **exact same entity**.

- **Go:** When you assign a `struct` to a new variable, it performs a **complete copy** by default. 
  - If you wish to modify the original instance, you must use a **pointer** (`*Room`).


# Attributes

- Starts with an uppercase letter (Exported): Equivalent to `public`. This means that other "packages" can directly access and modify this field.

- Starts with a lowercase letter (Unexported): Equivalent to `private`. This means that this field can only be used internally within the current package.

```go
type Room struct {
  Users map[string]bool

  mu sync.Mutex
}
```

## Go struct fields do not support specifying default values ​​directly at the time of definition!

### Factory Function

```go
func NewClient(conn *websocket.Conn) *Client {
    return &Client{
        conn:     conn,
        username: "anonymous",
    }
}
```

---

### Utilizing the "zero value"

```go
type Client struct {
    conn     *websocket.Conn
    username string 
}

func (c *Client) GetName() string {
    if c.username == "" {
        return "anonymous"
    }
    return c.username
}
```

---

```go
type Client struct {
    conn     *websocket.Conn
    username string
}

func NewClient(conn *websocket.Conn, name string) *Client {
    c := &Client{conn: conn}
    if name == "" {
        c.username = "anonymous"
    } else {
        c.username = name
    }
    return c
}
```

### Using `Config`

When your `Client` has dozens of configuration options, people typically use a `Config` struct to pass parameters:

```go
type ClientConfig struct {
    Username string
    MaxWait  time.Duration
    // ...
}

type Client struct {
	conn     *MockConn
	config   ClientConfig // <-- It is a struct, not a pointer
	isClosed bool
}

func NewClient(conn *websocket.Conn, cfg ClientConfig) *Client {
    if cfg.Username == "" {
        cfg.Username = "anonymous"
    }
    // ... 
    return &Client{
      conn:   conn,
      config: cfg, // A separate set of data. Possesses its own independent memory.
    }
}
```


# Instantiation

```go
var room = Room{
	Users: make(map[string]bool),
}
```
- `make` is a built-in Go function specifically designed to allocate memory and initialize the internal structures **for maps, slices, and channels.**


## Factory Function
```go
func NewRoom(name string) *Room {
    return &Room{
        Users: make(map[string]bool),
    }
}

myRoom := NewRoom("A")
```

### `*Room`: pointer

Let's break down the process for `func NewRoom() Room` (without the `*`):

1. **Inside the function:** Go allocates a block of memory for the `Room` (let's call it A).
2. **Upon preparing to return:** Go allocates another block of memory of the exact same size *outside* the function (at the caller's location)—let's call this one B.
3. **Performing the copy:** Go copies all the data contained in A verbatim into B.
4. **Destroying local variables:** The function concludes, and the original block A ceases to exist.

---

Do you remember `sync.Mutex`? 

It is a struct that internally tracks the state of the lock (e.g., "0" signifies unlocked, "1" signifies locked).

*   Suppose the lock within a `Room` is currently in a **locked state** (with a value of 1).
*   If you create a copy of this `Room`, the lock within the new copy will also be **1**.
*   But here is the crucial point: **these two locks are no longer the same lock!**

```go
func main() {
  r1 := NewRoom("default")

  // If you inadvertently make another assignment:
  r2 := r1

  // At this point, the lock within r1 and the lock within r2 are two independent locks! 
  // You now hold two locks that look identical, yet they do not guard the same door. 
}
```

---

Other Problem: If you were to later add 20 more fields to your `Room` struct (e.g., a description, rules, coordinates, announcements, etc.), every single return operation would trigger a massive "memory relocation."

Returning `*Room`: Regardless of how large the struct becomes, what is returned is always a single 8-byte address (on a 64-bit system).

---

When you return a `*Room`:

1. **Inside the function:** Go creates the `Room` (Entity A).
2. **Upon return:** Go merely copies **A's memory address** (much like a small slip of paper bearing a home address—typically just 8 bytes).
3. **Upon receipt:** The caller receives this address and follows it directly to manipulate that *single, unique* Entity A.

**There is no cumbersome data shuffling, no loss of state—everyone operates on the exact same entity.**


### `return &Room{...}`: Get address
  - `Room{...}`: Create a room.
  - `&`: Retrieve the address of the room that was just created.


- Escape Analysis
> If you have studied C++, you might exclaim:
> 
>   How is this possible? When a function ends, aren't local variables destroyed? Returning the address of a local variable would result in a dangling pointer!
>
> 
> The Go compiler is smart:
> 
> when it detects that you have created an object inside a function and intend to return its address for external use, 
> it automatically allocates that object on the **Heap** rather than on the Stack. 
> 
> This means that even after the function has finished executing, the object remains alive until it is no longer referenced by anything.


# Variable Declaration

> Go's design aims to strike a balance between **rigor** (global variables must be explicit) and **development efficiency** (the logic within functions should be as concise as possible).

## `var`

```go
var room = Room{ ... }
```
- It can be placed *outside a function* (as a global or package-level variable), or *inside* a function.

- **Zero-Value Property:** If you write `var room Room` (without assigning a value), Go will automatically initialize it to its zero value.



## `:=` 

```go
myRoom := NewRoom("A")
```

**It can only be used inside a function body.** You cannot use `:=` outside of a function.
- Automatically inferring the type:
  - It effectively combines two steps into one: `var myRoom *Room` + `myRoom = NewRoom(...)`. 
  - When the Go compiler sees that `NewRoom` returns a `*Room`, it automatically assigns the pointer type to `myRoom`.

---


## Scenario A: You define a global singleton (package-level).

If you want the entire package to have direct access to this room, you would place it outside of any functions:

```go
package main

var globalRoom = Room{
    Users: make(map[string]bool),
}

func main() {
    // directly use globalRoom
}
```

## Scenario B: Dynamic Creation During Runtime (Function Level)

If you are temporarily creating a room within a specific function (for instance, one that handles a user's request to set up a room):

```go
func handleCreateRoom() {
    localRoom := NewRoom("A")
}
```
