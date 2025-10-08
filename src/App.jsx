import React, { useState, useEffect, useCallback } from 'react';
import { ArrowPathIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

const pastelColors = [
    { bg: 'bg-[#f0f4f8]', text: 'text-[#2c5282]', authorText: 'text-[#4a69a5]' }, // Blue
    { bg: 'bg-[#f0fdf4]', text: 'text-[#276749]', authorText: 'text-[#4a8c6c]' }, // Green
    { bg: 'bg-[#fdf2f8]', text: 'text-[#97266d]', authorText: 'text-[#b44a8a]' }, // Pink
    { bg: 'bg-[#fff5f5]', text: 'text-[#9b2c2c]', authorText: 'text-[#b84e4e]' }, // Red
    { bg: 'bg-[#f6f5ff]', text: 'text-[#553c9a]', authorText: 'text-[#7961b3]' }, // Purple
    { bg: 'bg-[#fffaf0]', text: 'text-[#975a16]', authorText: 'text-[#b37d3d]' }, // Yellow/Orange
    { bg: 'bg-[#f0fcff]', text: 'text-[#0e7490]', authorText: 'text-[#3c9cb4]' }, // Teal
    { bg: 'bg-[#f5f7ff]', text: 'text-[#1e3a8a]', authorText: 'text-[#4460af]' }, // Deep Blue
    { bg: 'bg-[#f8f0fc]', text: 'text-[#86198f]', authorText: 'text-[#a643ae]' }, // Magenta
    { bg: 'bg-[#f0f9ff]', text: 'text-[#0369a1]', authorText: 'text-[#3389bb]' }, // Sky Blue
];

const App = () => {
    const [quote, setQuote] = useState({ quote: '', author: '' });
    const [colorScheme, setColorScheme] = useState(pastelColors[0]);
    const [quotes, setQuotes] = useState([]);
    const [copied, setCopied] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [contentLoaded, setContentLoaded] = useState(false);

    const updateQuote = useCallback(() => {
        if (!quotes.length) return;
        
        setIsRefreshing(true);
        
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomColorIndex = Math.floor(Math.random() * pastelColors.length);
        
        // First fade out current quote
        const quoteElement = document.querySelector('.quote-text');
        quoteElement?.classList.add('fade-out');
        
        // Wait for fade out, then update quote and fade in
        setTimeout(() => {
            setQuote(quotes[randomIndex]);
            setColorScheme(pastelColors[randomColorIndex]);
            
            // Allow DOM to update with new quote
            setTimeout(() => {
                quoteElement?.classList.remove('fade-out');
                setIsRefreshing(false);
            }, 50);
        }, 300); // Match the CSS transition duration
    }, [quotes]);

    const loadQuotes = useCallback(async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/matthewjdoyle/quotation/main/new_quotes.csv?dl=1');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.text();
            const lines = data.split('\n').filter(line => line.trim() !== '');
            const parsedQuotes = lines.slice(1).map(row => {
                const matches = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
                if (matches && matches.length >= 2) {
                    return {
                        quote: matches[0].replace(/"/g, ''),
                        author: matches[1].replace(/"/g, '')
                    };
                }
                return null;
            }).filter(quote => quote !== null);

            setQuotes(parsedQuotes);
            // Get initial random quote
            const randomIndex = Math.floor(Math.random() * parsedQuotes.length);
            const randomColorIndex = Math.floor(Math.random() * pastelColors.length);
            setQuote(parsedQuotes[randomIndex]);
            setColorScheme(pastelColors[randomColorIndex]);
            
            // Only mark content as loaded after we have a quote
            setContentLoaded(true);
            
            // Remove initial load flag after content is loaded
            setTimeout(() => setInitialLoad(false), 100);
        } catch (error) {
            console.error('Error loading quotes:', error);
            const fallbackQuote = {
                quote: 'The best preparation for tomorrow is doing your best today',
                author: 'H. Jackson Brown Jr.'
            };
            setQuotes([fallbackQuote]);
            setQuote(fallbackQuote);
            setContentLoaded(true);
            setTimeout(() => setInitialLoad(false), 100);
        }
    }, []);

    const handleCopy = async () => {
        const textToCopy = `"${quote.quote}" - ${quote.author}\n\nFrom: ${window.location.href}`;
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    useEffect(() => {
        loadQuotes();
    }, [loadQuotes]);

    return (
        <div className={`min-h-screen w-full ${colorScheme.bg} transition-colors duration-500`}>
            {/* Corner Links */}
            <div className="fixed top-4 left-4">
                <a href="https://matthewjdoyle.github.io" 
                   className={`${colorScheme.authorText} text-xs sm:text-sm hover:opacity-75 transition-opacity`}
                   target="_blank" 
                   rel="noopener noreferrer">
                    made by matthewjdoyle
                </a>
            </div>
            <div className="fixed top-4 right-4">
                <a href="https://ko-fi.com/matthewjdoyle" 
                   className={`${colorScheme.authorText} text-xs sm:text-sm hover:opacity-75 transition-opacity`}
                   target="_blank" 
                   rel="noopener noreferrer">
                    buy me a coffee
                </a>
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center min-h-screen p-2 sm:p-4 md:p-6">
                <div className={`w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-3xl mx-auto text-center space-y-4 sm:space-y-6 ${initialLoad ? 'page-enter page-enter-active' : ''}`}>
                    {contentLoaded && (
                        <div className="quote-container px-2 sm:px-4">
                            <div className={`quote-text ${contentLoaded ? 'text-reveal' : ''}`}>
                                <p className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl ${colorScheme.text} leading-relaxed sm:leading-relaxed md:leading-relaxed lg:leading-relaxed quote-line`}>
                                    "{quote.quote}"
                                </p>
                                <p className={`text-lg sm:text-xl md:text-2xl lg:text-3xl ${colorScheme.authorText} italic mt-2 sm:mt-3 md:mt-4 author-line`}>
                                    - {quote.author}
                                </p>
                            </div>
                        </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className={`flex justify-center space-x-4 mt-8 ${contentLoaded ? 'buttons-reveal' : 'opacity-0'}`}>
                        <button
                            onClick={updateQuote}
                            disabled={isRefreshing}
                            className={`${colorScheme.text} p-1 sm:p-2 rounded-full hover:bg-gray-100/60 transition-colors`}
                            aria-label="Refresh quote">
                            <ArrowPathIcon className={`h-5 w-5 sm:h-6 sm:w-6 ${isRefreshing ? 'spin-button' : ''}`} />
                        </button>
                        <button
                            onClick={handleCopy}
                            className={`${colorScheme.text} p-1 sm:p-2 rounded-full hover:bg-gray-100/60 transition-colors`}
                            aria-label="Copy quote">
                            <ClipboardDocumentIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>
                    </div>
                    
                    {/* Copy Confirmation */}
                    {copied && (
                        <div className={`${colorScheme.authorText} text-xs sm:text-sm mt-2`}>
                            Copied to clipboard!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App; 