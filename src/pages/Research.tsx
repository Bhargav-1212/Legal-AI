import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { conductResearch, type ChatMessage } from '../services/ai';
import ReactMarkdown from 'react-markdown';

const Research = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'assistant', content: 'Hello. I am your advanced legal assistant powered by GPT-OSS 120B. How can I help you with your research today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Use specific research method which uses the strict Indian Law prompt
            const result = await conductResearch(input);

            if (result) {
                // Format JSON result into a readable message 
                const formattedContent = `
**Answer:** ${result.answer}

**Relevant Laws:**
${result.relevant_laws?.map((l: string) => `- ${l}`).join('\n')}

**Practical Explanation:**
${result.practical_explanation?.map((e: string) => `> ${e}`).join('\n')}

**When to consult a lawyer:** ${result.when_to_consult_lawyer}
               `.trim();

                const response: ChatMessage = {
                    role: 'assistant',
                    content: formattedContent + '\n\n*(Analysis provided with ' + result.confidence_score + '% confidence score)*',
                    data: result
                };
                setMessages(prev => [...prev, response]);
            } else {
                throw new Error("No result from research service");
            }
        } catch (error: any) {
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message || "Failed to connect to service."}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-xl border border-light-border shadow-sm overflow-hidden">
            <div className="p-4 border-b border-light-border bg-light-bg flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h2 className="font-bold text-dark">Legal Research Assistant</h2>
                </div>
                <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-light-border">
                    Model: GPT-OSS 120B (High Reasoning)
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'} items-start space-x-3`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-dark text-white' : 'bg-primary text-white'}`}>
                                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                            </div>

                            <div className="flex flex-col space-y-2">
                                <div className={`p-4 rounded-2xl shadow-sm ${msg.role === 'user'
                                    ? 'bg-dark text-white rounded-tr-none'
                                    : 'bg-white border border-light-border text-dark rounded-tl-none'
                                    }`}>
                                    <div className="prose prose-sm max-w-none">
                                        <ReactMarkdown
                                            components={{
                                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
                                                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>

                                {msg.reasoning && (
                                    <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg text-sm text-gray-700">
                                        <p className="font-bold text-primary text-xs mb-1 uppercase tracking-wider flex items-center">
                                            <Sparkles className="w-3 h-3 mr-1" /> Reasoning Process
                                        </p>
                                        <p className="italic">{msg.reasoning}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex flex-row items-start space-x-3">
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div className="bg-white border border-light-border p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ params: '0s' } as any}></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-light-border">
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a legal question or describe a case..."
                        className="w-full pl-4 pr-12 py-3 bg-light-bg border border-light-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-14 max-h-32"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-2 p-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-center text-xs text-gray-400 mt-2">
                    AI can make mistakes. Verify important legal information.
                </p>
            </div>
        </div>
    );
};

export default Research;
