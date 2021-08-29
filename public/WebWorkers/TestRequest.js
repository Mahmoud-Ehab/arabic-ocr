function getRandomSample(imgData) {
    try {
        const lines = pa.getLines(imgData);
        const randLine = Math.floor(Math.random() * lines.length);

        const words = pa.getWords(lines[randLine]);
        const randWord = Math.floor(Math.random() * words.length);
        
        const letters = pa.getLetters(
            pa.flipX(words[randWord]), 
            testmode=true
        );
        
        return pa.flipX(letters[0]);
    }
    catch(e) {
        return getRandomSample(imgData);
    }
}

onmessage = function(e) {
    importScripts('./PageAnalyzer.js');
    const imgData = e.data.imgData;
    postMessage(getRandomSample(imgData));
}
