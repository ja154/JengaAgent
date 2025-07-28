


import React from 'react';
import type { ChatMessage, PlanStep, UserProfile } from '../types';
import Message from './Message';
import UserInput from './UserInput';
import AgentPlan from './AgentPlan';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  plan: PlanStep[];
  isLoading: boolean;
  onSendMessage: (input: string) => void;
  userProfile: UserProfile;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, plan, isLoading, onSendMessage, userProfile }) => {
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 h-full gap-8">
      {/* Main Chat Area */}
      <div className="lg:col-span-2 flex flex-col h-full bg-slate-800/50 border border-slate-700/50 rounded-xl shadow-lg shadow-slate-900/50">
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col gap-y-6">
            {messages.map((msg) => (
              <Message 
                key={msg.id} 
                message={msg} 
                avatarUrl={msg.sender === 'user' ? userProfile.avatarUrl : undefined}
              />
            ))}
            {isLoading && messages[messages.length - 1]?.sender === 'user' && (
              <Message key="loading" message={{id: 'loading', sender: 'agent', text: '...'}} />
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-slate-700/50 bg-slate-800/30 backdrop-blur-sm rounded-b-xl">
          <UserInput onSend={onSendMessage} isLoading={isLoading} />
        </div>
      </div>

      {/* Agent Plan Sidebar */}
      <div className="lg:col-span-1 h-full hidden lg:block">
        <AgentPlan plan={plan} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatInterface;
