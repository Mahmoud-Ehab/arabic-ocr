class pa{
    static focus(frame) {
        let newFrame = [];
        let topBound = 0;
        let botBound = 0;

        // Figure out the topBound
        frame.some((row, i) => {
            let foundBound = false;

            row.some(pixel => {
                if (pixel[0] < 250) {
                    foundBound = true;
                    return true;
                }
            });

            if (foundBound) {
                topBound = i;
                return true;
            }
        });

        // Figure out the botBound
        for (let i = frame.length - 1; i > 0; i--) {
            let foundBound = false;

            frame[i].some(pixel => {
                if (pixel[0] < 250) {
                    foundBound = true;
                    return true;
                }
            });

            if (foundBound) {
                botBound = i;
                break;
            }
        }

        // Push rows into newFrame list
        for (let i = topBound; i <= botBound; i++) {
            newFrame.push(frame[i]);
        }

        return newFrame;
    }

    static flipX(frame) {
        frame.forEach(row => {
            row = row.reverse();
        });

        return frame;
    }

    static frameToDigits(frame, top, bottom) {
        if (top > bottom) return [];
        if (frame.length == 0) return [];

        let digits = [];
        for (let c = 0; c < frame[0].length; c++) {
            let digit = 0;
            for (let r = top; r < bottom; r++) {
                if (frame[r][c][0] < 250) digit += 1;
            }
            digits.push(digit);
        }

        return digits;
    }

    static getLines(frame) {
        let lines = []

        let line = []
        frame.forEach(row => {
            // To decide if we reached the end of the line or not yet
            let endOfLine = true;

            // Figure out if the current row is part of the line or not
            let rowBlacks = 0;
            row.some(pixel => {
                if (pixel[0] < 250) rowBlacks += 1;
                
                if (rowBlacks > 3) {
                    endOfLine = false;
                    line.push(row);
                    return true;
                }
            });

            // Push the line in lines list once we reach the end of it
            if (endOfLine && line.length > 0) {
                lines.push(line);
                line = [];
            }
        });

        return lines;
    }

    static getWords(frame) {
        const width = frame[0].length;
        const height = frame.length;

        let words = [];
        let word = [];
        let gap = 0;

        for (let c = 0; c < width; c++) {
            // Initialize the word list
            if (word.length == 0) {
                for (let r = 0; r < height; r++)
                    word.push([]);
            }
            
            // To decide if the cur column is white space or not
            let foundBlackCol = false;
            for (let r = 0; r < height; r++) {
                if (frame[r][c][0] < 150) {
                    foundBlackCol = true;
                    break;
                }
            }

            // If this's a white col, then increase the gap var
            if (!foundBlackCol) {
                gap += 1;
                // Add the word in words list
                if (word[0].length != 0 && gap >= 6) {
                    gap = 0;
                    words.push(word);
                    word = [];
                }
                continue;
            }
            
            // Avoid perishing the gaps in the word itself
            if (word[0].length != 0 && gap < 6) {
                for (let s = 0; s < gap; s++) 
                    for (let r = 0; r < height; r++)
                        word[r].push([255, 255, 255]);
            }

            // Add the current col to the word
            gap = 0;
            for (let r = 0; r < height; r++)
                word[r].push(frame[r][c]);
        }

        return words.reverse();
    }

    static getLetters(frame, testmode=false) {
        // Avoid space letter
        if (frame.length == 0) return [];

        const width = frame[0].length;
        const height = frame.length;

        // Determine the decisionRow
        let decisionRow = 0;
        let maxRowDensity = 0;

        frame.forEach((row, i) => {
            let density = 0;

            row.forEach(pixel => {
                if (pixel[0] < 50) density += 1;
            });

            if (density > maxRowDensity) {
                maxRowDensity = density;
                decisionRow = i;
            }
        });

        // Right Position the decisionRow
        let digitsArray = this.frameToDigits(frame, 0, decisionRow);
        let y = Infinity;
        digitsArray.forEach(digit => {
            if (digit != 0 && digit < y)
                y = digit;
        });
        if (frame[decisionRow-y-1])
            decisionRow -= y + 1;

        // Determine split_columns List using the decisionRow
        let split_columns = [];

        for (let c = 0; c < width * 0.9; c++) {
            // The cur pixel must be black
            if (frame[decisionRow][c][0] > 250) continue;

            // Once hit the first black
            if (split_columns.length == 0) {
                split_columns.push(c);
                continue;
            }

            // The prev pixel must be white
            if (frame[decisionRow][c-1][0] < 250) continue;

            // Ensure that there are no black pixels above
            let foundBlack = false;
            for (let r = 0; r < decisionRow; r++) {
                if (frame[r][c-1][0] < 250) {
                    foundBlack = true;
                    break;
                }
            }
            if (foundBlack) continue;

            // Then, consider c-1 as a split col index
            split_columns.push(c-1);
        }

        // split_columns shouldn't be empty though
        if (split_columns.length == 0)
            split_columns.push(0)
            
        // Test Mode
        if (testmode) {
            // Colour the decisionRow
            for (let i = 0; i < width; i++)
                frame[decisionRow][i] = [120, 0, 0];

            // Colour the split columns
            split_columns.forEach(c => {
                for (let r = 0; r < height; r++)
                    frame[r][c] = [120, 120, 0];
            });
            
            // return the modified word img
            return [frame];
        }

        // Extract the letters using split_columns
        split_columns.push(width-1);

        let letters = [];
        let letter = [];

        for (let col = 0; col < split_columns.length - 1; col++) {
            // init the letter list
            if (letter.length == 0)
                for (let i = 0; i < height; i++)
                    letter.push([]);

            // fill the letter list with pixels
            const start = split_columns[col];
            const end = split_columns[col + 1];
            for (let c = start; c <= end; c++)
                for (let r = 0; r < height; r++)
                    letter[r].push(frame[r][c]);

            // Push the letter in letters list then reset it
            letters.push(letter);
            letter = [];
        }

        return letters;
    }
}
