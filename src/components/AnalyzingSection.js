import { OpenCvProvider } from 'opencv-react';
import { React, useState } from 'react';
import { scrollToBottom, toast } from '../static/js/functions';

const AnalyzingSection = (props) => {
    const [cv, setCV] = useState(null);

    const uploadImage = () => {
        document.getElementById('fileInput').click();
    }
    const pickImage = (e) => {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(e.target.files[0]);

        if (!img.src) return;

        img.onload = () => {
            let mat = cv.imread(img);
            cv.imshow('canvas', mat);
            mat.delete();

            lowResolution();
        }
    }

    const lowResolution = () => {
        let src = cv.imread('canvas');
        let dst = new cv.Mat();
        
        let width = src.cols;
        let height = src.rows;

        if (src.cols > 1000) {
            height *= 1000 / width;
            width *= 1000 / width;
        }
        else {
            width = width/1.25;
            height = height/1.25;
        }
        if (height > 1000) {
            width *= 1000 / height;
            height *= 1000 / height;
        }

        width = parseInt(width);
        height = parseInt(height);

        toast("Resolution: " + width + " x " + height, "#e1b12c", 2500);

        let dsize = new cv.Size(width, height);

        // You can try more different parameters
        cv.resize(src, dst, dsize, 0, 0, cv.INTER_AREA);
        cv.imshow('canvas', dst);
        src.delete(); dst.delete();
    }

    const optimizeImage = () => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        // Make the img grayscale
        for (let i = 0; i < imgData.length; i += 4) { 
            const colorAvg = (imgData[i] + imgData[i+1] + imgData[i+2]) / 3;
            imgData[i] = colorAvg;
            imgData[i+1] = colorAvg;
            imgData[i+2] = colorAvg;
        }

        // Evaluate the best boundary
        let sum = 0
        let count = 0
        for (let i = 0; i < imgData.length; i++) { 
            count += 1;
            sum += imgData[i];
        }
        const boundary = sum / count;

        // Change image colors
        for (let i = 0; i < imgData.length; i += 4) { 
            if (imgData[i] > boundary/1.5) {
                imgData[i] = 0;
                imgData[i+1] = 0;
                imgData[i+2] = 0;
            }
            else {
                imgData[i] = 255;
                imgData[i+1] = 255;
                imgData[i+2] = 255;
            }
        }

        // Instantiate ImageData Object and use it in ctx
        let iData = new ImageData(
            new Uint8ClampedArray(imgData), 
            canvas.width, 
            canvas.height
        );
        ctx.putImageData(iData, 0, 0);
    }

    // Analyze Image Function
    const analyze = () => {
        props.clearLettersHandler();
        props.toggleLoading();

        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        const PixelsAggregator = new Worker('./WebWorkers/PixelsAggregator.js');
        PixelsAggregator.postMessage({
            imgData: ctx.getImageData(0, 0, canvas.width, canvas.height).data,
            width: ctx.getImageData(0, 0, canvas.width, 1).data.length
        });
        props.setLoadingStateHandler('Preprocessing...');

        PixelsAggregator.onmessage = (e) => {
            props.setLoadingStateHandler('Analyzing data...');

            // AnalyzeRequest Worker takes turn
            const AnalyzeRequest = new Worker('./WebWorkers/AnalyzeRequest.js');
            AnalyzeRequest.postMessage({
                imgData: e.data
            });
            AnalyzeRequest.onmessage = (e) => {
                let letters = e.data;
                
                letters.forEach((letter, i) => {
                    props.addLetterHandler(letter);
                });

                props.finalizeHandler();
                scrollToBottom(document.getElementById('AnalyzingSection'));
                AnalyzeRequest.terminate();
            }
            AnalyzeRequest.onerror = (e) => {
                props.toggleLoading();
                toast('AnalyzeRequest: ' + e.message, '#321213', 5000);
                AnalyzeRequest.terminate();
            }

            PixelsAggregator.terminate();
        }
        PixelsAggregator.onerror = (e) => {
            props.toggleLoading();
            toast('PixelsAggregator: ' + e.message, '#321213', 5000);
            PixelsAggregator.terminate();
        }
    }

    // Test function
    const test = () => {
        props.toggleLoading();

        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        const PixelsAggregator = new Worker('./WebWorkers/PixelsAggregator.js');
        PixelsAggregator.postMessage({
            imgData: ctx.getImageData(0, 0, canvas.width, canvas.height).data,
            width: ctx.getImageData(0, 0, canvas.width, 1).data.length
        });
        props.setLoadingStateHandler('Preprocessing...');

        PixelsAggregator.onmessage = (e) => {
            props.setLoadingStateHandler('Analyzing data...');

            // TestRequest Worker takes turn
            const TestRequest = new Worker('./WebWorkers/TestRequest.js');
            TestRequest.postMessage({
                imgData: e.data
            });
            TestRequest.onmessage = (e) => {
                props.toggleLoading();
                props.showTestResultHandler(e.data);
                TestRequest.terminate();
            }
            TestRequest.onerror = (e) => {
                props.toggleLoading();
                toast('TestRequest: ' + e.message, '#321213', 5000);
                TestRequest.terminate();
            }

            PixelsAggregator.terminate();
        }
        PixelsAggregator.onerror = (e) => {
            props.toggleLoading();
            toast('PixelsAggregator: ' + e.message, '#321213', 5000);
            PixelsAggregator.terminate();
        }
    }

    // Load OpenCV lib
    const onLoaded = (cv) => {  
        setCV(cv);
    }

    return ( props.appear &&
        <OpenCvProvider onLoad={onLoaded}>
        <div id="AnalyzingSection"
        className="flex flex-col-reverse sm:flex-row bg-gray-800 bg-opacity-80
        items-center h-auto sm:h-screen p-3 animate__animated animate__fadeIn">

            <div className="flex flex-col flex-1 w-full bg-black bg-opacity-30
            h-full rounded overflow-hidden">
                {!cv && 
                    <p className='text-white text-3xl m-auto'>
                        Loading OpenCV.js...
                    </p>
                }
                {cv && 
                    <div className="flex flex-col h-full">
                    <input 
                        type="file" 
                        id="fileInput" 
                        className={'hidden'}
                        onChange={pickImage} 
                    />

                    <button 
                    className="bg-gray-200 p-3 shadow-inner
                    hover:bg-black hover:text-white transition"
                    onClick={uploadImage}> 
                        Upload Image
                    </button>

                    <div className="h-full shadow overflow-auto">
                        <canvas id="canvas" className="w-full"></canvas>
                    </div>
                    
                    <button 
                    className="bg-black bg-opacity-30 p-3
                    hover:bg-black text-white transition"
                    onClick={lowResolution}> 
                        Low Resolution
                    </button>

                    <button 
                    className="bg-black bg-opacity-30 p-3
                    hover:bg-black text-white transition"
                    onClick={optimizeImage}> 
                        Optimize / Switch White-Black
                    </button>

                    <button 
                    className="bg-black bg-opacity-30 p-3
                    hover:bg-black text-white transition"
                    onClick={analyze}> 
                        Analyze
                    </button>
                    </div>
                }
            </div>

            <div className="flex flex-col flex-1 p-6 overflow-auto
            bg-black bg-opacity-10 h-full text-white">
                
                <div className="select-none">
                    <h1 className="text-2xl font-bold my-1">
                        Analyzing Section
                    </h1>
                    <p className="text-justify mb-4">
                        Here's where the action happens: upload your text image, 
                        then click the "Analyze" button at the bottom to begin 
                        breaking it down into letters, so we can start the learning phase.
                        But before that, if the image isn't already black-and-white, you must 
                        convert it, you might reduce the resolution of the image, and you may 
                        wish to put the algorithm to the test first.
                    </p>
                    
                    <h1 className="text-2xl font-bold my-1">
                        Optimizing The Image
                    </h1>
                    <p className="text-justify mb-4">
                        Once you click the "Optimize" button at the bottom, the image 
                        will be converted to black-and-white, that will eliminate pixelization.
                        <span className="font-bold"> Keep in mind that the text must be provided in black. </span>
                    </p>

                    <h1 className="text-2xl font-bold my-1">
                        Low Resolution
                    </h1>
                    <p className="text-justify mb-4">
                    The image's resolution is automatically lowered after it is uploaded,
                    in order to obtain a greater level of performance. Every time you press the button,
                    the resolution will be reduced by a fifth which is not usually required as the 
                    automatic execution do well.
                    </p>

                    <h1 className="text-2xl font-bold my-1">
                        Testing
                    </h1>
                    <p className="text-justify mb-4">
                    Actually, the test button is meant to be used for illustrative purposes only, 
                    to examine what's going on behind the scenes.
                    </p>

                </div>

                {cv && <button className="text-white font-black w-1/3 m-auto p-3 
                rounded border-2 border-white hover:bg-gray-900 transition"
                onClick={test}>
                    Test
                </button>}
            </div>
            
        </div>
        </OpenCvProvider>
    );
}

export default AnalyzingSection;