import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowPathIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

const colorSchemes = [
    { 
        name: 'baby-pink',
        base: '#ff99c8', 
        mesh1: '#ffc2d1', 
        mesh2: '#ffe5ec',
        text: 'text-[#9d174d]', 
        authorText: 'text-[#be185d]' 
    },
    { 
        name: 'lemon-chiffon',
        base: '#fcf6bd', 
        mesh1: '#fdf9d8', 
        mesh2: '#fffef0',
        text: 'text-[#854d0e]', 
        authorText: 'text-[#a16207]' 
    },
    { 
        name: 'frosted-mint',
        base: '#d0f4de', 
        mesh1: '#e4f9ec', 
        mesh2: '#f0fff4',
        text: 'text-[#166534]', 
        authorText: 'text-[#15803d]' 
    },
    { 
        name: 'icy-blue',
        base: '#a9def9', 
        mesh1: '#c5e9fb', 
        mesh2: '#e1f4fd',
        text: 'text-[#075985]', 
        authorText: 'text-[#0369a1]' 
    },
    { 
        name: 'mauve',
        base: '#e4c1f9', 
        mesh1: '#edd7fc', 
        mesh2: '#f5eaff',
        text: 'text-[#6b21a8]', 
        authorText: 'text-[#7e22ce]' 
    },
    { 
        name: 'tea-green',
        base: '#ccd5ae', 
        mesh1: '#dce2c8', 
        mesh2: '#ebf0db',
        text: 'text-[#3f6212]', 
        authorText: 'text-[#4d7c0f]' 
    },
    { 
        name: 'beige',
        base: '#e9edc9', 
        mesh1: '#f1f4dc', 
        mesh2: '#f8faeb',
        text: 'text-[#3f6212]', 
        authorText: 'text-[#4d7c0f]' 
    },
    { 
        name: 'cornsilk',
        base: '#fefae0', 
        mesh1: '#fffcf0', 
        mesh2: '#ffffff',
        text: 'text-[#854d0e]', 
        authorText: 'text-[#a16207]' 
    },
    { 
        name: 'papaya-whip',
        base: '#faedcd', 
        mesh1: '#fdf4e3', 
        mesh2: '#fffaf0',
        text: 'text-[#92400e]', 
        authorText: 'text-[#b45309]' 
    },
    { 
        name: 'light-bronze',
        base: '#d4a373', 
        mesh1: '#e2bc96', 
        mesh2: '#f0d5ba',
        text: 'text-[#451a03]', 
        authorText: 'text-[#78350f]' 
    },
];

const fontPairs = [
    { quote: "'EB Garamond', serif", author: "'Montserrat', sans-serif" },
    { quote: "'Lora', serif", author: "'Tenor Sans', sans-serif" },
    { quote: "'Cormorant Garamond', serif", author: "'Public Sans', sans-serif" },
    { quote: "'Gilda Display', serif", author: "'Inter', sans-serif" },
    { quote: "'Libre Baskerville', serif", author: "'Montserrat', sans-serif" },
    { quote: "'Bodoni Moda', serif", author: "'IBM Plex Mono', monospace" },
    { quote: "'Cormorant Upright', serif", author: "'Syne', sans-serif" },
    { quote: "'Crimson Pro', serif", author: "'Public Sans', sans-serif" },
    { quote: "'Quill', serif", author: "'OSRS-Plain', monospace" },
    { quote: "'Quill8', serif", author: "'OSRS-Plain-11', monospace" },
    { quote: "'Quill', serif", author: "'Quill8', serif" }
];

const authorPrefixes = [
    { label: 'Dash', value: '— ' },
    { label: 'Written', value: 'as written by ' },
    { label: 'Spoken', value: 'as spoken by ' },
    { label: 'Arrow', value: '> ' },
    { label: 'Tilde', value: '~ ' },
    { label: 'None', value: '' }
];

const Typewriter = ({ text, speed = 25, delay = 0, active = true, onComplete, className, style }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isStarted, setIsStarted] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const timerRef = useRef(null);
    const onCompleteRef = useRef(onComplete);

    // Keep the ref updated with the latest callback
    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        if (!active) {
            setDisplayedText('');
            setIsStarted(false);
            setIsComplete(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }
        
        setDisplayedText('');
        setIsStarted(false);
        setIsComplete(false);
        if (timerRef.current) clearInterval(timerRef.current);

        const startTimer = setTimeout(() => {
            setIsStarted(true);
            let i = 0;
            timerRef.current = setInterval(() => {
                if (i < text.length) {
                    setDisplayedText(text.substring(0, i + 1));
                    i++;
                } else {
                    setIsComplete(true);
                    clearInterval(timerRef.current);
                    if (onCompleteRef.current) onCompleteRef.current();
                }
            }, speed);
        }, delay);

        return () => {
            clearTimeout(startTimer);
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [text, speed, delay, active]); // removed onComplete from dependencies to prevent restart

    return (
        <span className={`${className} ${isStarted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`} style={style}>
            {displayedText}
            {isStarted && !isComplete && <span className="animate-pulse ml-0.5 border-l-2 border-current h-[1em]"></span>}
        </span>
    );
};

