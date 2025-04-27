
import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      <div className="w-1.5 h-1.5 bg-[#0A86BC] dark:bg-white rounded-full animate-[bounce_1s_infinite_0ms]"></div>
      <div className="w-1.5 h-1.5 bg-[#0A86BC] dark:bg-white rounded-full animate-[bounce_1s_infinite_200ms]"></div>
      <div className="w-1.5 h-1.5 bg-[#0A86BC] dark:bg-white rounded-full animate-[bounce_1s_infinite_400ms]"></div>
    </div>
  );
};

export default TypingIndicator;
