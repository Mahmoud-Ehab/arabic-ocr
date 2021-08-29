import React from 'react';
import { useEffect } from "react";

const TestResult = (props) => {
    const closeHandler = () => {
        props.hideTestResult();
    }

    useEffect(() => {
        // Get the Canvas & CanvasContext
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');

        // Initialize some variables to the letter properties
        let letter = props.result;
        let width = letter[0].length;
        let height = letter.length;

        // Initialize the letter ImageData (iData)
        let tmp = pixelsToHex(letter);
        let array = new Uint32Array(width * height);
        for(let i=0; i < array.length; i++) array[i] = parseInt(tmp[i]);
        let iData = new ImageData(new Uint8ClampedArray(array.buffer), width, height);

        // Draw The letter in the canvas
        ctx.putImageData(iData, (canvas.width-width)/2, (canvas.height-height)/2);
    })

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

    return (
        <div className="fixed flex flex-col justify-center items-center text-white
        w-screen h-screen z-30 animate__animated animate__jackInTheBox select-none"
        onClick={closeHandler}>

            <canvas id="canvas" className={`bg-white rounded shadow`}>
            </canvas>

            <p className="w-3/4 sm:w-1/2 text-center my-6 p-3
            bg-black bg-opacity-75 rounded">
                The red horizontal row is the DecisionRow, you have 
                located it with the yaxis value. The vertical lines should be 
                positioned in a way that proparly decompise the word into letters.
                If It's not, then change yaxis value and give another shot.
            </p>
            

            <p className="w-3/4 sm:w-1/2 text-center p-3
            bg-black bg-opacity-75 rounded">
                For Best Results: Presume that Arabic has 756 letters instead of 28.
            </p>
        </div>
    );
}

export default TestResult;