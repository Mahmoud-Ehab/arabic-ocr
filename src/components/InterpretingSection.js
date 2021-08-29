import { React, useState } from 'react';
import { toast } from '../static/js/functions';

const InterpretingSection = (props) => {
    const [text, setText] = useState('');

    const getText = () => {
        // Interpreter Worker takes turn
        const Interpreter = new Worker('./WebWorkers/Interpreter.js');
        Interpreter.postMessage({
            target: props.letters,
            X: props.images,
            y: props.texts
        });
        Interpreter.onmessage = (e) => {
            const letters = e.data;

            let text = "";
            letters.forEach(letter => {
                text += letter;
            });
            setText(text);

            Interpreter.terminate();
        }
        Interpreter.onerror = (e) => {
            toast('Interpreter: ' + e.message, '#321213', 5000);
            Interpreter.terminate();
        }
    }

    return (
        <div className={`flex flex-col w-screen h-screen fixed bg-black bg-opacity-25 z-10
        justify-evenly items-center`}>

            <div className="flex flex-col w-screen h-screen justify-evenly items-center
            animate__animated animate__jackInTheBox">

            <div className="flex flex-col w-1/2 md:w-1/3 rounded">
                <a className="text-center sm:text-xl text-bold text-white
                hover:text-blue-600 bg-blue-500 hover:bg-gray-200 transition
                mb-3 py-3 rounded shadow"
                href="https://www.linkedin.com/in/mo-ehab"
                target="_blank"
                rel="noreferrer">
                    <p>Contact me</p>
                </a>

                <a className="text-center sm:text-xl text-bold text-white
                hover:text-gray-900 bg-gray-800 hover:bg-gray-200 transition
                mb-3 py-3 rounded shadow"
                href="https://github.com/Mahmoud-Ehab/arabic-ocr"
                target="_blank"
                rel="noreferrer">
                    <p>GitHub - Source Code</p>
                </a>
            </div>

            <a href="https://www.buymeacoffee.com/MoEhab" 
            className="flex justify-center"
            target="_blank"
            rel="noreferrer">
                <img className="shadow hover:shadow-lg transition"
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
                alt="Buy Me A Coffee" 
                width="217"
                height="60"/>   
            </a>

            <div className="flex flex-col bg-gray-100 w-96 p-6 rounded shadow">
                {text && <p class='text-right overflow-y-scroll break-words 
                select-all w-full flex-grow p-3'>
                    {text}
                </p>}
                
                {!text && <button className="shadow p-3"
                onClick={getText}>
                    Show Text
                </button>}
            </div>

            <button className="text-white text-2xl"
            onClick={props.toggleLearnedHandler}>
                X
            </button>

            </div>
        </div>
    );
}

export default InterpretingSection;