import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, X, Mic, Bot } from 'lucide-react';
import { VACS_SOP } from '../constants/vacsSop';

const AiNavWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([{text: "How can I help you navigate today?", isUser: false}]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Web Speech API setup
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        handleCommand(text);
        setIsListening(false);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const getSopResponse = (query: string) => {
      const q = query.toLowerCase();
      if (q.includes('emergency')) return VACS_SOP.emergency.procedure;
      if (q.includes('assessment')) return VACS_SOP.governance.content;
      if (q.includes('tier')) return VACS_SOP.workforce.tiers;
      return "I can help with VACS SOP on Emergencies, Assessments, or Tier Levels. What do you need?";
  };

  const handleCommand = (command: string) => {
    setMessages(prev => [...prev, {text: command, isUser: true}]);
    const cmd = command.toLowerCase();
    
    if (cmd.includes("dashboard")) navigate('/branch-gate');
    else if (cmd.includes("staff")) navigate('/branch-gate/staff');
    else if (cmd.includes("home")) navigate('/');
    else {
        const response = getSopResponse(cmd);
        setMessages(prev => [...prev, {text: response, isUser: false}]);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const examples = ["Go to Dashboard", "What is the Emergency Protocol?", "Go Home"];

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4">
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
          <div className="bg-[#0B1D45] text-white p-4 flex items-center justify-between">
            <h4 className="font-bold text-sm flex items-center gap-2"><Bot size={18} /> VACS AI Assistant</h4>
            <button onClick={() => setIsOpen(false)}><X size={18} /></button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto text-sm text-slate-700">
            {messages.map((m, i) => (
                <div key={i} className={`mb-2 ${m.isUser ? 'text-right text-blue-600' : 'text-left'}`}>
                    {m.text}
                </div>
            ))}
            <div className="flex flex-wrap gap-2 mt-4">
              {examples.map((ex) => (
                <button 
                  key={ex} 
                  onClick={() => handleCommand(ex)}
                  className="bg-slate-100 hover:bg-slate-200 text-xs px-2 py-1 rounded-full transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-slate-100 flex gap-2">
            <input 
              type="text" 
              placeholder="Type command..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 text-sm border rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                      handleCommand(input);
                      setInput('');
                  }
              }}
            />
            <button onClick={toggleListening} className={`p-2 rounded-lg ${isListening ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-600'}`}>
              <Mic size={18} />
            </button>
          </div>
        </div>
      )}
      
      <button 
        className="w-14 h-14 rounded-full bg-[#C5A069] text-[#0B1D45] shadow-lg flex items-center justify-center hover:scale-105 transition-transform" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

export default AiNavWidget;
