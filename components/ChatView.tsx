
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { Storage } from '../services/storageService';
import { PLANT_SPECIES_CATALOG, PROJECT_EXPLANATION } from '../constants';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I am your STEMIFY AI Advisor. I can help you with disease management protocols, explain CNN classification results, or give you advice based on your recent scans. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const records = Storage.getRecords().slice(-5);

      const contextString = records.map(r => {
        return `Scan ID ${r.id}: Detected ${r.result.diseaseName} with ${r.result.confidence * 100}% confidence. Severity was ${r.result.severity}.`;
      }).join('\n');

      const systemInstruction = `
        You are the STEMIFY AI Agricultural Advisor, a senior AI/ML expert specializing in plant stem diseases.
        
        CONTEXT:
        - Project: ${PROJECT_EXPLANATION.abstract}
        - Diseases supported: Rice Stem Rot, Wheat Stem Rust, Dragon Fruit Stem Canker, Tomato Wilt, Cotton Blight.
        - Knowledge Base: ${JSON.stringify(PLANT_SPECIES_CATALOG)}
        - User's Recent Scans:
        ${contextString || 'No recent scans found.'}
        
        GOALS:
        1. Answer follow-up questions about the management protocols.
        2. Explain why certain recommendations were given.
        3. Provide preventative agricultural advice.
        4. Be clear, professional, and academically rigorous.
        
        FORMAT:
        - Use concise paragraphs.
        - Use bullet points for lists.
      `;

      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model' as 'user' | 'model',
        parts: [{ text: m.text }]
      }));

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      let fullText = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        const text = c.text || '';
        fullText += text;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = fullText;
          return updated;
        });
      }

    } catch (err: any) {
      console.error(err);
      const isQuotaError = err.message?.includes('429') || err.message?.includes('quota');
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: isQuotaError 
          ? "I'm currently receiving too many requests. Please wait about 30-60 seconds and try again. (Quota Exceeded)" 
          : "I encountered an error connecting to my neural core. Please check your connection or try again later." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[75vh] flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex-1 overflow-y-auto pr-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-[2rem] p-6 shadow-sm border ${
              m.role === 'user' 
              ? 'bg-emerald-600 text-white border-emerald-600 rounded-tr-none' 
              : 'bg-white text-slate-800 border-slate-100 rounded-tl-none'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{m.role === 'user' ? '🧑‍🌾' : '🤖'}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${m.role === 'user' ? 'text-emerald-100' : 'text-slate-400'}`}>
                  {m.role === 'user' ? 'You' : 'STEMIFY Advisor'}
                </span>
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {m.text || (loading && i === messages.length - 1 ? '...' : '')}
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={sendMessage} className="relative mt-auto">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about your recent scans or disease management..."
          className="w-full p-6 pr-24 rounded-[2rem] bg-white border border-slate-100 shadow-xl outline-none focus:ring-4 focus:ring-emerald-600/10 transition-all font-medium text-slate-800"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="absolute right-3 top-3 bottom-3 px-8 bg-emerald-600 text-white rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all"
        >
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatView;
