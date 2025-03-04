import React, { useState, useEffect, useCallback } from 'react';
import { ArrowPathIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

const pastelColors = [
    { bg: 'bg-[#f0f4f8]', text: 'text-[#2c5282]' }, // Blue
    { bg: 'bg-[#f0fdf4]', text: 'text-[#276749]' }, // Green
    { bg: 'bg-[#fdf2f8]', text: 'text-[#97266d]' }, // Pink
    { bg: 'bg-[#fff5f5]', text: 'text-[#9b2c2c]' }, // Red
    { bg: 'bg-[#f6f5ff]', text: 'text-[#553c9a]' }  // Purple
];

const App = () => {
    const [quote, setQuote] = useState({ quote: '', author: '' });
    const [colorScheme, setColorScheme] = useState(pastelColors[0]);
    const [quotes, setQuotes] = useState([]);
    const [copied, setCopied] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

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
            const response = await fetch('https://raw.githubusercontent.com/matthewjdoyle/quotation/main/quotes.csv?dl=1');
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
        } catch (error) {
            console.error('Error loading quotes:', error);
            const fallbackQuote = {
                quote: 'The best preparation for tomorrow is doing your best today',
                author: 'H. Jackson Brown Jr.'
            };
            setQuotes([fallbackQuote]);
            setQuote(fallbackQuote);
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
        // Remove initial load flag after first render
        setTimeout(() => setInitialLoad(false), 100);
    }, [loadQuotes]);

    return (
        <div className={`min-h-screen w-full ${colorScheme.bg} transition-colors duration-500`}>
            {/* Corner Links */}
            <div className="fixed top-4 left-4">
                <a href="https://matthewjdoyle.github.io" 
                   className={`${colorScheme.text} hover:opacity-75 transition-opacity`}
                   target="_blank" 
                   rel="noopener noreferrer">
                    matthewjdoyle
                </a>
            </div>
            <div className="fixed top-4 right-4">
                <a href="https://ko-fi.com/matthewjdoyle" 
                   className={`${colorScheme.text} hover:opacity-75 transition-opacity`}
                   target="_blank" 
                   rel="noopener noreferrer">
                    buy me a coffee
                </a>
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className={`max-w-3xl mx-auto text-center space-y-6 ${initialLoad ? 'page-enter page-enter-active' : ''}`}>
                    <div className="quote-container">
                        <div className="quote-text">
                            <p className={`text-2xl md:text-4xl ${colorScheme.text} leading-relaxed`}>
                                "{quote.quote}"
                            </p>
                            <p className={`text-xl md:text-2xl ${colorScheme.text} italic`}>
                                - {quote.author}
                            </p>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4 mt-8">
                        <button
                            onClick={updateQuote}
                            disabled={isRefreshing}
                            className={`${colorScheme.text} p-2 rounded-full hover:bg-gray-100 transition-colors`}
                            aria-label="Refresh quote">
                            <ArrowPathIcon className={`h-6 w-6 ${isRefreshing ? 'spin-button' : ''}`} />
                        </button>
                        <button
                            onClick={handleCopy}
                            className={`${colorScheme.text} p-2 rounded-full hover:bg-gray-100 transition-colors`}
                            aria-label="Copy quote">
                            <ClipboardDocumentIcon className="h-6 w-6" />
                        </button>
                    </div>
                    
                    {/* Copy Confirmation */}
                    {copied && (
                        <div className={`${colorScheme.text} text-sm mt-2`}>
                            Copied to clipboard!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App; 