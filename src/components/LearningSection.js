import { React, useState, useEffect } from 'react';

const LearningSection = (props) => {
    const addToDBHandler = (text, array) => {
        props.addToDB(text, array);
    }

    const loadFile = () => {
        const input = document.getElementById('loadFileInput');
        input.click();
    }

    return ( props.appear ?
        <div id='LearningSection' 
        className={`flex flex-col h-screen h-auto items-center bg-gray-200 p-8 shadow 
        animate__animated animate__fadeInLeft animate__slow`}>
            
            <div className="flex sm:flex-row flex-col flex-1 justify-around
            w-full overflow-hidden">

                <div className={`flex sm:flex-col flex-row-reverse justify-between overflow-y-hidden
                w-auto lg:w-1/3 sm:overflow-y-scroll rounded sm:shadow-xl`}>
                    {props.letters.map(
                        (l, i) => 
                        <LetterComponent 
                            cid={i} 
                            letterImgData={l} 
                            addToDB={addToDBHandler} 
                        />
                    )}
                </div>
                    
                <div className={`w-auto h-1/3 sm:h-full sm:w-1/3 rounded sm:shadow-xl`}>
                    <CheckLetters learnedTexts={props.learnedTexts} />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-around mt-6 w-full bg-white">
                <button className="hover:bg-green-300 hover:text-white py-3 sm:w-1/3 duration-300"
                onClick={props.saveDataHandler}>
                    Save
                </button>

                <button className="relative hover:bg-green-300 hover:text-white
                py-3 sm:w-1/3 duration-300" onClick={loadFile}>
                    Load
                    <input
                        id="loadFileInput"
                        className="hidden"
                        onChange={props.loadDataHandler}
                        type="file" 
                        accept=".json"
                        multiple
                    />
                </button>

                <button className="hover:bg-green-400 hover:text-white py-3 sm:w-1/3 duration-300"
                onClick={props.finalizeHandler}>
                    Submit
                </button>
            </div>

        </div> : <div id='learningSection'></div>
    );
}

export default LearningSection;


const LetterComponent = (props) => {
    const [letter, setLetter] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // Skip the space letter
        if (!props.letterImgData.length) return;
        
        // Get the Canvas & CanvasContext
        let canvas = document.getElementById(props.cid);
        let ctx = canvas.getContext('2d');

        // Initialize some variables to the letter properties
        let letter = props.letterImgData;
        let width = letter[0].length;
        let height = letter.length;

        canvas.width = width > 100 ? width * 2 : 100;
        canvas.height = height > 100 ? height * 2 : 100;

        // Initialize the letter ImageData (iData)
        let tmp = pixelsToHex(letter);
        let array = new Uint32Array(width * height);
        for(let i=0; i < array.length; i++) array[i] = parseInt(tmp[i]);
        let iData = new ImageData(new Uint8ClampedArray(array.buffer), width, height);

        // Draw The letter in the canvas
        ctx.putImageData(iData, (canvas.width-width)/2, (canvas.height-height)/2);
    });

    // Mutate pixels matrix to be suitable for canvas
    const pixelsToHex = (array) => {
        let result = [];
    
        for (let r = 0; r < array.length; r++) {
            for (let c = 0; c < array[r].length; c++) {
                let blue = array[r][c][2].toString(16);
                let green = array[r][c][1].toString(16);
                let red = array[r][c][0].toString(16);
                
                if (blue.length < 2) blue += blue;
                if (green.length < 2) green += green;
                if (red.length < 2) red += red;
                
                result.push("0xff" + blue + green + red);
            }
        }
    
        return result;
    }

    const onTextLetterChange = (e) => {
        setLetter(e.target.value);
    }

    const addToDBHandler = () => {
        props.addToDB(letter, props.letterImgData);
        setSubmitted(true);
    }

    // return JSX statement
    return ( props.letterImgData.length ?
        <div className={`flex flex-col justify-evenly h-full m-2 p-6 rounded
        ${submitted && 'animate-letterDisappear'}`}>

            <canvas id={props.cid} className={`bg-white rounded shadow mb-2`}>
            </canvas>

            <div className="flex flex-col">
                {submitted || <input
                    type="text"
                    className="p-2 mb-1 rounded shadow"
                    placeholder="What's the above letter?"
                    onChange={onTextLetterChange}
                    value={letter}
                />}

                {submitted || 
                <button className="p-2 bg-green-500 hover:bg-white text-white
                hover:text-green-500 rounded duration-200"
                onClick={addToDBHandler}>
                    Submit
                </button>}
            </div>
        </div> : ''
    );
}


const CheckLetters = (props) => {
    const alphabet = ['أ', 'إ', 'ا','ال', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ',
    'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل','لا', 'م', 'ن', 'ه', 'و', 'ي'];

    // Check if a specific letter is in learnedTexts list
    const isLetterKnown = (letter) => {
        for (let i = 0; i < props.learnedTexts.length; i++) {
            if (props.learnedTexts[i] === letter) return true;
        }

        return false;
    }
    
    // return JSX statement
    return (
        <div className="w-full h-full bg-red-300 overflow-y-scroll divide-y">
        {
            alphabet.map((l) => 
                <div className={`flex flex-row justify-between p-2 ${isLetterKnown(l) ? 'bg-green-400' : 'bg-red-400'}`}>
                    <label className="text-white">{isLetterKnown(l) ? 'تم' : 'معلق'}</label>
                    <label className="text-white text-xl">{l}</label>
                </div>
            )
        }
        </div>
    );
}