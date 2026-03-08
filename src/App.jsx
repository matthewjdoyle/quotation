import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowPathIcon, ClipboardDocumentIcon, CameraIcon } from '@heroicons/react/24/outline';
import { toPng } from 'html-to-image';

function blobToDataURL(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

let fontCSSCache = null;

async function buildFontEmbedCSS() {
    if (fontCSSCache) return fontCSSCache;

    const parts = [];

    // Embed Google Fonts by fetching the CSS and inlining woff2 files
    const linkEl = document.querySelector('link[href*="fonts.googleapis.com"]');
    if (linkEl) {
        try {
            const resp = await fetch(linkEl.href);
            let css = await resp.text();
            const urls = [...new Set(
                [...css.matchAll(/url\(([^)]+)\)/g)].map(m => m[1])
            )];
            const results = await Promise.all(urls.map(async (url) => {
                try {
                    const r = await fetch(url);
                    const blob = await r.blob();
                    return [url, await blobToDataURL(blob)];
                } catch {
                    return [url, url];
                }
            }));
            for (const [original, replacement] of results) {
                css = css.split(original).join(replacement);
            }
            parts.push(css);
        } catch (e) {
            console.warn('Could not embed Google Fonts:', e);
        }
    }

    // Embed local @font-face rules from same-origin stylesheets
    for (const sheet of document.styleSheets) {
        try {
            for (const rule of sheet.cssRules) {
                if (rule instanceof CSSFontFaceRule) {
                    const family = rule.style.getPropertyValue('font-family');
                    if (!family) continue;
                    let ruleText = rule.cssText;
                    const urlMatch = ruleText.match(/url\("?([^")\s]+)"?\)/);
                    if (urlMatch) {
                        try {
                            const r = await fetch(urlMatch[1]);
                            const blob = await r.blob();
                            const dataURL = await blobToDataURL(blob);
                            ruleText = ruleText.replace(urlMatch[0], `url(${dataURL})`);
                        } catch {
                            // keep original URL
                        }
                    }
                    parts.push(ruleText);
                }
            }
        } catch {
            // skip cross-origin stylesheets
        }
    }

    fontCSSCache = parts.join('\n');
    return fontCSSCache;
}

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
    { 
        name: 'bubblegum-pink',
        base: '#ef476f', 
        mesh1: '#f47a96', 
        mesh2: '#f9adbd',
        text: 'text-[#fff1f3]', 
        authorText: 'text-[#ffe4e8]' 
    },
    { 
        name: 'golden-pollen',
        base: '#ffd166', 
        mesh1: '#ffdd8a', 
        mesh2: '#ffe9ae',
        text: 'text-[#5c3d00]', 
        authorText: 'text-[#7a5200]' 
    },
    { 
        name: 'emerald',
        base: '#06d6a0', 
        mesh1: '#4de4bc', 
        mesh2: '#93f0d8',
        text: 'text-[#003d2e]', 
        authorText: 'text-[#00563f]' 
    },
    { 
        name: 'ocean-blue',
        base: '#118ab2', 
        mesh1: '#3da5c8', 
        mesh2: '#6dc0de',
        text: 'text-[#e6f5fb]', 
        authorText: 'text-[#d0ecf6]' 
    },
    { 
        name: 'dark-teal',
        base: '#073b4c', 
        mesh1: '#0e5a73', 
        mesh2: '#1a7a99',
        text: 'text-[#c5eaf6]', 
        authorText: 'text-[#a0dbed]' 
    },
    { 
        name: 'honey-bronze',
        base: '#f6bd60', 
        mesh1: '#f8cd83', 
        mesh2: '#fadda7',
        text: 'text-[#5c3d00]', 
        authorText: 'text-[#7a5200]' 
    },
    { 
        name: 'linen',
        base: '#f7ede2', 
        mesh1: '#faf4ed', 
        mesh2: '#fdfaf7',
        text: 'text-[#5c4033]', 
        authorText: 'text-[#7a5545]' 
    },
    { 
        name: 'cotton-rose',
        base: '#f5cac3', 
        mesh1: '#f8dad5', 
        mesh2: '#fbeae7',
        text: 'text-[#7a2e26]', 
        authorText: 'text-[#9c3b32]' 
    },
    { 
        name: 'muted-teal',
        base: '#84a59d', 
        mesh1: '#a0bbb5', 
        mesh2: '#bdd1cc',
        text: 'text-[#1a332d]', 
        authorText: 'text-[#2a4a42]' 
    },
    { 
        name: 'light-coral',
        base: '#f28482', 
        mesh1: '#f5a3a1', 
        mesh2: '#f8c1c0',
        text: 'text-[#4a0e0d]', 
        authorText: 'text-[#6b1514]' 
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

const quotationMarks = [
    { label: 'None', open: '', close: '' },
    { label: 'Double', open: '\u201C', close: '\u201D' },
    { label: 'Single', open: '\u2018', close: '\u2019' },
    { label: 'Guillemet', open: '\u00AB\u00A0', close: '\u00A0\u00BB' },
    { label: 'Angle', open: '\u2039\u00A0', close: '\u00A0\u203A' },
    { label: 'Corner', open: '\u300C', close: '\u300D' },
    { label: 'Straight', open: '"', close: '"' },
];

const authorPrefixes = [
    { label: 'Arrow', value: '> ' },
    { label: 'Dash', value: '— ' },
    { label: 'Tilde', value: '~ ' },
    { label: 'Slash', value: '/ ' },
    { label: 'Pipe', value: '| ' },
    { label: 'Bullet', value: '\u2022 ' },
    { label: 'By', value: 'by ' },
    { label: 'Written', value: 'as written by ' },
    { label: 'Spoken', value: 'as spoken by ' },
    { label: 'Attr', value: 'attributed to ' },
    { label: 'None', value: '' },
];

const exportSizes = [
    { label: 'Auto', width: null, height: null },
    { label: '1080×1080', width: 1080, height: 1080 },
    { label: '1920×1080', width: 1920, height: 1080 },
    { label: '1080×1920', width: 1080, height: 1920 },
    { label: '1170×2532', width: 1170, height: 2532 },
    { label: '1290×2796', width: 1290, height: 2796 },
    { label: '1440×3120', width: 1440, height: 3120 },
    { label: '4K', width: 3840, height: 2160 },
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
    
    // Style settings (persisted to localStorage)
    const [marksIndex, setMarksIndex] = useState(() => {
        const saved = localStorage.getItem('quotation-marksIndex');
        const parsed = saved !== null ? JSON.parse(saved) : 0;
        return parsed >= 0 && parsed < quotationMarks.length ? parsed : 0;
    });
    const [prefixIndex, setPrefixIndex] = useState(() => {
        const saved = localStorage.getItem('quotation-prefixIndex');
        const parsed = saved !== null ? JSON.parse(saved) : 0;
        return parsed >= 0 && parsed < authorPrefixes.length ? parsed : 0;
    });
    const [showSettings, setShowSettings] = useState(false);
    const [screenshotting, setScreenshotting] = useState(false);
    const [exportSizeIndex, setExportSizeIndex] = useState(() => {
        const saved = localStorage.getItem('quotation-exportSizeIndex');
        const parsed = saved !== null ? JSON.parse(saved) : 0;
        return parsed >= 0 && parsed < exportSizes.length ? parsed : 0;
    });

    useEffect(() => { localStorage.setItem('quotation-marksIndex', JSON.stringify(marksIndex)); }, [marksIndex]);
    useEffect(() => { localStorage.setItem('quotation-prefixIndex', JSON.stringify(prefixIndex)); }, [prefixIndex]);
    useEffect(() => { localStorage.setItem('quotation-exportSizeIndex', JSON.stringify(exportSizeIndex)); }, [exportSizeIndex]);

    const screenshotRef = useRef(null);

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
        const marks = quotationMarks[marksIndex];
        const quoteContent = marks.open ? `${marks.open}${quote.quote}${marks.close}` : quote.quote;
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

    const handleScreenshot = async () => {
        if (!screenshotRef.current) return;
        setScreenshotting(true);
        try {
            const fontEmbedCSS = await buildFontEmbedCSS();
            const size = exportSizes[exportSizeIndex];

            if (!size.width) {
                // Auto mode — capture as-is
                const dataUrl = await toPng(screenshotRef.current, {
                    pixelRatio: 2,
                    fontEmbedCSS,
                });
                const link = document.createElement('a');
                link.download = `quote-${Date.now()}.png`;
                link.href = dataUrl;
                link.click();
            } else {
                // Fixed size — capture then center on a sized canvas
                const dataUrl = await toPng(screenshotRef.current, {
                    pixelRatio: 2,
                    fontEmbedCSS,
                });
                const img = new Image();
                img.src = dataUrl;
                await new Promise((resolve) => { img.onload = resolve; });

                const canvas = document.createElement('canvas');
                canvas.width = size.width;
                canvas.height = size.height;
                const ctx = canvas.getContext('2d');

                // Fill with the current background color
                ctx.fillStyle = colorScheme.base;
                ctx.fillRect(0, 0, size.width, size.height);

                // Scale the quote image to fit within the canvas with padding
                const padding = 0.1;
                const maxW = size.width * (1 - padding * 2);
                const maxH = size.height * (1 - padding * 2);
                const scale = Math.min(maxW / img.width, maxH / img.height, 1);
                const drawW = img.width * scale;
                const drawH = img.height * scale;
                const x = (size.width - drawW) / 2;
                const y = (size.height - drawH) / 2;
                ctx.drawImage(img, x, y, drawW, drawH);

                const link = document.createElement('a');
                link.download = `quote-${size.label.toLowerCase().replace('×', 'x')}-${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
        } catch (err) {
            console.error('Failed to capture screenshot:', err);
        } finally {
            setTimeout(() => setScreenshotting(false), 1500);
        }
    };

    const cyclePrefix = () => {
        setPrefixIndex((prev) => (prev + 1) % authorPrefixes.length);
    };

    useEffect(() => {
        loadQuotes();
        buildFontEmbedCSS(); // pre-cache fonts for screenshot
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
                            <div ref={screenshotRef} style={meshStyle} className={`quote-content-wrapper min-h-[200px] flex flex-col items-center justify-center p-12 sm:p-16 rounded-none`}>
                                <div 
                                    style={{ fontFamily: currentFontPair.quote }}
                                    className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl ${colorScheme.text} leading-tight sm:leading-tight md:leading-tight lg:leading-tight italic quote-line`}>
                                    {quotationMarks[marksIndex].open && !isTransitioning && <span className="mr-1 opacity-50">{quotationMarks[marksIndex].open}</span>}
                                    <Typewriter 
                                        text={quote.quote} 
                                        speed={25} 
                                        active={!isTransitioning}
                                        onComplete={() => setIsQuoteDone(true)}
                                    />
                                    {quotationMarks[marksIndex].close && !isTransitioning && <span className="ml-1 opacity-50">{quotationMarks[marksIndex].close}</span>}
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

                                    <button
                                        onClick={handleScreenshot}
                                        disabled={screenshotting}
                                        className={`${colorScheme.text} p-3 rounded-full hover:bg-white/40 hover:scale-110 active:scale-95 transition-all duration-500 backdrop-blur-sm`}
                                        aria-label="Screenshot quote">
                                        <CameraIcon className={`h-6 w-6 sm:h-8 sm:w-8 ${screenshotting ? 'opacity-50' : ''}`} />
                                    </button>
                                </div>

                                {/* Style Settings Panel */}
                                <div className={`flex flex-wrap justify-center gap-4 transition-all duration-700 overflow-hidden ${showSettings ? 'max-h-32 opacity-100 transform translate-y-0' : 'max-h-0 opacity-0 transform translate-y-4'}`}>
                                    <div className="flex bg-white/30 backdrop-blur-md rounded-2xl p-1.5 shadow-sm border border-white/20">
                                        <button 
                                            onClick={() => setMarksIndex((prev) => (prev + 1) % quotationMarks.length)}
                                            className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-500 text-gray-800 hover:bg-white/40 active:bg-white/60`}>
                                            Marks: <span className="opacity-60">{quotationMarks[marksIndex].label}</span>
                                        </button>
                                        <div className="w-px bg-gray-400/20 mx-1 my-1"></div>
                                        <button 
                                            onClick={cyclePrefix}
                                            className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-500 text-gray-800 hover:bg-white/40 active:bg-white/60`}>
                                            Prefix: <span className="opacity-60">{authorPrefixes[prefixIndex].label}</span>
                                        </button>
                                        <div className="w-px bg-gray-400/20 mx-1 my-1"></div>
                                        <button 
                                            onClick={() => setExportSizeIndex((prev) => (prev + 1) % exportSizes.length)}
                                            className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-500 text-gray-800 hover:bg-white/40 active:bg-white/60`}>
                                            Export: <span className="opacity-60">{exportSizes[exportSizeIndex].label}</span>
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
                    {screenshotting && (
                        <div className={`${colorScheme.authorText} text-xs sm:text-sm mt-4 font-medium tracking-wide animate-bounce`}>
                            Screenshot saved!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;