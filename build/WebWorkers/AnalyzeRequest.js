onmessage = function(e) {
    importScripts('./PageAnalyzer.js');
    const imgData = e.data.imgData;

    let responseData = [];
    const lines = pa.getLines(imgData);
    lines.forEach(line => {
        const words = pa.getWords(line);

        words.forEach(word => {
            const letters = pa.getLetters(pa.flipX(word));
            letters.forEach(letter => {
                try {
                    responseData.push(pa.focus(pa.flipX(letter))); 
                }
                catch(e){}
            });
            responseData.push([]);
        });
    });

    postMessage(responseData);
}
