import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  MapPin, 
  User, 
  ShieldCheck, 
  Search, 
  Mic, 
  Send, 
  ChevronRight, 
  BarChart3, 
  Bell,
  Wallet,
  Stethoscope,
  Briefcase,
  GraduationCap,
  Sprout,
  Users,
  Menu,
  X,
  MessageCircle,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { CitizenProfile, AppView, ChatMessage, Scheme } from './types';
import { NATIONAL_SCHEMES } from './lib/knowledgeGraph';
import { processJanSaarthiChat, extractProfileInfo } from './lib/gemini';
import ReactMarkdown from 'react-markdown';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function App() {
  const [view, setView] = useState<AppView>('citizen'); // Default to citizen for command center view
  const [profile, setProfile] = useState<CitizenProfile>({
    name: 'Ramesh Patil',
    age: 34,
    gender: 'male',
    state: 'Maharashtra',
    district: 'Nashik',
    occupation: 'Small Farmer',
    annualIncome: 120000,
    casteCategory: 'OBC',
    disabilityStatus: false,
    isFarmer: true,
    hasBPLCard: true,
    mobileNumber: '9876543210'
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN'; // Supporting Indian English context

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error('Failed to start speech recognition:', e);
      }
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatHistory(prev => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    extractProfileInfo(currentInput, profile).then(updates => {
      if (Object.keys(updates).length > 0) {
        setProfile(prev => ({ ...prev, ...updates }));
      }
    });

    try {
      const response = await processJanSaarthiChat(currentInput, chatHistory, profile);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || 'I am having trouble connecting. Please try again.',
        timestamp: new Date().toLocaleTimeString()
      };
      setChatHistory(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen w-screen grid grid-rows-[60px_1fr_140px] grid-cols-[300px_1fr] bg-high-bg overflow-hidden font-sans">
      {/* Header */}
      <header className="col-span-2 bg-high-primary text-white flex items-center justify-between px-6 border-b-[3px] border-high-accent">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-high-accent rounded-sm flex items-center justify-center font-black text-high-primary">JS</div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight">JanSaarthi AI</span>
            <span className="text-xs text-high-accent font-light opacity-80 uppercase tracking-widest">Infra v1.4</span>
          </div>
        </div>
        
        <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-white/60">
          <div className="flex items-center gap-2">
            <div className="status-dot bg-high-success" />
            Bharat Mainnet: Active
          </div>
          <div className="flex items-center gap-2">
            <div className="status-dot bg-blue-400" />
            Edge Sync: 99.2%
          </div>
          <div className="flex items-center gap-2">
            <div className="status-dot bg-high-accent" />
            12 Regional LLMs Live
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="bg-white border-r border-high-border p-6 flex flex-col gap-6 overflow-y-auto high-scroll">
        <div>
          <span className="section-label">Current Citizen Insight</span>
          <div className="yojana-card bg-high-bg/50">
            <div className="yojana-id">JS-4829-UP-2024</div>
            <div className="text-[10px] text-high-secondary font-bold uppercase mb-3">Profile Verified: Biometric Hash (Kiosk-04)</div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {[
                { label: 'Age', val: `${profile.age || 34}Y` },
                { label: 'Location', val: 'Rural (L3)' },
                { label: 'Vocat.', val: profile.occupation || 'Farmer' },
                { label: 'Income', val: '1.2L p/a' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[12px] font-bold text-high-primary">{item.val}</span>
                  <span className="text-[10px] text-high-secondary uppercase tracking-wider">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <span className="section-label">Predictive Governance</span>
          <div className="space-y-4">
            {[
              { label: 'Unmet Fertilizer Demand', val: '82%', color: 'bg-high-accent', width: 82 },
              { label: 'Literacy-Gap Opportunity', val: 'Moderate', color: 'bg-blue-400', width: 45 },
            ].map((item, i) => (
              <div key={i} className="space-y-1.5 text-[11px]">
                <div className="flex justify-between font-bold">
                  <span className="text-high-primary uppercase tracking-tight">{item.label}</span>
                  <span className="text-high-accent">{item.val}</span>
                </div>
                <div className="w-full h-1 bg-high-border rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.width}%` }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <span className="section-label">Connectivity Mesh</span>
          <div className="font-mono text-[10px] text-high-secondary leading-relaxed bg-high-bg p-3 rounded-sm border border-high-border/30">
            NODE-AF81 (Active)<br />
            NODE-BF22 (Local Only)<br />
            NODE-CC09 (Active)
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="bg-white p-6 grid grid-rows-[auto_1fr] gap-6 overflow-hidden">
        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Daily Interactions', val: '1.2M+' },
            { label: 'Central Schemes', val: '402' },
            { label: 'District Nodes', val: '2,118' },
            { label: 'Accuracy Score', val: '94.1%' },
          ].map((kpi, i) => (
            <div key={i} className="border border-high-border p-4 border-l-4 border-high-primary bg-white shadow-sm">
              <div className="font-mono text-2xl font-light text-high-primary">{kpi.val}</div>
              <div className="text-[10px] text-high-secondary font-bold uppercase tracking-widest">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Content Tabs/Sections */}
        <div className="grid grid-cols-[1fr_1.2fr] gap-6 min-h-0">
          {/* Work Area / Map Placeholder or Intelligence */}
          <div className="bg-high-bg/30 border border-high-border border-dashed relative flex flex-col p-4 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <span className="section-label mb-0">Regional Heatmap: Eligibility Distribution</span>
              <div className="flex gap-2">
                <button onClick={() => setView('citizen')} className={`px-3 py-1 text-[9px] font-bold uppercase rounded-sm border ${view === 'citizen' ? 'bg-high-primary text-white border-high-primary' : 'bg-white text-high-secondary border-high-border'}`}>Live Sync</button>
                <button onClick={() => setView('intelligence')} className={`px-3 py-1 text-[9px] font-bold uppercase rounded-sm border ${view === 'intelligence' ? 'bg-high-primary text-white border-high-primary' : 'bg-white text-high-secondary border-high-border'}`}>Intelligence</button>
              </div>
            </div>
            
            <div className="flex-1 relative bg-white/50 border border-high-border rounded-sm">
              {view === 'intelligence' ? (
                <div className="p-4 h-full flex flex-col">
                   <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Agri', demand: 1240, supply: 850 },
                        { name: 'Health', demand: 2800, supply: 2650 },
                        { name: 'Skills', demand: 4100, supply: 1200 },
                        { name: 'Credit', demand: 3200, supply: 900 },
                      ]}>
                        <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#7f8c8d' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#7f8c8d' }} />
                        <Tooltip />
                        <Bar dataKey="demand" fill="#2c3e50" radius={[2, 2, 0, 0]} barSize={12} />
                        <Bar dataKey="supply" fill="#e67e22" radius={[2, 2, 0, 0]} barSize={12} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="h-full w-full relative">
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute w-1.5 h-1.5 bg-high-accent rounded-full animate-pulse shadow-[0_0_5px_rgba(230,126,34,0.8)]"
                      style={{ 
                        top: `${20 + Math.random() * 60}%`, 
                        left: `${20 + Math.random() * 60}%` 
                      }}
                    />
                  ))}
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                     <Sprout size={300} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Scheme List (Industrial Grid) */}
          <div className="flex flex-col min-h-0 bg-white border border-high-border">
            <div className="grid grid-cols-[1fr_80px_80px_80px] p-3 border-b border-high-border bg-high-bg text-[10px] font-bold text-high-secondary uppercase tracking-widest">
              <span>Scheme Name</span>
              <span className="text-center">Rank</span>
              <span className="text-center">Match</span>
              <span className="text-center">Action</span>
            </div>
            <div className="flex-1 overflow-y-auto high-scroll">
              {NATIONAL_SCHEMES.map((scheme, i) => (
                <div key={scheme.id} className="grid grid-cols-[1fr_80px_80px_80px] px-3 py-3 border-b border-high-bg items-center hover:bg-high-bg/30 transition-colors group">
                  <a 
                    href={scheme.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex flex-col min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <span className="font-bold text-high-primary truncate group-hover:text-high-accent transition-colors">{scheme.name}</span>
                    <span className="text-[10px] text-high-secondary uppercase tracking-tighter">{scheme.department}</span>
                  </a>
                  <div className="font-mono text-center text-xs opacity-60">#{String(i + 1).padStart(2, '0')}</div>
                  <div className="flex justify-center">
                    <span className="match-tag px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                      {98 - i * 5}.{Math.floor(Math.random() * 9)}%
                    </span>
                  </div>
                  <div className="flex justify-center">
                    <a 
                      href={scheme.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 hover:bg-high-accent hover:text-white rounded-sm transition-colors text-high-primary border border-high-border bg-white shadow-sm"
                      title="Apply via Official Portal"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer (Agent Command Bar) */}
      <footer className="col-span-2 bg-high-ink text-white px-6 py-4 grid grid-cols-4 gap-6 border-t border-white/10 uppercase font-mono">
        {[
          { name: 'Linguist', activity: 'TRANSCODING', log: 'Audio -> Semantic Map v2', active: true },
          { name: 'PolicyLogic', activity: 'REASONING', log: 'Eligibility Section 24.1', active: true },
          { name: 'KnowledgeGraph', activity: 'INDEXING', log: 'New State Directive: UP-2024', active: true },
          { name: 'DocGuide', activity: 'STANDBY', log: 'Awaiting Citizen Consent', active: false },
        ].map((agent, i) => (
          <div key={i} className="flex flex-col gap-1.5 opacity-80 border-r border-white/10 last:border-r-0 pr-4">
            <div className="flex justify-between items-center text-[10px] text-white/40 font-bold">
              <span>Agent: {agent.name}</span>
              <div className={`w-1.5 h-1.5 rounded-full ${agent.active ? 'bg-high-success shadow-[0_0_5px_#27ae60]' : 'bg-high-secondary'}`} />
            </div>
            <div className={`text-[12px] font-bold ${agent.active ? 'text-high-success' : 'text-high-secondary'}`}>{agent.activity}</div>
            <div className="text-[9px] text-white/50 truncate overflow-hidden">{agent.log}</div>
          </div>
        ))}
      </footer>

      {/* Floating Chat / Saarthi Interface (Adapted) */}
      <div className="fixed bottom-24 right-8 z-[100]">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-[400px] h-[500px] bg-white border border-high-primary shadow-2xl flex flex-col rounded-sm overflow-hidden"
            >
              <div className="bg-high-primary p-4 text-white flex justify-between items-center border-b-[3px] border-high-accent">
                <div className="flex items-center gap-2">
                  <Mic size={16} className="text-high-accent" />
                  <span className="text-xs font-bold uppercase tracking-widest">Saarthi Interface</span>
                </div>
                <button onClick={() => setIsChatOpen(false)}><X size={16} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 high-scroll bg-high-bg/20">
                {chatHistory.length === 0 && (
                  <div className="text-center py-10 opacity-30">
                    <Mic size={48} className="mx-auto mb-4" />
                    <p className="text-xs font-bold uppercase tracking-widest">Awaiting Audio Input or Command</p>
                  </div>
                )}
                {chatHistory.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai border border-high-border'}>
                      <div className="text-xs leading-relaxed">
                        {msg.role === 'assistant' ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
                      </div>
                      <div className="text-[8px] opacity-40 mt-1 uppercase font-bold">{msg.timestamp}</div>
                    </div>
                  </div>
                ))}
                {isTyping && <div className="text-[10px] font-mono text-high-primary animate-pulse">REASONING_IN_PROGRESS...</div>}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t border-high-border bg-white">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                   <div className="flex-1 relative flex items-center">
                    <input 
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={isListening ? "Listening..." : "Enter command or text..."}
                      className={`w-full bg-high-bg border border-high-border rounded-sm px-3 py-2 text-xs outline-none focus:border-high-primary font-mono ${isListening ? 'border-high-accent animate-pulse' : ''}`}
                    />
                    <button 
                      type="button"
                      onClick={toggleListening}
                      className={`absolute right-2 p-1 rounded-full transition-colors ${isListening ? 'text-high-accent' : 'text-high-secondary hover:text-high-primary'}`}
                    >
                      <Mic size={14} className={isListening ? 'animate-bounce' : ''} />
                    </button>
                  </div>
                  <button type="submit" className="bg-high-primary text-white p-2 rounded-sm shadow-sm hover:bg-high-accent transition-colors">
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsChatOpen(!isChatOpen)}
          whileHover={{ scale: 1.05 }}
          className={`w-14 h-14 bg-high-primary text-white border-2 border-white shadow-xl flex items-center justify-center rounded-sm transition-all ${isChatOpen ? 'bg-high-accent rotate-90 border-high-primary' : ''}`}
        >
          {isChatOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </motion.button>
      </div>
    </div>
  );
}
