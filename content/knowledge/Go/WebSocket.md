---
title: "WebSocket"
date: "2026-05-15"
level: "Beginner who only knows HTTP"
---

# Why WebSocket

## HTTP

```go
// Join the room
func joinHandler(w http.ResponseWriter, r *http.Request) {
	user := r.URL.Query().Get("user")

	room.mu.Lock()
	room.Users[user] = true
	room.mu.Unlock()

	w.Write([]byte("joined: " + user))
}

// View Room Status
func statusHandler(w http.ResponseWriter, r *http.Request) {
	room.mu.Lock()
	defer room.mu.Unlock()

	json.NewEncoder(w).Encode(room.Users)
}
```
When you access a URL API, you are utilizing the HTTP protocol.


Characteristics:
- Short-lived Connections: The connection is terminated immediately once the task is completed.
- Unidirectional: **Only the client** can initiate the conversation.
- High Overhead: Each time you "write" to the server, you must affix a stamp and address the envelope (as HTTP requests involve a significant amount of header information).

---

- Server Load: Frequent connection opening and closing results in a heavy load

- Common Scenarios: Web browsing, form submission, reading articles 


## WebSocket: Establishes a bidirectional, persistent connection.

Process: 
- The client first sends an HTTP request essentially asking, "Shall we hop on a call?"
-  Once the server agrees, this connection is **"upgraded"** to a WebSocket. 
-  From that moment on, this "phone line" remains continuously connected.

---

Key Features:
- Persistent Connection: As long as neither party hangs up, the connection remains active.
- Bidirectionality: The client can send messages to the server, and the server can—at any time—tap the client on the shoulder and say, "Hey, someone just walked into the study room."
- Lightweight: Once the connection is established, sending messages no longer requires attaching cumbersome address information, resulting in minimal overhead.

---

- Server Load: Maintaining long connections **consumes memory** but offers high transmission efficiency

- Common Scenarios: Real-time study rooms, stock market feeds, online chat, multiplayer gaming

---

> Imagine how you would build a study room feature using traditional APIs—without the aid of WebSockets:
> 
> The HTTP Approach: Your mobile device would have to ping the server every single second, asking: "Has A entered?" "Has A changed seats?" "Has A turned off the lights?"
> 
> If no one actually enters, these once-a-second inquiries are nothing but pointless chatter—an extreme waste of both data bandwidth and battery power.
> 
> Alternatively, if you configure it to check only once every five seconds, you wouldn't even realize A had entered until four seconds after the fact—making the whole experience feel incredibly "laggy."
> 
> The WebSocket Approach: You enter the study room and establish a WebSocket connection.
> 
> You can then study in peace, without sending a single byte of data yourself.
> 
> The moment A enters, the server immediately pushes a notification directly to your phone via that dedicated "phone line": "A has come online."
Source: Gemini

## WebTransport & WebRTC

> If you are seeking the "cutting edge," WebTransport is the successor to WebSocket that is expected to mature gradually between 2024 and 2026.
> 
> It is built upon QUIC (HTTP/3). Compared to WebSocket (which is based on TCP), it resolves the "Head-of-Line Blocking" problem. 
> 
> If a single data packet is lost, WebSocket will stall the delivery of all subsequent data; WebTransport, however, does not.


> If your virtual study room application involves real-time audio/video calls, video surveillance, or screen sharing with extremely low latency, then WebSocket will simply not suffice.
> 
> WebRTC operates over UDP and supports P2P (peer-to-peer) transmission, typically achieving latency within 100ms.
> 
> Pion/WebRTC is currently the world's leading Go implementation of WebRTC, and it has even been adopted by numerous major tech companies. Its development complexity is an order of magnitude higher than that of WebSocket.

# How to Construct

```text
client → websocket → server → room → broadcast → all clients
```

## Gemini's suggestions based on my first MVP
> In actual development, to ensure this pipeline can withstand high concurrency, remain stable, and deliver a seamless user experience, we need to bolster every stage with certain **critical "infrastructure" components**.

### Hub for the Server

In Go, you cannot simply handle connections in isolation. You need a singleton or a struct (typically named `Hub` or `Manager`) to manage thousands of concurrent connections.

*   **Register:** When a user joins, store their connection within a Map.
*   **Unregister:** When a user disconnects or closes the webpage, their connection *must* be removed from the Map immediately; otherwise, this will lead to memory leaks or server crashes caused by attempting to send messages to a defunct connection.

### Concurrency in Rooms

This is one of the most common sources of errors in Go development.

If multiple Goroutines attempt to read from and write to the member list of the same room simultaneously, it will directly trigger a `panic: fatal error: concurrent map writes`.
*   **Solution:** Use `sync.RWMutex` for locking, or—following a more idiomatic Go approach—**utilize Channels**. Route messages through a dedicated `broadcast channel` for distribution.

### Broadcast: Fan-out

Broadcasting involves more than just a simple `for` loop iteration to send messages.

*   **Asynchronous Sending:** If one of the client connections experiences severe network lag, a synchronous loop-based sending mechanism will stall, blocking the entire process.
*   **Buffered Channels:** Allocate a dedicated `chan` (channel) to serve as a buffer for each individual client. The server simply drops messages into this channel, leaving the actual reading and writing tasks to a dedicated Goroutine assigned to that client.

### Heartbeat / Ping-Pong

Internet network paths are complex; sometimes a connection may drop without the server immediately realizing it. It is essential to exchange small "heartbeat" packets every 10–30 seconds to verify that the other party is still "alive" and responsive.

### Reconnection

The frontend JavaScript code must be robustly designed to handle reconnections. Whenever a WebSocket connection is severed, the client should automatically attempt to re-establish the connection.

### Redis

If your "study room" application eventually scales up to span multiple servers—for instance, with a WebSocket connection established on Machine A while a user named "Xiao Ming" is connected to Machine B—they will be unable to see or interact with one another directly. In such scenarios, broadcasting requires integration with **Redis Pub/Sub (Publish/Subscribe)** to synchronize data and messages across multiple servers.

# Test

I use wscat (To install: `npm install -g wscat`) to connect with `wscat -c ws://localhost:8080/ws`.

websocat is also recommended by Gemini.

