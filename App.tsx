
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { PromptDisplay } from './components/PromptDisplay';
import { Loader } from './components/Loader';
import { generatePromptFromImage } from './services/geminiService';
import { fileToBase64 } from './utils/imageUtils';
import { SparklesIcon } from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const handleImageChange = useCallback(async (file: File) => {
    setImageFile(file);
    setGeneratedPrompt('');
    setError('');
    setImageMimeType(file.type);
    try {
        const base64 = await fileToBase64(file);
        setImageBase64(base64);
    } catch (err) {
        setError('Failed to read image file.');
        setImageBase64(null);
        setImageFile(null);
    }
  }, []);

  const handleGeneratePrompt = async () => {
    if (!imageBase64 || !imageMimeType) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedPrompt('');

    try {
      const prompt = await generatePromptFromImage(imageBase64, imageMimeType);
      setGeneratedPrompt(prompt);
    } catch (err) {
      if (err instanceof Error) {
          setError(`Failed to generate prompt: ${err.message}. Please check your API key and try again.`);
      } else {
          setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setImageBase64(null);
    setImageMimeType(null);
    setGeneratedPrompt('');
    setError('');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans">
      <header className="w-full max-w-5xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Image to Prompt Generator
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Upload an image to get a creative prompt for your next AI masterpiece.</p>
      </header>

      <main className="w-full max-w-5xl flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2 flex flex-col gap-6">
          <ImageUploader 
            onImageUpload={handleImageChange} 
            imagePreviewUrl={imageFile ? URL.createObjectURL(imageFile) : null}
            onReset={handleReset}
          />
          {imageFile && (
            <button
              onClick={handleGeneratePrompt}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {isLoading ? (
                <>
                  <Loader />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon />
                  Generate Prompt
                </>
              )}
            </button>
          )}
        </div>
        
        <div className="lg:w-1/2">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {!generatedPrompt && !isLoading && (
              <div className="h-full flex items-center justify-center bg-gray-800/50 rounded-lg p-6 border-2 border-dashed border-gray-700">
                <div className="text-center text-gray-500">
                  <SparklesIcon className="mx-auto h-12 w-12" />
                  <p className="mt-2 text-lg">Your generated prompt will appear here.</p>
                </div>
              </div>
            )}
            
            {isLoading && (
              <div className="h-full flex items-center justify-center bg-gray-800/50 rounded-lg p-6 border-2 border-dashed border-gray-700 min-h-[200px]">
                <div className="text-center text-gray-400">
                  <Loader />
                  <p className="mt-4 text-lg">Analyzing your image, please wait...</p>
                </div>
              </div>
            )}
            
            {generatedPrompt && !isLoading && (
              <PromptDisplay prompt={generatedPrompt} />
            )}
        </div>
      </main>
    </div>
  );
};

export default App;
