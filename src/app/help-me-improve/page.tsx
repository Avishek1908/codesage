'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function HelpMeImprove() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [verboseName, setVerboseName] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "👋 Hi! I'm your AI code analyst. I can see your code and I'm ready to help you improve it! I can analyze your solution for:\n\n• Performance optimizations\n• Code readability improvements\n• Best practices and patterns\n• Potential bugs or edge cases\n• Alternative approaches\n\nWhat would you like me to focus on?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const codeParam = searchParams.get('code');
    const langParam = searchParams.get('lang');
    const verboseParam = searchParams.get('verboseName');
    
    if (codeParam) setCode(decodeURIComponent(codeParam));
    if (langParam) setLanguage(langParam);
    if (verboseParam) setVerboseName(decodeURIComponent(verboseParam));
  }, [searchParams]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call the AI chat API
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
          code: code,
          language: language
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'AI chat failed');
      }

      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: result.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const getFileExtension = (lang: string) => {
    switch (lang) {
      case 'python': return 'py';
      case 'javascript': return 'js';
      case 'mysql': return 'sql';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      case 'c': return 'c';
      case 'typescript': return 'ts';
      default: return 'txt';
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes siriWave {
          0%, 100% { 
            transform: scaleY(0.3);
            opacity: 0.6;
          }
          50% { 
            transform: scaleY(1);
            opacity: 1;
          }
        }
        
        .siri-wave {
          width: 4px;
          height: 24px;
          background: linear-gradient(to bottom, #8b5cf6, #06b6d4);
          border-radius: 2px;
          animation: siriWave 1.2s ease-in-out infinite;
        }
        
        .siri-wave:nth-child(1) { animation-delay: 0s; }
        .siri-wave:nth-child(2) { animation-delay: 0.1s; }
        .siri-wave:nth-child(3) { animation-delay: 0.2s; }
        .siri-wave:nth-child(4) { animation-delay: 0.3s; }
        .siri-wave:nth-child(5) { animation-delay: 0.4s; }
        .siri-wave:nth-child(6) { animation-delay: 0.2s; }
        .siri-wave:nth-child(7) { animation-delay: 0.1s; }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }
        
        .ai-thinking {
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes scoreCircle {
          from {
            stroke-dasharray: 0 75.36;
          }
        }
        
        .score-circle {
          animation: scoreCircle 1.5s ease-out;
        }
        
        @keyframes scorePopIn {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .score-container {
          animation: scorePopIn 0.6s ease-out;
        }
      `}</style>
      
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Left Side - Code Editor */}
      <div className="w-1/2 border-r border-white/10">
        {/* Header */}
        <div className="bg-slate-800/80 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="text-xl font-bold text-white hover:text-orange-400 transition-colors"
              >
                CodeSage
              </Link>
              <div className="h-6 w-px bg-gray-600"></div>
              <h1 className="text-lg text-white font-semibold">Code Analysis</h1>
            </div>
            <button
              onClick={() => window.close()}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="h-full bg-slate-900">
          <div className="bg-slate-900 h-full">
            {/* Code editor header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-gray-400 text-sm ml-3">
                  {language}.{getFileExtension(language)}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {verboseName || 'Code'}
              </div>
            </div>
            
            {/* Code content with line numbers */}
            <div className="flex h-full">
              <div className="bg-slate-800 px-3 py-4 text-right text-gray-500 text-sm font-mono select-none border-r border-slate-700">
                {code ? 
                  code.split('\n').map((_: string, index: number) => (
                    <div key={index} className="leading-6">
                      {index + 1}
                    </div>
                  )) : 
                  <div>1</div>
                }
              </div>
              <pre className="flex-1 p-4 text-sm text-gray-100 font-mono overflow-auto leading-6 bg-slate-900">
                <code className="language-auto">
                  {code || 'No code available'}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - AI Chatbot */}
      <div className="w-1/2 flex flex-col">
        {/* Chat Header */}
        <div className="bg-slate-800/80 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center ${isTyping ? 'ai-thinking' : ''}`}>
                <span className="text-white font-bold">AI</span>
              </div>
              <div className="flex-1">
                <h2 className="text-white font-semibold">Code Improvement Assistant</h2>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                  <p className="text-gray-400 text-sm">
                    {isTyping ? 'Analyzing your code...' : 'Ready to help you improve your code'}
                  </p>
                </div>
              </div>
              
              {/* Siri-style indicator in header when active */}
              {isTyping && (
                <div className="flex items-center space-x-1">
                  <div className="siri-wave" style={{ height: '16px' }}></div>
                  <div className="siri-wave" style={{ height: '16px' }}></div>
                  <div className="siri-wave" style={{ height: '16px' }}></div>
                  <div className="siri-wave" style={{ height: '16px' }}></div>
                  <div className="siri-wave" style={{ height: '16px' }}></div>
                </div>
              )}
            </div>

            {/* Code Analysis Scores */}
            <div className="flex space-x-4">
              {/* Code Quality Score */}
              <div className="bg-slate-700/60 backdrop-blur-sm rounded-xl p-3 border border-slate-600/30 score-container hover:bg-slate-700/80 transition-colors">
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">Code Quality</div>
                  <div className="flex items-center space-x-2">
                    <div className="relative w-8 h-8">
                      <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="transparent"
                          className="text-slate-600"
                        />
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="transparent"
                          strokeDasharray={`${7.5 * 2.51} ${75.36}`}
                          className="text-green-400 score-circle"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-green-400">7.5</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-300">/10</span>
                  </div>
                </div>
              </div>

              {/* Improvement Potential Score */}
              <div className="bg-slate-700/60 backdrop-blur-sm rounded-xl p-3 border border-slate-600/30 score-container hover:bg-slate-700/80 transition-colors" style={{ animationDelay: '0.2s' }}>
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">Improvement Potential</div>
                  <div className="flex items-center space-x-2">
                    <div className="relative w-8 h-8">
                      <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="transparent"
                          className="text-slate-600"
                        />
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="transparent"
                          strokeDasharray={`${6.2 * 2.51} ${75.36}`}
                          className="text-orange-400 score-circle"
                          style={{ animationDelay: '0.2s' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-orange-400">6.2</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-300">/10</span>
                  </div>
                </div>
              </div>

              {/* Performance Score */}
              <div className="bg-slate-700/60 backdrop-blur-sm rounded-xl p-3 border border-slate-600/30 score-container hover:bg-slate-700/80 transition-colors" style={{ animationDelay: '0.4s' }}>
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">Performance</div>
                  <div className="flex items-center space-x-2">
                    <div className="relative w-8 h-8">
                      <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="transparent"
                          className="text-slate-600"
                        />
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="transparent"
                          strokeDasharray={`${8.7 * 2.51} ${75.36}`}
                          className="text-blue-400 score-circle"
                          style={{ animationDelay: '0.4s' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-400">8.7</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-300">/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-slate-900/50 to-slate-800/30">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div className={`flex ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3 max-w-4xl`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-3' : 'mr-3'}`}>
                  {message.type === 'user' ? (
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">U</span>
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">AI</span>
                    </div>
                  )}
                </div>

                {/* Message content */}
                <div
                  className={`px-6 py-4 rounded-2xl shadow-lg ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      : 'bg-slate-700/80 backdrop-blur-sm text-gray-100 border border-slate-600/50'
                  } max-w-2xl`}
                >
                  <div className={`prose prose-sm ${message.type === 'user' ? 'prose-invert' : ''} max-w-none`}>
                    {message.content.split('\n').map((line, index) => {
                      if (line.trim() === '') {
                        return <br key={index} />;
                      }
                      
                      // Handle bullet points
                      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                        return (
                          <div key={index} className="flex items-start space-x-2 my-2">
                            <span className="text-purple-400 font-bold">•</span>
                            <span className="flex-1">{line.replace(/^[•\-]\s*/, '')}</span>
                          </div>
                        );
                      }
                      
                      // Handle code blocks
                      if (line.includes('```')) {
                        return null; // Handle this separately if needed
                      }
                      
                      // Handle inline code
                      if (line.includes('`')) {
                        const parts = line.split('`');
                        return (
                          <p key={index} className="my-2">
                            {parts.map((part, partIndex) => 
                              partIndex % 2 === 1 ? (
                                <code key={partIndex} className="bg-slate-800 px-2 py-1 rounded text-orange-300 font-mono text-xs">
                                  {part}
                                </code>
                              ) : (
                                part
                              )
                            )}
                          </p>
                        );
                      }
                      
                      return <p key={index} className="my-2 leading-relaxed">{line}</p>;
                    })}
                  </div>
                  
                  {/* Timestamp */}
                  <div className={`text-xs mt-3 pt-2 border-t ${
                    message.type === 'user' 
                      ? 'text-orange-200 border-orange-400/30' 
                      : 'text-gray-400 border-slate-600'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-fadeIn">
              <div className="flex items-start space-x-3 max-w-4xl">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center ai-thinking">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <div className="bg-slate-700/80 backdrop-blur-sm text-gray-100 border border-slate-600/50 px-6 py-4 rounded-2xl shadow-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-300">AI is analyzing your code</span>
                    
                    {/* Siri-style wave animation */}
                    <div className="flex items-center space-x-1">
                      <div className="siri-wave"></div>
                      <div className="siri-wave"></div>
                      <div className="siri-wave"></div>
                      <div className="siri-wave"></div>
                      <div className="siri-wave"></div>
                      <div className="siri-wave"></div>
                      <div className="siri-wave"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="bg-slate-800/90 backdrop-blur-sm border-t border-white/10 p-6">
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about your code... (Press Shift+Enter for new line, Enter to send)"
                  className="w-full px-4 py-3 bg-slate-700/80 backdrop-blur-sm border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                  disabled={isTyping}
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
              </div>
              <div className="flex flex-col justify-end">
                <button
                  type="submit"
                  disabled={isTyping || !inputMessage.trim()}
                  className={`px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg ${isTyping ? 'ai-thinking' : ''}`}
                >
                  <div className="flex items-center space-x-2">
                    {isTyping ? (
                      <>
                        <div className="flex items-center space-x-1">
                          <div className="siri-wave" style={{ height: '12px', width: '2px' }}></div>
                          <div className="siri-wave" style={{ height: '12px', width: '2px' }}></div>
                          <div className="siri-wave" style={{ height: '12px', width: '2px' }}></div>
                        </div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <span>Send</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
            
            {/* Quick suggestions */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-400">Quick questions:</span>
              {[
                "How can I optimize this code?",
                "Are there any bugs here?",
                "Explain this algorithm",
                "Best practices review"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setInputMessage(suggestion)}
                  disabled={isTyping}
                  className="px-3 py-1 text-xs bg-slate-600/50 hover:bg-slate-600 text-gray-300 hover:text-white rounded-full transition-colors border border-slate-500/30 disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}
