const pastelColors = [
    { bg: '#f0f4f8', text: '#2c5282' }, // Blue
    { bg: '#f0fdf4', text: '#276749' }, // Green
    { bg: '#fdf2f8', text: '#97266d' }, // Pink
    { bg: '#fff5f5', text: '#9b2c2c' }, // Red
    { bg: '#f6f5ff', text: '#553c9a' }  // Purple
];

async function loadQuotes() {
    try {
        const response = await fetch('quotes.csv');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        console.log('Raw CSV data:', data); // Debug log
        
        const lines = data.split('\n').filter(line => line.trim() !== '');
        console.log('Filtered lines:', lines); // Debug log
        
        // Skip the header row and parse the rest
        const quotes = lines.slice(1).map(row => {
            console.log('Processing row:', row); // Debug log
            const matches = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            console.log('Matches found:', matches); // Debug log
            if (matches && matches.length >= 2) {
                const quote = matches[0].replace(/"/g, '');
                const author = matches[1].replace(/"/g, '');
                return { quote, author };
            }
            return null;
        }).filter(quote => quote !== null);
        
        console.log('Processed quotes:', quotes); // Debug log
        return quotes;
    } catch (error) {
        console.error('Detailed error:', error); // More detailed error
        return [{ quote: 'Failed to load quotes', author: 'System' }];
    }
}

function updateQuote(quotes) {
    const quoteElement = document.getElementById('quote');
    const authorElement = document.getElementById('author');
    
    // Get random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const { quote, author } = quotes[randomIndex];
    
    // Get random color scheme
    const colorScheme = pastelColors[Math.floor(Math.random() * pastelColors.length)];
    
    // Update text
    quoteElement.textContent = `"${quote}"`;
    authorElement.textContent = `- ${author}`;
    
    // Update colors
    document.body.style.backgroundColor = colorScheme.bg;
    quoteElement.style.color = colorScheme.text;
    authorElement.style.color = colorScheme.text;
}

async function init() {
    const quotes = await loadQuotes();
    
    // Initial update
    updateQuote(quotes);
    
    // Update every hour
    setInterval(() => {
        updateQuote(quotes);
    }, 3600000); // 3600000 ms = 1 hour
}

// Start when page loads
window.addEventListener('load', init);
