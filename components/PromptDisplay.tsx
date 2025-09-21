
import React, { useState } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';

interface PromptDisplayProps {
  prompt: string;
}

export const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompt }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg shadow-inner relative border border-gray-700 h-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-300">Generated Prompt</h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-2 px-3 rounded-md transition-colors text-sm"
        >
          {isCopied ? <CheckIcon /> : <ClipboardIcon />}
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="bg-gray-900 p-4 rounded-md h-full max-h-96 overflow-y-auto">
        <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
          {prompt}
        </p>
      </div>
    </div>
  );
};
