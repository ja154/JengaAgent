import React, { useState, useEffect, useCallback } from 'react';
import { PlanStepStatus, type ChatMessage, type PlanStep as PlanStepType, AgentMode, type UserProfile, Theme, AgentPersonality } from './types';
import { sendAgentMessage } from './services/geminiService';
import ChatInterface from './components/ChatInterface';
import { JengaIcon } from './components/icons';
import AccountPage from './components/AccountPage';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [plan, setPlan] = useState<PlanStepType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [agentMode, setAgentMode] = useState<AgentMode>(AgentMode.Productivity);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alex Ryder',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAU-4BkA5krwFNNMrE1MGqwfxBmlw8c5T6zVfj5fy5XwOcwY2XR7kULimjtaBjpGfmF9PFRB-Qz-bc1VKaS1vSxJDrmbdM1Ok6lCAvCV7p3gCPs5N4bcAUmFH5Df5GNR5FKilU8tJ5KHk_wGfTV_cfnZ2JV_2d3XCp-09JyvFFAUM3HSwQ_koePBhrNk30_J7IpGiZatVIyfqgv5bCqddp3Sge_NDles6Lr9Zr2dLJMegV15CHOl9urPQHehsI5Qiob2gNPaU8oPzWb',
    theme: Theme.Light,
    agentPersonality: AgentPersonality.Friendly
  });
  const [isAccountPageOpen, setIsAccountPageOpen] = useState(false);

  useEffect(() => {
    // Initial greeting from the agent
    setMessages([
      {
        id: 'agent-intro',
        sender: 'agent',
        text: 'Hello! I am JengaAgent. Select a mode and tell me how I can help you think, generate, and automate.',
      },
    ]);
  }, []);
  
  useEffect(() => {
    // Apply theme to the root element
    if (userProfile.theme === Theme.Dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userProfile.theme]);

  const executePlan = useCallback(async (newPlan: PlanStepType[]) => {
    setPlan(newPlan);
    for (let i = 0; i < newPlan.length; i++) {
      // Short delay to simulate work
      await new Promise(resolve => setTimeout(resolve, 700));
      setPlan(prevPlan => {
        const updatedPlan = [...prevPlan];
        if (updatedPlan[i]) {
            updatedPlan[i].status = PlanStepStatus.Completed;
        }
        return updatedPlan;
      });
    }
  }, []);

  const handleSendMessage = useCallback(async (userInput: string) => {
    if (!userInput.trim() || isLoading) return;

    setError(null);
    setIsLoading(true);

    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userInput,
    };
    setMessages(prev => [...prev, newUserMessage]);
    setPlan([]); // Clear old plan

    try {
      const agentResponse = await sendAgentMessage(userInput, agentMode, userProfile.agentPersonality);
      
      const agentTextMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: agentResponse.response,
      };
      
      await executePlan(agentResponse.plan);
      setMessages(prev => [...prev, agentTextMessage]);

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      console.error(e);
      setError(`Agent Error: ${errorMessage}. Please check your API key and try again.`);
      const errorTextMessage: ChatMessage = {
        id: `agent-error-${Date.now()}`,
        sender: 'agent',
        text: "I seem to be having trouble connecting. Please ensure your API key is configured correctly.",
        isError: true,
      };
      setMessages(prev => [...prev, errorTextMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, executePlan, agentMode, userProfile.agentPersonality]);

  const handleSettingsSave = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    setIsAccountPageOpen(false);
  };

  const ModeSelector: React.FC = () => {
    const modes = [
        { id: AgentMode.Productivity, label: 'Productivity' },
        { id: AgentMode.Creative, label: 'Creative' }
    ];

    return (
        <div className="bg-slate-200/80 dark:bg-slate-700/50 p-1 rounded-lg flex items-center space-x-1">
            {modes.map(mode => (
                <button
                    key={mode.id}
                    onClick={() => setAgentMode(mode.id)}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all duration-300 ${
                        agentMode === mode.id
                            ? 'bg-white dark:bg-slate-500/80 text-slate-800 dark:text-white shadow-sm'
                            : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                >
                    {mode.label}
                </button>
            ))}
        </div>
    );
  };

  return (
    <div className="flex size-full min-h-screen flex-col bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-6 py-3 shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-3 text-slate-900">
            <JengaIcon className="size-7 text-blue-600" />
            <h2 className="text-slate-800 dark:text-slate-200 text-xl font-bold tracking-tight">JengaAgent</h2>
        </div>
        <div className="flex flex-1 justify-end items-center gap-4">
          <ModeSelector />
          <button
            onClick={() => setIsAccountPageOpen(true)}
            className="flex items-center gap-3 text-right p-2 -m-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open account settings"
          >
            <div className="hidden sm:block">
              <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">{userProfile.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Workspace Owner</p>
            </div>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-slate-200 dark:border-slate-700 group-hover:border-blue-500 transition-colors"
              style={{backgroundImage: `url("${userProfile.avatarUrl}")`}}
            ></div>
          </button>
        </div>
      </header>
      {error && (
        <div className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 p-3 text-center text-sm">
          {error}
        </div>
      )}
      <main className="px-6 flex flex-1 justify-center py-8">
        <div className="flex flex-col max-w-7xl w-full">
            <div className="flex flex-col gap-1 mb-6">
                <p className="text-slate-800 dark:text-slate-200 text-4xl font-extrabold tracking-tight">Agent Dashboard</p>
                <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Welcome back, {userProfile.name}. Let's create something amazing.</p>
            </div>
            <div className="flex-1 overflow-hidden">
                <ChatInterface
                    messages={messages}
                    plan={plan}
                    isLoading={isLoading}
                    onSendMessage={handleSendMessage}
                    userProfile={userProfile}
                />
            </div>
        </div>
      </main>
      <AccountPage
        isOpen={isAccountPageOpen}
        onClose={() => setIsAccountPageOpen(false)}
        userProfile={userProfile}
        onSave={handleSettingsSave}
      />
    </div>
  );
};

export default App;