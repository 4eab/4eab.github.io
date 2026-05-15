---
title: "Upgrader"
date: "2026-05-15"
tags: ["WebSocket", "gorilla"]
level: "Beginner"
---

# A Story Written by Gemini

In this story, your **server** is an office building, and the **browser** is a student looking to rent a space.

## The Building's "Rules"

This building (the server) has one strict rule: **All visitors must enter through the main entrance (the HTTP port), and once they have finished their business, they must leave immediately.**

Standing at the building's entrance is a **security guard (the HTTP engine built into Go)**.

## The Student's "Disguise"

The student (the browser) wants to enter the building to rent a "permanent seat"—essentially setting up a private study space. 

However, he knows that if he were to tell the security guard directly that he intends to stay long-term, the guard would kick him out in accordance with the building's rules.

So, the student pretends to be a regular visitor and hands the security guard an **application form (an HTTP GET request)**.

*   The application form reads: "I am here to conduct some business, but I would also like to speak with the **House Manager (the Upgrader)** regarding **upgrading to a long-term rental agreement**."
*   Affixed to the application form is a **randomly generated security barcode (the `Sec-WebSocket-Key`)**.

## The House Manager (Upgrader) Appears—and the Secret Handshake

Upon seeing the word "upgrade," the security guard (the HTTP engine) hesitates to handle the matter on his own and calls over the **House Manager (the Upgrader)**.

The House Manager takes the application form and proceeds to perform two tasks:

1.  **Verifying the Secret Handshake (Matching the Codes):**
The House Manager pulls out a specialized device and scans the **barcode (the Key)** on the application form. The device generates a **verification receipt code (the `Accept-Key`)**. 
*   This code serves as proof: "I am indeed the building's legitimate House Manager, and I understand the secret code you are using to request a rental."

2.  **Providing a Formal Acknowledgment to the Guard:**
- This is often the most confusing part. 
- **The House Manager *must* affix the "verification receipt code" to the final page of the application form and hand it back to the security guard.**
- **The Reason:** 
  - The security guard holds the building's "remote control for the main gate." 
  - If the House Manager fails to complete this formal procedure, the guard will deem the visit illegitimate and immediately press the button to lock the main gate. 
  - So, the House Manager instructed the security guard to hand the student this final "Entry Permit Receipt" (a 101 Response).

## The Great Switcheroo (Connection Hijacking)

In the **very second** the security guard dispatched that "receipt," the House Manager executed a stunning maneuver:

* Before the guard even had a chance to press the "Close Door/Dismiss Visitor" button, the House Manager whipped out a **specialized lock (Hijack)** and **jammed** the door wide open!
* The House Manager turned to the guard and said: "This door has now been hijacked by me. From this moment on, it is no longer a general 'entrance/exit,' but rather this student's own 'exclusive private passage.' You are relieved of your duties; this door is now under my sole supervision."

## The Door Opens

Outside the door, the student received the receipt and spotted the secret code, thinking to themselves: "The code matches—the House Manager has successfully jammed the door open!"

And so, the student carried their desk (the data) into the room. From that moment on:

* The **Security Guard (HTTP) departed** to attend to the next visitor.
* The **House Manager (Upgrader) remained behind**, transforming the doorway into a **`conn` (WebSocket Connection)**.
* This door would never automatically close again; voices could be sent out from the inside at any time, and messages could be sent in from the outside just as freely.

---

**What exactly does the line of code `upgrader.Upgrade` represent?**

It encapsulates the precise sequence of actions the "House Manager" executes in that instant: the combined set of these three tasks—**"verifying the secret code," "using the Security Guard to issue an acknowledgment receipt," and "whipping out a special lock-card to secure the door."**


```go
func wsHandler(w http.ResponseWriter, r *http.Request) {
  // The variable `conn` now represents that "door" that has just been hijacked.
  conn, err := upgrader.Upgrade(w, r, nil)

  if err != nil {
    return // Hijack failed; proceed with standard HTTP error handling.
  }

  // From this point onward, the `conn` object you hold in your hands is no longer a standard HTTP connection; 
  // instead, it is a WebSocket—a persistent channel capable of maintaining a continuous conversation!
}
```


# `CheckOrigin`

```go
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}
```

By default—if you do not explicitly define a `CheckOrigin` function—browsers will block **cross-origin connections** for security reasons.

- If your frontend code is running on `localhost:3000` while your backend is on `localhost:8080`, the connection will be immediately rejected, resulting in a `403 Forbidden` error.

