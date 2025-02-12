const pastelColors = [
    { bg: '#f0f4f8', text: '#2c5282' }, // Blue
    { bg: '#f0fdf4', text: '#276749' }, // Green
    { bg: '#fdf2f8', text: '#97266d' }, // Pink
    { bg: '#fff5f5', text: '#9b2c2c' }, // Red
    { bg: '#f6f5ff', text: '#553c9a' }  // Purple
];

async function loadQuotes() {
    try {
        // Use the raw GitHub URL to fetch the CSV file
        const response = await fetch('https://raw.githubusercontent.com/matthewjdoyle/quotation/main/quotes.csv?dl=1');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.text();
        if (data.includes('version https://git-lfs.github.com/spec/')) {
            throw new Error('Git LFS file detected. Please ensure the CSV file is properly downloaded');
        }

        const lines = data.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) {
            throw new Error('No quotes found in CSV file');
        }

        const quotes = lines.slice(1).map(row => {
            const matches = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            if (matches && matches.length >= 2) {
                const quote = matches[0].replace(/"/g, '');
                const author = matches[1].replace(/"/g, '');
                return { quote, author };
            }
            return null;
        }).filter(quote => quote !== null);

        if (quotes.length === 0) {
            throw new Error('No valid quotes found after processing');
        }

        return quotes;
    } catch (error) {
        console.error('Detailed error:', error);
        return [{
            quote: 'The best preparation for tomorrow is doing your best today',
            author: 'H. Jackson Brown Jr.'
        }];
    }
}

function updateQuote(quotes) {
    if (!quotes || quotes.length === 0) {
        console.error('No quotes available');
        return;
    }

    const quoteElement = document.getElementById('quote');
    const authorElement = document.getElementById('author');
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteData = quotes[randomIndex];

    if (!quoteData) {
        console.error('Invalid quote data');
        return;
    }

    // Update text
    quoteElement.textContent = `"${quoteData.quote}"`;
    authorElement.textContent = `- ${quoteData.author}`;
    
    // Get random color scheme
    const colorScheme = pastelColors[Math.floor(Math.random() * pastelColors.length)];
    
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
