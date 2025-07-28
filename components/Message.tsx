
import React from 'react';
import type { ChatMessage } from '../types';
import { UserIcon, AgentIcon } from './icons';

interface MessageProps {
  message: ChatMessage;
  avatarUrl?: string;
}

const Message: React.FC<MessageProps> = ({ message, avatarUrl }) => {
  const isUser = message.sender === 'user';
  const isLoading = message.text === '...';

  const containerClasses = isUser ? 'flex-row-reverse self-end' : 'flex-row self-start';
  
  const bubbleClasses = isUser
    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none'
    : message.isError
      ? 'bg-red-900/40 text-red-200 rounded-bl-none border border-red-800/50'
      : 'bg-slate-700 text-slate-200 rounded-bl-none border border-slate-600/80';

  const icon = isUser 
    ? (
        <div 
          className="size-9 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 bg-cover bg-center"
          style={avatarUrl ? { backgroundImage: `url("${avatarUrl}")` } : {}}
        >
          {!avatarUrl && <UserIcon className="w-5 h-5 text-slate-300" />}
        </div>
      )
    : <div className="size-9 rounded-full bg-blue-900/50 flex items-center justify-center flex-shrink-0"><AgentIcon className="w-5 h-5 text-blue-400" /></div>;

  const formattedText = message.text.split('\n').map((line, index, arr) => (
    <React.Fragment key={index}>
      {line}
      {index < arr.length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <div className={`flex items-start gap-3.5 ${containerClasses} max-w-[85%]`}>
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className={`px-4 py-3 rounded-2xl shadow-sm ${bubbleClasses}`}>
        {isLoading ? (
          <div className="flex items-center space-x-2 text-slate-500">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{formattedText}</p>
        )}
      </div>
    </div>
  );
};

export default Message;