By writing `return true`, you are essentially telling the server: "No matter who attempts to connect, I trust them." This approach is highly convenient during the development phase.


# Ctrl+C/V? The advices from Gemini

During the development phase, it is perfectly fine to simply copy and paste this code snippet as a starting point.

However, when you are ready to launch your "study room" for use by real users, you will need to make a few minor tweaks to this template:

## Security Hardening (Origin Check)
In a production environment, you certainly wouldn't want just any malicious website to be able to connect to your server via JavaScript. You will need to replace `return true` with a domain validation check:

```go
CheckOrigin: func(r *http.Request) bool {
  return r.Header.Get("Origin") == "https://www.your-domain.com"
},
```
## Performance Tuning (Buffer Settings)

Continuing the story from above: once the "manager" (the Upgrader) has successfully opened the door, the students (browsers) and the study room (server) begin exchanging items—that is, sending and receiving messages.

However, network transmission speeds have their limits. If someone suddenly shouts something aloud (broadcasting a message), the manager must package that message and send it to all 1,000 students currently seated there. 

No matter how fast the manager moves, it is impossible to instantly stuff 1,000 copies of the message into each student's dedicated channel simultaneously. This is where "buffers" come into play.

---

If you do not explicitly specify `ReadBufferSize` and `WriteBufferSize`, the Gorilla library will, by default, allocate a **4096-byte (4KB)** "sending shelf" and a 4KB "receiving box" for each individual connection.

*   **For small-scale operations:** 4KB is okay.
*   **For large-scale operations (Memory Optimization):**
Suppose you have 10,000 students online simultaneously. Each connection, by default, consumes 4KB + 4KB = 8KB of memory. 
These shelves and boxes alone will rigidly occupy $10,000 \times 8\text{KB} = 80\text{MB}$ of your system's memory—and this figure doesn't even account for the actual content of the messages themselves. 
If the students in your study hall are merely exchanging short text snippets—such as "Check-in" or "Like"—that amount to only a few dozen bytes each, then a 4KB sending shelf is a massive waste of resources.

```go
var upgrader = websocket.Upgrader{
ReadBufferSize:  1024, // Shorten the shelf
WriteBufferSize: 1024, // Shrink the box
}
```

The manager has now reduced the storage for each connection down to 1KB + 1KB. Consequently, those 10,000 users now require only 20MB of memory.


# There is only one Upgrader

It is a shared utility.

## If everyone tries to grab it simultaneously, why doesn't it block?

Because the `upgrader` contains no "exclusive locks."

In code, whether or not an operation blocks depends on whether the internal mechanisms of a tool or object utilize locking primitives (such as `sync.Mutex`).

---

The `upgrader` functions merely as a "pure collection of utility functions." 

The declaration `var upgrader = websocket.Upgrader{...}` simply stores a "construction blueprint and configuration panel" in memory.

> A more accurate metaphor: It is not a "person," but rather a "fully automated, pre-printed instruction manual."
> 
> Goroutine 1 enters with Student A. It glances at the instruction manual (the `upgrader`) posted on the wall, which reads: `ReadBufferSize: 1024`.
> 
> Goroutine 1 says: "Got it!" It then pulls out its own tools and, following the specified dimension of 1024, constructs a "room" for Student A.
> 
> At that very same split-second—one ten-thousandth of a second later—Goroutine 2 enters with Student B. It, too, glances at that *same* instruction manual (the `upgrader`) on the wall.
> 
> Goroutine 2 says: "Got it, I know what to do!" It then pulls out its own tools and, following the specified dimension of 1024, constructs a "room" for Student B.
> 
> The entities actually performing the work—the ones doing the heavy lifting—are those countless, concurrent Goroutines themselves! The `upgrader` variable is merely a "blueprint" hanging on the wall. Each person can simply glance at the blueprint and then proceed to carry out their work independently within their own dedicated memory space.

---

## At the low-level computer hardware layer

The `upgrader` variable stores only a few pieces of static data: `1024` (the buffer size) and `true` (indicating that cross-origin requests are permitted). It functions essentially like a constant.

When you invoke `upgrader.Upgrade(w, r, nil)` from within various distinct Goroutines, the CPU simply jumps to that shared, read-only region of executable code to perform the necessary computations.

Any temporary data generated during this computation—such as a calculated handshake token or a newly established connection object (`conn`)—is stored entirely within the independent memory space (the stack) allocated to that specific Goroutine.

Because each Goroutine utilizes its own dedicated memory and does not contend with others for any shared resources, these computations execute in true *parallel* fashion, requiring absolutely no queuing.