const App = () => {
    const [quote, setQuote] = useState({ quote: '', author: '' });
    const [colorScheme, setColorScheme] = useState(colorSchemes[0]);
    const [quotes, setQuotes] = useState([]);
    const [copied, setCopied] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isQuoteDone, setIsQuoteDone] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [contentLoaded, setContentLoaded] = useState(false);
    const [currentFontPair, setCurrentFontPair] = useState(fontPairs[0]);
    
    // Style settings
    const [showQuotes, setShowQuotes] = useState(true);
    const [prefixIndex, setPrefixIndex] = useState(0);
    const [showSettings, setShowSettings] = useState(false);

    const updateQuote = useCallback(() => {
        if (!quotes.length || isTransitioning) return;
        
        setIsTransitioning(true);
        setIsRefreshing(true);
        setIsQuoteDone(false);
        
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomColorIndex = Math.floor(Math.random() * colorSchemes.length);
        const randomFontIndex = Math.floor(Math.random() * fontPairs.length);
        
        // Short pause to allow the old text to "clear" via the typewriter reset
        setTimeout(() => {
            setQuote(quotes[randomIndex]);
            setColorScheme(colorSchemes[randomColorIndex]);
            setCurrentFontPair(fontPairs[randomFontIndex]);
            
            // Re-activate typing
            setTimeout(() => {
                setIsTransitioning(false);
                setIsRefreshing(false);
            }, 50);
        }, 400); 
    }, [quotes, isTransitioning]);

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
            const randomIndex = Math.floor(Math.random() * parsedQuotes.length);
            const randomColorIndex = Math.floor(Math.random() * colorSchemes.length);
            const randomFontIndex = Math.floor(Math.random() * fontPairs.length);
            
            setQuote(parsedQuotes[randomIndex]);
            setColorScheme(colorSchemes[randomColorIndex]);
            setCurrentFontPair(fontPairs[randomFontIndex]);
            
            setContentLoaded(true);
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
        const quoteContent = showQuotes ? `"${quote.quote}"` : quote.quote;
        const authorContent = `${authorPrefixes[prefixIndex].value}${quote.author}`;
        const textToCopy = `${quoteContent} ${authorContent}\n\nFrom: ${window.location.href}`;
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    const cyclePrefix = () => {
        setPrefixIndex((prev) => (prev + 1) % authorPrefixes.length);
    };

    useEffect(() => {
        loadQuotes();
    }, [loadQuotes]);

    const meshStyle = {
        backgroundColor: colorScheme.base,
        backgroundImage: `
            radial-gradient(circle at 15% 25%, ${colorScheme.mesh1} 0%, transparent 65%),
            radial-gradient(circle at 85% 15%, ${colorScheme.mesh2} 0%, transparent 75%),
            radial-gradient(circle at 45% 85%, ${colorScheme.mesh1} 0%, transparent 70%),
            radial-gradient(circle at 85% 85%, ${colorScheme.mesh2} 0%, transparent 60%),
            radial-gradient(circle at 50% 50%, ${colorScheme.base} 0%, transparent 85%),
            radial-gradient(circle at 10% 75%, ${colorScheme.mesh2} 0%, transparent 65%)
        `,
        transition: 'all 2.5s cubic-bezier(0.23, 1, 0.32, 1)'
    };

    return (
        <div style={meshStyle} className="min-h-screen w-full relative overflow-hidden font-sans antialiased">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none noise-bg"></div>
            
            {/* Corner Links */}
            <div className="fixed top-4 left-4 z-10">
                <a href="https://matthewd0yle.com" 
                   className={`${colorScheme.authorText} opacity-40 text-xs sm:text-sm hover:opacity-100 transition-opacity font-medium tracking-tight`}
                   target="_blank" 
                   rel="noopener noreferrer">
                    made by matthewjdoyle
                </a>
            </div>
            <div className="fixed top-4 right-4 z-10">
                <a href="https://ko-fi.com/matthewjdoyle" 
                   className={`${colorScheme.authorText} opacity-40 text-xs sm:text-sm hover:opacity-100 transition-opacity font-medium tracking-tight`}
                   target="_blank" 
                   rel="noopener noreferrer">
                    buy me a coffee
                </a>
            </div>

            {/* Main Content */}
            <div className="relative flex flex-col items-center justify-center min-h-screen p-6 sm:p-12">
                <div className={`w-full max-w-4xl mx-auto text-center space-y-8 sm:space-y-12 ${initialLoad ? 'page-enter page-enter-active' : ''}`}>
                    {contentLoaded && (
                        <div className="quote-container px-4">
                            <div className={`quote-content-wrapper min-h-[200px] flex flex-col items-center justify-center`}>
                                <div 
                                    style={{ fontFamily: currentFontPair.quote }}
                                    className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl ${colorScheme.text} leading-tight sm:leading-tight md:leading-tight lg:leading-tight italic quote-line`}>
                                    {showQuotes && !isTransitioning && <span className="mr-1 opacity-50">"</span>}
                                    <Typewriter 
                                        text={quote.quote} 
                                        speed={25} 
                                        active={!isTransitioning}
                                        onComplete={() => setIsQuoteDone(true)}
                                    />
                                    {showQuotes && !isTransitioning && <span className="ml-1 opacity-50">"</span>}
                                </div>
                                <div 
                                    style={{ fontFamily: currentFontPair.author }}
                                    className={`text-xl sm:text-2xl md:text-3xl ${colorScheme.authorText} uppercase tracking-[0.2em] mt-6 sm:mt-10 opacity-80 author-line`}>
                                    <Typewriter 
                                        text={`${authorPrefixes[prefixIndex].value}${quote.author}`} 
                                        speed={30} 
                                        delay={100}
                                        active={!isTransitioning && isQuoteDone} 
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="relative flex flex-col items-center gap-8 mt-12 buttons-reveal">
                                <div className="flex justify-center items-center space-x-6">
                                    <button
                                        onClick={updateQuote}
                                        disabled={isRefreshing}
                                        className={`${colorScheme.text} p-3 rounded-full hover:bg-white/40 hover:scale-110 active:scale-95 transition-all duration-500 backdrop-blur-sm`}
                                        aria-label="Refresh quote">
                                        <ArrowPathIcon className={`h-6 w-6 sm:h-8 sm:w-8 ${isRefreshing ? 'spin-button' : ''}`} />
                                    </button>

                                    <button
                                        onClick={() => setShowSettings(!showSettings)}
                                        className={`${colorScheme.text} p-3 rounded-full ${showSettings ? 'bg-white/50 scale-110' : 'hover:bg-white/40'} hover:scale-110 active:scale-95 transition-all duration-500 backdrop-blur-sm`}
                                        aria-label="Style settings">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 sm:h-8 sm:w-8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-9.75 0h9.75" />
                                        </svg>
                                    </button>

                                    <button
                                        onClick={handleCopy}
                                        className={`${colorScheme.text} p-3 rounded-full hover:bg-white/40 hover:scale-110 active:scale-95 transition-all duration-500 backdrop-blur-sm`}
                                        aria-label="Copy quote">
                                        <ClipboardDocumentIcon className="h-6 w-6 sm:h-8 sm:w-8" />
                                    </button>
                                </div>

                                {/* Style Settings Panel */}
                                <div className={`flex flex-wrap justify-center gap-4 transition-all duration-700 overflow-hidden ${showSettings ? 'max-h-24 opacity-100 transform translate-y-0' : 'max-h-0 opacity-0 transform translate-y-4'}`}>
                                    <div className="flex bg-white/30 backdrop-blur-md rounded-2xl p-1.5 shadow-sm border border-white/20">
                                        <button 
                                            onClick={() => setShowQuotes(!showQuotes)}
                                            className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-500 ${showQuotes ? 'bg-white shadow-sm text-gray-800' : 'text-gray-600 hover:bg-white/40'}`}>
                                            Marks {showQuotes ? 'On' : 'Off'}
                                        </button>
                                        <div className="w-px bg-gray-400/20 mx-1 my-1"></div>
                                        <button 
                                            onClick={cyclePrefix}
                                            className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-500 text-gray-800 hover:bg-white/40 active:bg-white/60`}>
                                            Prefix: <span className="opacity-60">{authorPrefixes[prefixIndex].label}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Copy Confirmation */}
                    {copied && (
                        <div className={`${colorScheme.authorText} text-xs sm:text-sm mt-4 font-medium tracking-wide animate-bounce`}>
                            Copied to clipboard!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;