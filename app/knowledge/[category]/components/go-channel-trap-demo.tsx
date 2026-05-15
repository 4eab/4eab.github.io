"use client";
import { useState } from "react";
import { Play, Zap, ZapOff, Terminal, Box, Layers, AlertCircle } from "lucide-react";

export default function GoRoomSimulation() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [status, setStatus] = useState<"idle" | "running" | "blocked" | "success">("idle");
  const [logs, setLogs] = useState<{msg: string, type: 'info' | 'error' | 'success'}[]>([]);

  const runSimulation = () => {
    setStatus("running");
    setLogs([
      { msg: "Starting wsHandler for new client...", type: 'info' },
      { msg: "room.mu.Lock() -> Client registered", type: 'info' },
      { msg: "conn.ReadMessage() -> 'Hello Go!'", type: 'info' }
    ]);
    
    setTimeout(() => {
      setLogs(prev => [...prev, { msg: "Attempting: room.broadcast <- 'Hello Go!'", type: 'info' }]);
      
      setTimeout(() => {
        if (!isInitialized) {
          setStatus("blocked");
          setLogs(prev => [...prev, { 
            msg: "FATAL: Goroutine Blocked! Sending to a NIL channel hangs forever.", 
            type: 'error' 
          }]);
        } else {
          setStatus("success");
          setLogs(prev => [...prev, { 
            msg: "SUCCESS: Message pushed to broadcast channel!", 
            type: 'success' 
          }]);
        }
      }, 1200);
    }, 1000);
  };

  const toggleInit = (val: boolean) => {
    setIsInitialized(val);
    setStatus("idle");
    setLogs([]);
  };

  return (
    <div className="my-8 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden bg-[#0d1117] shadow-2xl max-w-4xl mx-auto font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-xs font-mono text-slate-400">room_manager.go</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* Left: Code Structure (2 columns) */}
        <div className="lg:col-span-2 p-5 bg-[#161b22] border-r border-white/5">
          <div className="flex items-center gap-2 mb-4 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Box size={14} /> Data Structure
          </div>
          <pre className="text-[13px] font-mono leading-relaxed">
            <div className="text-purple-400">type <span className="text-yellow-200">Room</span> struct {'{'}</div>
            <div className="pl-4 text-slate-300">clients <span className="text-orange-400">map</span>[*Client]<span className="text-orange-400">bool</span></div>
            <div className={`pl-4 transition-colors duration-300 ${!isInitialized ? 'bg-rose-500/10 text-rose-300' : 'text-slate-300'}`}>
              broadcast <span className="text-orange-400">chan string</span>
            </div>
            <div className="pl-4 text-slate-300">mu <span className="text-yellow-200">sync.Mutex</span></div>
            <div className="text-purple-400">{'}'}</div>

            <div className="mt-6 text-purple-400 text-xs">{"// Initialization Logic"}</div>
            <div className="text-purple-400">var <span className="text-slate-300">room = Room</span> {'{'}</div>
            <div className="pl-4 text-slate-300">clients: make(...),</div>
            
            <div className={`pl-4 py-1 flex items-center gap-2 transition-all duration-300 ${isInitialized ? 'bg-emerald-500/10' : 'bg-rose-500/20'}`}>
               <span className={isInitialized ? "text-emerald-400" : "text-rose-400"}>
                 {isInitialized ? "broadcast: make(chan string)," : "// broadcast is NIL"}
               </span>
            </div>
            <div className="text-purple-400">{'}'}</div>
          </pre>

          <div className="mt-8">
            <label className="text-[10px] text-slate-500 font-bold uppercase mb-2 block">Toggle Initialization</label>
            <div className="flex bg-black/40 p-1 rounded-lg">
              <button 
                onClick={() => toggleInit(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded text-xs transition-all ${!isInitialized ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <ZapOff size={12} /> Forget Make
              </button>
              <button 
                onClick={() => toggleInit(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded text-xs transition-all ${isInitialized ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Zap size={12} /> With Make
              </button>
            </div>
          </div>
        </div>

        {/* Right: Runtime & Terminal (3 columns) */}
        <div className="lg:col-span-3 flex flex-col bg-[#0d1117]">
          {/* Runtime Flow */}
          <div className="p-5 border-b border-white/5">
            <div className="flex items-center gap-2 mb-4 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <Layers size={14} /> Execution: broadcast to all clients in the room
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-xs font-mono p-2 bg-white/5 rounded border border-white/5">
                <span className="text-slate-500">01</span>
                <span className="text-slate-300">conn.ReadMessage()</span>
                <span className="text-emerald-500 ml-auto font-bold">READY</span>
              </div>
              <div className={`flex items-center gap-3 text-xs font-mono p-2 rounded border transition-all duration-500 ${status === 'blocked' ? 'bg-rose-500/20 border-rose-500/50 animate-pulse' : 'bg-white/5 border-white/5'}`}>
                <span className="text-slate-500">02</span>
                <span className={status === 'blocked' ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                  room.broadcast {"<-"} msg
                </span>
                {status === 'blocked' && <AlertCircle size={14} className="text-rose-500 ml-auto" />}
              </div>
              <div className="flex items-center gap-3 text-xs font-mono p-2 bg-white/5 rounded border border-white/5 opacity-50">
                <span className="text-slate-500">03</span>
                <span className="text-slate-300">{"// Next loop..."}</span>
              </div>
            </div>
          </div>

          {/* Terminal */}
          <div className="p-5 flex-1 overflow-y-auto max-h-[250px]">
             <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase mb-3">
              <Terminal size={12} /> Go Runtime Log
            </div>
            <div className="space-y-1.5 font-mono text-[12px]">
              {logs.length === 0 && <div className="text-slate-600 italic">Press &quot;Run&quot; to simulate connection...</div>}
              {logs.map((l, i) => (
                <div key={i} className={`flex gap-2 ${l.type === 'error' ? 'text-rose-400' : l.type === 'success' ? 'text-emerald-400' : 'text-slate-400'}`}>
                  <span className="text-slate-600 shrink-0">[{new Date().toLocaleTimeString([], {hour12:false})}]</span>
                  <span>{l.msg}</span>
                </div>
              ))}
              {status === 'blocked' && (
                <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded text-rose-300 text-[11px] leading-relaxed">
                  <strong>Why did it stop?</strong> Because <code>room.broadcast</code> was nil. In Go, sending to a nil channel blocks that goroutine forever. The handler will never reach &quot;Next loop&quot;, and this client will appear to be &quot;frozen&quot;.
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-slate-900/50 flex justify-end">
            <button
              onClick={runSimulation}
              disabled={status === "running" || status === "blocked" || status === "success"}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded font-bold text-sm transition-all"
            >
              <Play size={14} fill="currentColor" /> Run Simulation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}