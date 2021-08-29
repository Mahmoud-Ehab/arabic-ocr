class ArabicLettersClassifier {    
    LearningDataException = {message: 'X and y must have the same length.'};
    
    constructor(X, y) {
        if (X.length != y.length) throw LearningDataException;
        this.X = this.convertLearningData(X);
        this.y = y;
    }

    convertLearningData(data) {
        let convertedData = [];

        data.forEach(frame => {
            if (frame.length > 0) {
                const height = frame.length;
                const width = frame[0].length;

                // Get top density
                let topDensity = 0;
                for (let i = 0; i < parseInt(height/2); i++) {
                    const tmp = frame[i].filter(pixel => pixel[0] < 250);
                    topDensity += tmp.length;
                }
                topDensity /= width * (height/2);

                // Get bot density
                let botDensity = 0;
                for (let i = parseInt(height/2); i < height; i++) {
                    const tmp = frame[i].filter(pixel => pixel[0] < 250);
                    botDensity += tmp.length;
                }
                botDensity /= width * (height/2);

                // Covert densities to percentage
                topDensity = parseInt(topDensity*100);
                botDensity = parseInt(botDensity*100);

                convertedData.push([topDensity, botDensity]);
            }
            else {
                convertedData.push([0, 0]);
            }
        });

        return convertedData;
    }

    densityToCharIndex(element) {
        let smallestDistance = Infinity;
        let closestNeighbourIndex = 0;

        this.X.forEach((x, i) => {
            // Get the distance between x and the element
            let distance = 0;
            for (let k = 0; k < x.length; k++)
                distance += (element[k] - x[k]);
            distance = Math.pow(distance, 2);

            // If it small enough specify i as the predicted char index
            if (distance < smallestDistance) {
                smallestDistance = distance;
                closestNeighbourIndex = i;
            }
        });

        return closestNeighbourIndex;
    }

    predict(data) {
        let result = [];
        data = this.convertLearningData(data);

        data.forEach(element => {
            const charIndex = this.densityToCharIndex(element);
            result.push(this.y[charIndex]);
        });

        return result;
    }
}

onmessage = function(e) {
    // Initialize some variables
    let rd = e.data.target;
    let X = e.data.X;
    let y = e.data.y;

    // Add space character in learning data (X, rd)
    X.push([]);
    y.push(' ');

    // Interprete the rd using sklearn
    const alc = new ArabicLettersClassifier(X, y);
    const textChars = alc.predict(rd);

    postMessage(textChars);
}

const reshapeData = (data) => {
    return data;
}