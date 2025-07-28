
import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, LoadingSpinner } from './icons';

interface UserInputProps {
  onSend: (input: string) => void;
  isLoading: boolean;
}

const UserInput: React.FC<UserInputProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
        textarea.style.height = 'auto'; // Reset height
        const scrollHeight = textarea.scrollHeight;
        // Set a max-height to prevent infinite growth
        const maxHeight = 160; // Corresponds to max-h-40
        if (scrollHeight > maxHeight) {
             textarea.style.height = `${maxHeight}px`;
             textarea.style.overflowY = 'auto';
        } else {
            textarea.style.height = `${scrollHeight}px`;
            textarea.style.overflowY = 'hidden';
        }
    }
  }, [input]);

  return (
    <form onSubmit={handleSend} className="flex items-start bg-slate-700/60 border border-slate-600/80 rounded-xl p-2 gap-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask the agent to do something..."
        className="flex-1 bg-transparent resize-none focus:outline-none px-3 py-2 custom-scrollbar text-slate-200 placeholder:text-slate-300 text-sm max-h-40"
        rows={1}
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="p-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-700 focus:ring-blue-600 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
        aria-label="Send message"
      >
        {isLoading ? (
          <LoadingSpinner className="w-5 h-5 animate-spin" />
        ) : (
          <SendIcon className="w-5 h-5" />
        )}
      </button>
    </form>
  );
};

export default UserInput;
