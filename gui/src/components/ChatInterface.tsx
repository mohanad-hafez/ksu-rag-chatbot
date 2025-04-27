import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, Globe, ChevronDown, Sun, Moon, Bot } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatMessage from './ChatMessage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import TypingIndicator from './TypingIndicator';

const ChatInterface = () => {
  const [messages, setMessages] = useState<Array<{
    text: string;
    isBot: boolean;
    showFeedback?: boolean;
  }>>([{
    text: "Hello! How can I help you today?",
    isBot: true
  }]);
  const [input, setInput] = useState('');
  const [chatState, setChatState] = useState<any>({ messages: [] }); // Add chatState
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [userDescription, setUserDescription] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    setIsChangingLanguage(true);
    const timer = setTimeout(() => {
      setIsChangingLanguage(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentLanguage]);

  const translations = {
    English: {
      customize: "Customize",
      dialogTitle: "User Description",
      dialogDescription: "Provide information about yourself to help the chatbot give better responses",
      textareaPlaceholder: "Give a brief description about you - this will help the bot give better answers"
    },
    العربية: {
      customize: "تخصيص",
      dialogTitle: "وصف المستخدم",
      dialogDescription: "قدم معلومات عن نفسك لمساعدة روبوت الدردشة على تقديم ردود أفضل",
      textareaPlaceholder: "قدم وصفًا موجزًا عن نفسك - سيساعد هذا الروبوت على تقديم إجابات أفضل"
    }
  };

  const t = translations[currentLanguage as keyof typeof translations];

  const handleSend = async () => {
    if (input.trim()) {
      const userMessageText = input;
      const userMessageForUI = {
        text: userMessageText,
        isBot: false
      };
      // Add user message to UI immediately
      setMessages(prev => [...prev, userMessageForUI]);
      setInput('');
      setIsTyping(true); // Start typing indicator

      try {
        // Prepare the state to send to the API using the stored chatState
        const stateToSend = { ...chatState }; // Copy the current state
        // Ensure messages array exists (it should due to initialization)
        if (!stateToSend.messages) {
            stateToSend.messages = [];
        }

        // Send the *current* chatState and the new user message
        const response = await axios.post('http://127.0.0.1:8000/chat', {
            state: stateToSend, // Send the state received from the last API call
            user_message: userMessageText
        });

        // Extract bot message and the *updated* state from the response
        const botMessageText = response.data.bot_message;
        const updatedState = response.data.state;

        // Add the chatbot's response to the UI
        const botMessageForUI = {
            text: botMessageText,
            isBot: true,
            showFeedback: true // Keep the feedback option if needed
        };
        setMessages(prev => [...prev, botMessageForUI]);

        // *** IMPORTANT: Update chatState with the state returned by the API ***
        setChatState(updatedState);

      } catch (error) {
          console.error('Error communicating with the chatbot API:', error);
          const errorMessage = {
              text: 'Sorry, there was an error connecting to the chatbot. Please try again later.',
              isBot: true
          };
          setMessages(prev => [...prev, errorMessage]);
      } finally {
          setIsTyping(false); // Stop typing indicator regardless of success/error
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLanguageChange = (language: string) => {
    setIsChangingLanguage(true);
    setCurrentLanguage(language);
  };

  const arabicLogoSrc = isDarkMode
    ? "/lovable-uploads/d0187c2e-e630-4e93-81f2-9db922c1261c.png"
    : "/lovable-uploads/34a3b879-8d63-4fa3-84a8-375e4d30620c.png";

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-background">
      <div className="bg-background border-b p-4 flex items-center justify-center relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="px-4 py-2 h-10 flex items-center gap-2 rounded-full border border-[#0A86BC] bg-white dark:bg-[#333436] text-[#0A86BC] dark:text-white hover:bg-[#0A86BC] hover:text-white dark:hover:bg-[#0A86BC] transition-colors duration-300 ease-in-out"
              >
                <span className={`transition-all duration-500 ease-in-out transform ${isChangingLanguage ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>
                  {t.customize}
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md dark:bg-[#333436] dark:text-white transition-all duration-500 ease-in-out">
              <DialogHeader>
                <DialogTitle className="dark:text-white transition-all duration-500 ease-in-out transform">
                  {t.dialogTitle}
                </DialogTitle>
                <DialogDescription className="dark:text-white/70 transition-all duration-500 ease-in-out">
                  {t.dialogDescription}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Textarea 
                  placeholder={t.textareaPlaceholder}
                  value={userDescription} 
                  onChange={e => setUserDescription(e.target.value)} 
                  className="min-h-[100px] w-full resize-y dark:bg-[#333436] dark:text-white dark:border-white/20 transition-all duration-500 ease-in-out" 
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className={`transition-all duration-700 ease-in-out transform ${isChangingLanguage ? 'scale-125 rotate-12' : 'scale-100 rotate-0'}`}>
          <div className="relative">
            <img 
              src="/lovable-uploads/945b103f-1b2a-43c4-aa80-bad9e06fc163.png" 
              alt="KSU AI Guide Logo Light" 
              className={`h-24 w-24 object-contain rounded-full border border-[#0EA5E9] dark:border-[#0EA5E9] transition-opacity duration-700 absolute top-0 left-0 ${isDarkMode || currentLanguage === 'العربية' ? 'opacity-0' : 'opacity-100'}`}
            />
            <img 
              src="/lovable-uploads/ee32ec28-41fb-41ce-aac3-bf3c9d4993eb.png" 
              alt="KSU AI Guide Logo Dark" 
              className={`h-24 w-24 object-contain rounded-full border border-[#0EA5E9] dark:border-[#0EA5E9] transition-all duration-700 ${isDarkMode && currentLanguage !== 'العربية' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            />
            <img 
              src={arabicLogoSrc}
              alt="KSU AI Guide Logo Arabic" 
              className={`h-24 w-24 object-contain rounded-full border border-[#0EA5E9] dark:border-[#0EA5E9] transition-all duration-700 absolute top-0 left-0 ${currentLanguage === 'العربية' ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-[#0EA5E9] dark:border-[#0EA5E9] bg-white dark:bg-[#333436]">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-[#0A86BC]" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-[#0A86BC] dark:text-white" />
            <Switch
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
              className="data-[state=checked]:bg-[#0A86BC]"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="px-4 py-2 h-10 flex items-center gap-2 rounded-full border border-[#0EA5E9] bg-white dark:bg-[#333436] text-[#0A86BC] dark:text-white hover:bg-[#0A86BC] hover:text-white dark:hover:bg-[#0A86BC] transition-colors duration-300 ease-in-out"
              >
                <Globe className="h-5 w-5" />
                <span className="transition-all duration-300 ease-in-out">{currentLanguage}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px] border border-[#0EA5E9] dark:border-[#0EA5E9] bg-white dark:bg-[#333436] shadow-lg animate-fade-in">
              <DropdownMenuItem 
                onClick={() => handleLanguageChange('English')} 
                className="hover:bg-[#0A86BC] hover:text-white focus:bg-[#0A86BC] focus:text-white dark:text-white"
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleLanguageChange('العربية')} 
                className="hover:bg-[#0A86BC] hover:text-white focus:bg-[#0A86BC] focus:text-white dark:text-white"
              >
                العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-background">
        {messages.map((msg, index) => <ChatMessage key={index} isBot={msg.isBot} message={msg.text} showFeedback={msg.showFeedback} animationDelay={index} />)}
        {isTyping && (
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#333436] flex items-center justify-center">
              <Bot className="w-5 h-5 stroke-black dark:stroke-white stroke-[1.5]" />
            </div>
            <div className="flex flex-col gap-2 max-w-[80%]">
              <div className="p-3 rounded-lg border border-black bg-gray-100 dark:bg-[#454546] dark:text-white dark:border-white/20">
                <TypingIndicator />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-4 bg-background">
        <div className="flex gap-2">
          <Input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyPress={handleKeyPress} 
            placeholder="Type your message..." 
            className="flex-1 text-black dark:text-white dark:bg-muted" 
          />
          <Button 
            onClick={handleSend} 
            className="rounded-full bg-white dark:bg-[#333436] text-[#0A86BC] dark:text-white hover:bg-[#0A86BC] hover:text-white dark:hover:bg-[#403E43] border border-[#0EA5E9] px-6 transition-colors duration-300 ease-in-out"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
