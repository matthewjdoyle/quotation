const fs = require('fs');

// Read the current new_quotes.csv
const readExistingCSV = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const lines = data.split('\n').filter(line => line.trim() !== '');
        const quotes = [];
        
        // Skip header row
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            if (matches && matches.length >= 2) {
                quotes.push({
                    quote: matches[0].replace(/"/g, ''),
                    author: matches[1].replace(/"/g, ''),
                    category: matches[2] ? matches[2].replace(/"/g, '') : ''
                });
            }
        }
        return quotes;
    } catch (error) {
        console.log('No existing CSV file found, starting fresh');
        return [];
    }
};

// Write CSV
const writeCSV = (quotes, filePath) => {
    const header = 'quote,author,category\n';
    const csvContent = header + quotes.map(q => 
        `"${q.quote}","${q.author}","${q.category}"`
    ).join('\n');
    
    fs.writeFileSync(filePath, csvContent, 'utf8');
    console.log(`Written ${quotes.length} quotes to ${filePath}`);
};

// Additional scientist quotes to reach 200-500 target
const additionalScientistQuotes = [
    // More Physics
    { quote: "The most incomprehensible thing about the universe is that it is comprehensible.", author: "Albert Einstein", category: "physics,universe,comprehension,mystery" },
    { quote: "If I have seen further it is by standing on the shoulders of Giants.", author: "Isaac Newton", category: "physics,mathematics,progress,giants" },
    { quote: "Mathematics is the language in which God has written the universe.", author: "Galileo Galilei", category: "physics,mathematics,universe,language" },
    { quote: "The universe is not only queerer than we suppose, but queerer than we can suppose.", author: "J.B.S. Haldane", category: "physics,universe,mystery,imagination" },
    { quote: "Black holes ain't so black.", author: "Stephen Hawking", category: "physics,black-holes,humor,science" },
    { quote: "The cosmos is within us. We are made of star-stuff.", author: "Carl Sagan", category: "physics,cosmos,stars,self-awareness" },
    { quote: "Somewhere, something incredible is waiting to be known.", author: "Carl Sagan", category: "physics,discovery,incredible,knowledge" },
    { quote: "Extraordinary claims require extraordinary evidence.", author: "Carl Sagan", category: "physics,claims,evidence,skepticism" },
    { quote: "The universe is under no obligation to make sense to you.", author: "Neil deGrasse Tyson", category: "physics,universe,sense,understanding" },
    { quote: "The good thing about science is that it's true whether or not you believe in it.", author: "Neil deGrasse Tyson", category: "physics,science,truth,belief" },
    
    // More Chemistry
    { quote: "Nothing in life is to be feared, it is only to be understood.", author: "Marie Curie", category: "chemistry,physics,fear,understanding,knowledge" },
    { quote: "Be less curious about people and more curious about ideas.", author: "Marie Curie", category: "chemistry,physics,curiosity,people,ideas" },
    { quote: "In science, we must be interested in things, not in persons.", author: "Marie Curie", category: "chemistry,physics,science,objectivity" },
    { quote: "Chemistry is necessarily an experimental science.", author: "Michael Faraday", category: "chemistry,experiment,science,data" },
    { quote: "The atom is mostly empty space, with a tiny nucleus at the center.", author: "Ernest Rutherford", category: "chemistry,physics,atom,empty-space,nucleus" },
    { quote: "The most important thing in science is not so much to obtain new facts as to discover new ways of thinking about them.", author: "William Bragg", category: "chemistry,physics,science,facts,thinking" },
    
    // More Biology
    { quote: "It is not the strongest of the species that survives, nor the most intelligent that survives. It is the one that is most adaptable to change.", author: "Charles Darwin", category: "biology,evolution,survival,adaptability,change" },
    { quote: "A man who dares to waste one hour of time has not discovered the value of life.", author: "Charles Darwin", category: "biology,time,life,value,wisdom" },
    { quote: "Ignorance more frequently begets confidence than does knowledge.", author: "Charles Darwin", category: "biology,ignorance,confidence,knowledge,wisdom" },
    { quote: "The love for all living creatures is the most noble attribute of man.", author: "Charles Darwin", category: "biology,love,creatures,noble,humanity" },
    { quote: "The mystery of the beginning of all things is insoluble by us.", author: "Charles Darwin", category: "biology,mystery,beginning,agnostic,humility" },
    
    // More Mathematics
    { quote: "Mathematics is the music of reason.", author: "James Joseph Sylvester", category: "mathematics,music,reason,beauty" },
    { quote: "The mathematician's patterns, like the painter's or the poet's must be beautiful.", author: "G.H. Hardy", category: "mathematics,patterns,beauty,art,poetry" },
    { quote: "In mathematics you don't understand things. You just get used to them.", author: "John von Neumann", category: "mathematics,understanding,adaptation,learning" },
    { quote: "The essence of mathematics lies in its freedom.", author: "Georg Cantor", category: "mathematics,essence,freedom,creativity" },
    { quote: "Mathematics is the most beautiful and most powerful creation of the human spirit.", author: "Stefan Banach", category: "mathematics,beauty,power,creation,human-spirit" },
    
    // More Computer Science
    { quote: "The best way to predict the future is to invent it.", author: "Alan Kay", category: "computer-science,future,invention,innovation" },
    { quote: "The most dangerous phrase in the language is, 'We've always done it this way.'", author: "Grace Hopper", category: "computer-science,innovation,change,tradition" },
    { quote: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House", category: "computer-science,code,humor,clarity" },
    { quote: "There are only two hard things in Computer Science: cache invalidation and naming things.", author: "Phil Karlton", category: "computer-science,challenges,cache,naming" },
    { quote: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", category: "computer-science,simplicity,sophistication,design" },
    
    // More Psychology
    { quote: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch", category: "psychology,mind,learning,passion,ignition" },
    { quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle", category: "psychology,behavior,excellence,habits,repetition" },
    { quote: "The unexamined life is not worth living.", author: "Socrates", category: "psychology,philosophy,examination,life,reflection" },
    { quote: "I think, therefore I am.", author: "René Descartes", category: "psychology,philosophy,thinking,existence,consciousness" },
    { quote: "The brain is the most outstanding organ. It works for 24 hours, 365 days, right from your birth until you fall in love.", author: "Shashi Tharoor", category: "psychology,neuroscience,brain,work,humor" },
    
    // More Environmental Science
    { quote: "In every walk with nature, one receives far more than he seeks.", author: "John Muir", category: "environmental-science,nature,walking,receiving,seeking" },
    { quote: "The earth does not belong to us; we belong to the earth.", author: "Chief Seattle", category: "environmental-science,earth,ownership,belonging,stewardship" },
    { quote: "We do not inherit the earth from our ancestors; we borrow it from our children.", author: "Native American Proverb", category: "environmental-science,earth,inheritance,children,stewardship" },
    { quote: "The environment is where we all meet; where all have a mutual interest; it is the one thing all of us share.", author: "Lady Bird Johnson", category: "environmental-science,environment,meeting,interest,sharing" },
    { quote: "Nature is not a place to visit. It is home.", author: "Gary Snyder", category: "environmental-science,nature,home,belonging,connection" },
    
    // More Richard Feynman
    { quote: "The first principle is that you must not fool yourself—and you are the easiest person to fool.", author: "Richard Feynman", category: "physics,self-deception,honesty,principle,wisdom" },
    { quote: "Physics is like sex: sure, it may give some practical results, but that's not why we do it.", author: "Richard Feynman", category: "physics,passion,purpose,humor" },
    { quote: "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.", author: "Richard Feynman", category: "physics,study,interest,creativity,originality" },
    { quote: "Nobody ever figures out what life is all about, and it doesn't matter. Explore the world. Nearly everything is really interesting if you go into it deeply enough.", author: "Richard Feynman", category: "physics,life,exploration,curiosity,depth" },
    { quote: "Science is the belief in the ignorance of experts.", author: "Richard Feynman", category: "physics,science,experts,ignorance,belief" },
    { quote: "I would rather have questions that can't be answered than answers that can't be questioned.", author: "Richard Feynman", category: "physics,questions,answers,curiosity,wisdom" },
    { quote: "The highest forms of understanding we can achieve are laughter and human compassion.", author: "Richard Feynman", category: "physics,understanding,laughter,compassion,humanity" },
    { quote: "What I cannot create, I do not understand.", author: "Richard Feynman", category: "physics,creation,understanding,learning" },
    { quote: "The pleasure of finding things out is the most important thing in life.", author: "Richard Feynman", category: "physics,pleasure,discovery,learning,life" },
    
    // More Quantum Physics
    { quote: "Anyone who is not shocked by quantum theory has not understood it.", author: "Niels Bohr", category: "physics,quantum-theory,shock,understanding" },
    { quote: "Prediction is very difficult, especially about the future.", author: "Niels Bohr", category: "physics,prediction,future,difficulty,wisdom" },
    { quote: "There are some things so serious you have to laugh at them.", author: "Niels Bohr", category: "physics,serious,laugh,humor,perspective" },
    { quote: "An expert is a person who has made all the mistakes that can be made in a very narrow field.", author: "Niels Bohr", category: "physics,expert,mistakes,narrow-field,wisdom" },
    { quote: "If quantum mechanics hasn't profoundly shocked you, you haven't understood it yet.", author: "Niels Bohr", category: "physics,quantum-mechanics,shock,understanding" },
    { quote: "Everything we call real is made of things that cannot be regarded as real.", author: "Niels Bohr", category: "physics,real,reality,quantum,philosophy" },
    { quote: "Physics is not about how things are, but about what we can say about them.", author: "Niels Bohr", category: "physics,things,say,knowledge" },
    { quote: "Uncertainty is not a sign of weakness, but a sign of strength.", author: "Werner Heisenberg", category: "physics,uncertainty,weakness,strength,wisdom" },
    { quote: "Not only is the Universe stranger than we think, it is stranger than we can think.", author: "Werner Heisenberg", category: "physics,universe,strange,thinking,mystery" },
    { quote: "The more precise the measurement of position, the more imprecise the measurement of momentum, and vice versa.", author: "Werner Heisenberg", category: "physics,measurement,position,momentum,precision,uncertainty" },
    
    // More Einstein
    { quote: "Common sense is the collection of prejudices acquired by age eighteen.", author: "Albert Einstein", category: "physics,common-sense,prejudices,age,wisdom" },
    { quote: "Only two things are infinite, the universe and human stupidity, and I'm not sure about the former.", author: "Albert Einstein", category: "physics,infinite,universe,stupidity,humor" },
    { quote: "Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world, stimulating progress, giving birth to evolution.", author: "Albert Einstein", category: "physics,imagination,knowledge,world,progress,evolution" },
    { quote: "Any intelligent fool can make things bigger, more complex, and more violent. It takes a touch of genius—and a lot of courage—to move in the opposite direction.", author: "Albert Einstein", category: "physics,intelligence,complexity,violence,genius,courage" },
    { quote: "Great spirits have always encountered violent opposition from mediocre minds.", author: "Albert Einstein", category: "physics,spirits,opposition,mediocre,minds" },
    { quote: "Try not to become a man of success, but rather try to become a man of value.", author: "Albert Einstein", category: "physics,success,value,character,wisdom" },
    { quote: "Science without religion is lame, religion without science is blind.", author: "Albert Einstein", category: "physics,science,religion,balance,wisdom" },
    { quote: "Anyone who has never made a mistake has never tried anything new.", author: "Albert Einstein", category: "physics,mistakes,trying,new,courage" },
    { quote: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", author: "Albert Einstein", category: "physics,universe,stupidity,humor,infinity" },
    { quote: "Reality is merely an illusion, albeit a very persistent one.", author: "Albert Einstein", category: "physics,reality,illusion,persistence,philosophy" },
    { quote: "Everything should be made as simple as possible, but not simpler.", author: "Albert Einstein", category: "physics,simplicity,complexity,balance,wisdom" },
    { quote: "If you can't explain it simply, you don't understand it well enough.", author: "Albert Einstein", category: "physics,explanation,simplicity,understanding,clarity" },
    { quote: "The most incomprehensible thing about the universe is that it is comprehensible.", author: "Albert Einstein", category: "physics,universe,comprehensible,mystery,understanding" },
    { quote: "God does not play dice.", author: "Albert Einstein", category: "physics,god,dice,determinism,quantum-mechanics" },
    { quote: "Subtle is the Lord, but malicious He is not.", author: "Albert Einstein", category: "physics,lord,subtle,malicious,nature" },
    { quote: "Logic will get you from A to B. Imagination will take you everywhere.", author: "Albert Einstein", category: "physics,logic,imagination,creativity" },
    { quote: "The only source of knowledge is experience.", author: "Albert Einstein", category: "physics,knowledge,experience,wisdom" },
    { quote: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "physics,difficulty,opportunity,wisdom" },
    { quote: "I have no special talents. I am only passionately curious.", author: "Albert Einstein", category: "physics,curiosity,passion,talents" },
    { quote: "The true sign of intelligence is not knowledge but imagination.", author: "Albert Einstein", category: "physics,intelligence,imagination,knowledge" },
    { quote: "It is not that I'm so smart, it's just that I stay with problems longer.", author: "Albert Einstein", category: "physics,persistence,problems,wisdom" },
    { quote: "The difference between stupidity and genius is that genius has its limits.", author: "Albert Einstein", category: "physics,genius,stupidity,limits" },
    { quote: "The most beautiful thing we can experience is the mysterious.", author: "Albert Einstein", category: "physics,beauty,mystery,experience" },
    { quote: "The whole of science is nothing more than a refinement of everyday thinking.", author: "Albert Einstein", category: "physics,science,thinking,refinement" },
    { quote: "I never think of the future. It comes soon enough.", author: "Albert Einstein", category: "physics,future,present,mindfulness" },
    
    // More Marie Curie
    { quote: "I was taught that the way of progress was neither swift nor easy.", author: "Marie Curie", category: "chemistry,physics,progress,patience,effort" },
    { quote: "I am among those who think that science has great beauty.", author: "Marie Curie", category: "chemistry,physics,science,beauty,appreciation" },
    { quote: "One never notices what has been done; one can only see what remains to be done.", author: "Marie Curie", category: "chemistry,physics,progress,work,achievement" },
    { quote: "You cannot hope to build a better world without improving the individuals.", author: "Marie Curie", category: "chemistry,physics,world,individuals,improvement" },
    { quote: "Life is not easy for any of us. But what of that? We must have perseverance and above all confidence in ourselves.", author: "Marie Curie", category: "chemistry,physics,life,perseverance,confidence" },
    
    // More Stephen Hawking
    { quote: "The greatest enemy of knowledge is not ignorance, it is the illusion of knowledge.", author: "Stephen Hawking", category: "physics,knowledge,ignorance,illusion,wisdom" },
    { quote: "The universe doesn't allow perfection.", author: "Stephen Hawking", category: "physics,universe,perfection,reality" },
    { quote: "We are just an advanced breed of monkeys on a minor planet of a very average star.", author: "Stephen Hawking", category: "physics,humanity,monkeys,planet,star,perspective" },
    { quote: "Intelligence is the ability to adapt to change.", author: "Stephen Hawking", category: "physics,intelligence,adaptation,change,wisdom" },
    { quote: "However difficult life may seem, there is always something you can do and succeed at.", author: "Stephen Hawking", category: "physics,life,difficulty,success,perseverance" },
    { quote: "Look up at the stars and not down at your feet. Try to make sense of what you see, and wonder about what makes the universe exist. Be curious.", author: "Stephen Hawking", category: "physics,stars,curiosity,wonder,universe" },
    { quote: "Remember to look up at the stars and not down at your feet.", author: "Stephen Hawking", category: "physics,stars,perspective,inspiration,wonder" },
    { quote: "Quiet people have the loudest minds.", author: "Stephen Hawking", category: "physics,quiet,minds,introversion,wisdom" },
    { quote: "Nothing is better than reading and gaining more and more knowledge.", author: "Stephen Hawking", category: "physics,reading,knowledge,learning,growth" },
    
    // More Carl Sagan
    { quote: "Science is a way of thinking much more than it is a body of knowledge.", author: "Carl Sagan", category: "physics,science,thinking,knowledge,philosophy" },
    { quote: "The cosmos is within us. We are made of star-stuff. We are a way for the cosmos to know itself.", author: "Carl Sagan", category: "physics,cosmos,stars,self-awareness,universe" },
    { quote: "Somewhere, something incredible is waiting to be known.", author: "Carl Sagan", category: "physics,discovery,incredible,knowledge,wonder" },
    { quote: "The universe is not required to be in perfect harmony with human ambition.", author: "Carl Sagan", category: "physics,universe,harmony,human-ambition,reality" },
    { quote: "Extraordinary claims require extraordinary evidence.", author: "Carl Sagan", category: "physics,claims,evidence,skepticism,science" },
    { quote: "If you wish to make an apple pie from scratch, you must first invent the universe.", author: "Carl Sagan", category: "physics,apple-pie,universe,creation,complexity" },
    { quote: "Who are we? We find that we live on an insignificant planet of a humdrum star lost in a galaxy tucked away in some forgotten corner of a universe in which there are far more galaxies than people.", author: "Carl Sagan", category: "physics,significance,planet,star,galaxy,universe" },
    { quote: "Every one of us is, in the cosmic perspective, precious. If a human disagrees with you, let him live. In a hundred billion galaxies, you will not find another.", author: "Carl Sagan", category: "physics,cosmic,precious,human,galaxies,uniqueness" },
    { quote: "If we are alone in the universe, surely we should be talking to one another.", author: "Carl Sagan", category: "physics,alone,universe,communication,humanity" },
    { quote: "Science is not only compatible with spirituality; it is a profound source of spirituality.", author: "Carl Sagan", category: "physics,science,spirituality,compatibility,depth" },
    { quote: "An organism at war with itself is doomed.", author: "Carl Sagan", category: "physics,organism,war,self,doom,wisdom" },
    { quote: "Who is more humble? The scientist who looks at the universe with an open mind and accepts whatever the universe has to teach us, or somebody who says everything in this book must be considered the literal truth and never mind the fallibility of all the human beings involved?", author: "Carl Sagan", category: "physics,humility,scientist,universe,truth,fallibility" },
    
    // More quotes from other scientists
    { quote: "Every atom in your body came from a star that exploded. And, the atoms in your left hand probably came from a different star than did the atoms in your right hand. It really is the most poetic thing I know about physics: You are all stardust.", author: "Lawrence Krauss", category: "physics,atoms,stars,explosion,stardust,poetry" },
    { quote: "The universe is a pretty big place. If it's just us, seems like an awful waste of space.", author: "Carl Sagan", category: "physics,universe,space,life,perspective" },
    { quote: "We are all connected; To each other, biologically. To the earth, chemically. To the rest of the universe atomically.", author: "Neil deGrasse Tyson", category: "physics,connection,biology,earth,universe,atoms" },
    { quote: "The good thing about science is that it's true whether or not you believe in it.", author: "Neil deGrasse Tyson", category: "physics,science,truth,belief" },
    { quote: "The universe is under no obligation to make sense to you.", author: "Neil deGrasse Tyson", category: "physics,universe,sense,understanding,reality" },
    { quote: "The most beautiful thing we can experience is the mysterious. It is the source of all true art and science.", author: "Albert Einstein", category: "physics,beauty,mystery,art,science" },
    { quote: "Look up at the stars and not down at your feet. Try to make sense of what you see, and wonder about what makes the universe exist.", author: "Stephen Hawking", category: "physics,stars,curiosity,wonder,universe" },
    
    // More mathematics quotes
    { quote: "Mathematics is the language in which God has written the universe.", author: "Galileo Galilei", category: "mathematics,physics,universe,language,god" },
    { quote: "Mathematics is the music of reason.", author: "James Joseph Sylvester", category: "mathematics,music,reason,beauty" },
    { quote: "Mathematics is not yet ready for such problems.", author: "Paul Erdős", category: "mathematics,problems,readiness,challenge" },
    { quote: "The mathematician's patterns, like the painter's or the poet's must be beautiful.", author: "G.H. Hardy", category: "mathematics,patterns,beauty,art,poetry" },
    { quote: "In mathematics you don't understand things. You just get used to them.", author: "John von Neumann", category: "mathematics,understanding,adaptation,learning" },
    { quote: "The essence of mathematics lies in its freedom.", author: "Georg Cantor", category: "mathematics,essence,freedom,creativity" },
    { quote: "Mathematics is the science of what is clear by itself.", author: "Carl Jacobi", category: "mathematics,science,clarity,self-evident" },
    { quote: "Mathematics is the most beautiful and most powerful creation of the human spirit.", author: "Stefan Banach", category: "mathematics,beauty,power,creation,human-spirit" },
    { quote: "The study of mathematics, like the Nile, begins in minuteness but ends in magnificence.", author: "Charles Caleb Colton", category: "mathematics,study,minuteness,magnificence,progress" },
    
    // More computer science quotes
    { quote: "The best way to predict the future is to invent it.", author: "Alan Kay", category: "computer-science,future,invention,innovation" },
    { quote: "The computer was born to solve problems that did not exist before.", author: "Bill Gates", category: "computer-science,problems,solutions,innovation" },
    { quote: "The most dangerous phrase in the language is, 'We've always done it this way.'", author: "Grace Hopper", category: "computer-science,innovation,change,tradition" },
    { quote: "A computer is like a violin. You can imagine a novice trying first a phonograph and then a violin. The immediate question is 'Why do I need to learn the violin?'", author: "Alan Kay", category: "computer-science,learning,patience,skill" },
    { quote: "The best error message is the one that never appears.", author: "Thomas Fuchs", category: "computer-science,errors,prevention,quality" },
    { quote: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House", category: "computer-science,code,humor,clarity" },
    { quote: "The first 90% of the code accounts for the first 90% of the development time. The remaining 10% of the code accounts for the other 90% of the development time.", author: "Tom Cargill", category: "computer-science,development,time,complexity" },
    { quote: "There are only two hard things in Computer Science: cache invalidation and naming things.", author: "Phil Karlton", category: "computer-science,challenges,cache,naming" },
    { quote: "The best way to get a project done faster is to start sooner.", author: "Jim Highsmith", category: "computer-science,project-management,time,planning" },
    { quote: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", category: "computer-science,simplicity,sophistication,design" },
    
    // More psychology quotes
    { quote: "The mind is everything. What you think you become.", author: "Buddha", category: "psychology,mind,thoughts,transformation" },
    { quote: "The brain is wider than the sky.", author: "Emily Dickinson", category: "psychology,neuroscience,brain,sky,capacity" },
    { quote: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch", category: "psychology,mind,learning,passion,ignition" },
    { quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle", category: "psychology,behavior,excellence,habits,repetition" },
    { quote: "The unexamined life is not worth living.", author: "Socrates", category: "psychology,philosophy,examination,life,reflection" },
    { quote: "I think, therefore I am.", author: "René Descartes", category: "psychology,philosophy,thinking,existence,consciousness" },
    { quote: "The mind is its own place, and in itself can make a heaven of hell, a hell of heaven.", author: "John Milton", category: "psychology,mind,perception,heaven,hell,perspective" },
    { quote: "What we think, we become.", author: "Buddha", category: "psychology,thoughts,transformation,manifestation" },
    { quote: "The brain is the most outstanding organ. It works for 24 hours, 365 days, right from your birth until you fall in love.", author: "Shashi Tharoor", category: "psychology,neuroscience,brain,work,humor" },
    
    // More environmental science quotes
    { quote: "In every walk with nature, one receives far more than he seeks.", author: "John Muir", category: "environmental-science,nature,walking,receiving,seeking" },
    { quote: "The earth does not belong to us; we belong to the earth.", author: "Chief Seattle", category: "environmental-science,earth,ownership,belonging,stewardship" },
    { quote: "We do not inherit the earth from our ancestors; we borrow it from our children.", author: "Native American Proverb", category: "environmental-science,earth,inheritance,children,stewardship" },
    { quote: "The environment is where we all meet; where all have a mutual interest; it is the one thing all of us share.", author: "Lady Bird Johnson", category: "environmental-science,environment,meeting,interest,sharing" },
    { quote: "What we are doing to the forests of the world is but a mirror reflection of what we are doing to ourselves and to one another.", author: "Mahatma Gandhi", category: "environmental-science,forests,reflection,ourselves,others" },
    { quote: "The ultimate test of man's conscience may be his willingness to sacrifice something today for future generations whose words of thanks will not be heard.", author: "Gaylord Nelson", category: "environmental-science,conscience,sacrifice,future,generations" },
    { quote: "We won't have a society if we destroy the environment.", author: "Margaret Mead", category: "environmental-science,society,environment,destruction,interconnection" },
    { quote: "The environment is everything that isn't me.", author: "Albert Einstein", category: "environmental-science,environment,everything,self,perspective" },
    { quote: "Nature is not a place to visit. It is home.", author: "Gary Snyder", category: "environmental-science,nature,home,belonging,connection" },
    { quote: "The earth laughs in flowers.", author: "Ralph Waldo Emerson", category: "environmental-science,earth,laughter,flowers,joy" },
    
    // Additional famous scientist quotes
    { quote: "The important thing is not to stop questioning. Curiosity has its own reason for existing.", author: "Albert Einstein", category: "physics,questioning,curiosity,importance,existence" },
    { quote: "God does not play dice with the universe.", author: "Albert Einstein", category: "physics,god,dice,universe,determinism" },
    { quote: "Science without religion is lame, religion without science is blind.", author: "Albert Einstein", category: "physics,science,religion,balance,wisdom" },
    { quote: "Anyone who has never made a mistake has never tried anything new.", author: "Albert Einstein", category: "physics,mistakes,trying,new,courage" },
    { quote: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", author: "Albert Einstein", category: "physics,universe,stupidity,humor,infinity" },
    { quote: "Reality is merely an illusion, albeit a very persistent one.", author: "Albert Einstein", category: "physics,reality,illusion,persistence,philosophy" },
    { quote: "Everything should be made as simple as possible, but not simpler.", author: "Albert Einstein", category: "physics,simplicity,complexity,balance,wisdom" },
    { quote: "If you can't explain it simply, you don't understand it well enough.", author: "Albert Einstein", category: "physics,explanation,simplicity,understanding,clarity" },
    { quote: "The most incomprehensible thing about the universe is that it is comprehensible.", author: "Albert Einstein", category: "physics,universe,comprehensible,mystery,understanding" },
    { quote: "God does not play dice.", author: "Albert Einstein", category: "physics,god,dice,determinism,quantum-mechanics" },
    { quote: "Subtle is the Lord, but malicious He is not.", author: "Albert Einstein", category: "physics,lord,subtle,malicious,nature" },
    { quote: "Logic will get you from A to B. Imagination will take you everywhere.", author: "Albert Einstein", category: "physics,logic,imagination,creativity" },
    { quote: "The only source of knowledge is experience.", author: "Albert Einstein", category: "physics,knowledge,experience,wisdom" },
    { quote: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "physics,difficulty,opportunity,wisdom" },
    { quote: "I have no special talents. I am only passionately curious.", author: "Albert Einstein", category: "physics,curiosity,passion,talents" },
    { quote: "The true sign of intelligence is not knowledge but imagination.", author: "Albert Einstein", category: "physics,intelligence,imagination,knowledge" },
    { quote: "It is not that I'm so smart, it's just that I stay with problems longer.", author: "Albert Einstein", category: "physics,persistence,problems,wisdom" },
    { quote: "The difference between stupidity and genius is that genius has its limits.", author: "Albert Einstein", category: "physics,genius,stupidity,limits" },
    { quote: "The most beautiful thing we can experience is the mysterious.", author: "Albert Einstein", category: "physics,beauty,mystery,experience" },
    { quote: "The whole of science is nothing more than a refinement of everyday thinking.", author: "Albert Einstein", category: "physics,science,thinking,refinement" },
    { quote: "I never think of the future. It comes soon enough.", author: "Albert Einstein", category: "physics,future,present,mindfulness" }
];

// Main function
const main = () => {
    try {
        console.log('Starting quote expansion...');
        
        // Read existing quotes from new_quotes.csv
        const existingQuotes = readExistingCSV('new_quotes.csv');
        console.log(`Found ${existingQuotes.length} existing quotes`);
        
        // Combine all quotes
        const allQuotes = [...existingQuotes, ...additionalScientistQuotes];
        
        // Remove duplicates based on quote text
        const uniqueQuotes = [];
        const seenQuotes = new Set();
        
        for (const quote of allQuotes) {
            const normalizedQuote = quote.quote.toLowerCase().trim();
            if (!seenQuotes.has(normalizedQuote)) {
                seenQuotes.add(normalizedQuote);
                uniqueQuotes.push(quote);
            }
        }
        
        console.log(`Total unique quotes: ${uniqueQuotes.length}`);
        
        // Write to new_quotes.csv
        writeCSV(uniqueQuotes, 'new_quotes.csv');
        
        // Also update quotes.csv to match new_quotes.csv
        writeCSV(uniqueQuotes, 'quotes.csv');
        
        console.log('Quote expansion completed successfully!');
        
    } catch (error) {
        console.error('Error:', error);
    }
};

// Run the script
main();



