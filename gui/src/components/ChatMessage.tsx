import React, { useState } from 'react';
import { User, Bot, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "./ui/button";

interface ChatMessageProps {
  isBot: boolean;
  message: string;
  showFeedback?: boolean;
  animationDelay?: number;
}

const ChatMessage = ({ isBot, message, showFeedback, animationDelay = 0 }: ChatMessageProps) => {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);

  const handleFeedback = (isPositive: boolean) => {
    setFeedback(isPositive ? 'positive' : 'negative');
    console.log(`Feedback ${isPositive ? 'positive' : 'negative'} received`);
  };

  const animationClass = `animate-fade-in [animation-delay:${animationDelay * 100}ms]`;

  return (
    <div className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'} mb-4 ${animationClass}`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#333436] flex items-center justify-center">
          <Bot 
            className="w-5 h-5 stroke-black dark:stroke-white stroke-[1.5]" 
          />
        </div>
      )}
      <div className={`flex flex-col gap-2 ${isBot ? 'max-w-[80%]' : 'max-w-[80%]'}`}>
        <div
          className={`p-3 rounded-lg transition-all duration-300 break-words whitespace-pre-wrap ${
            isBot
              ? 'bg-gray-100 dark:bg-[#454546] text-black dark:text-white border border-[#0EA5E9]'
              : 'bg-[#1B5D97] text-white'
          }`}
        >
          {message}
        </div>
        {isBot && showFeedback && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFeedback(true)}
              className={`h-8 px-2 transition-all duration-300 hover:scale-105 dark:bg-[#454546] dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 ${
                feedback === 'positive' ? 'bg-transparent border-[#0EA5E9] fill-[#0EA5E9] animate-[scale-in_0.2s_ease-out]' : ''
              }`}
            >
              <ThumbsUp className={`h-4 w-4 transition-all duration-300 ${feedback === 'positive' ? 'fill-[#0EA5E9] stroke-[#0EA5E9] animate-[bounce_0.5s_ease-out]' : 'dark:text-white'}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFeedback(false)}
              className={`h-8 px-2 transition-all duration-300 hover:scale-105 dark:bg-[#454546] dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 ${
                feedback === 'negative' ? 'bg-transparent border-[#0EA5E9] fill-[#0EA5E9] animate-[scale-in_0.2s_ease-out]' : ''
              }`}
            >
              <ThumbsDown className={`h-4 w-4 transition-all duration-300 ${feedback === 'negative' ? 'fill-[#0EA5E9] stroke-[#0EA5E9] animate-[bounce_0.5s_ease-out]' : 'dark:text-white'}`} />
            </Button>
          </div>
        )}
      </div>
      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-[#333436] flex items-center justify-center">
          <User className="w-5 h-5 text-white stroke-black dark:stroke-white stroke-[1.5]" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
