import { React } from 'react';
import { scrollToBottom } from '../static/js/functions.js';


const Header = (props) => {
    const getStarted = ({ target }) => {
        props.getStartedHandler();
        setTimeout(() => scrollToBottom(document.getElementById("Header")), 1000);
    }

    return (
        <div id="Header" className="text-center h-screen overflow-hidden"> 
            <div className="flex flex-col md:flex-row w-full h-full bg-black bg-opacity-25
            animate__animated animate__fadeIn">
                
                <div className="flex-1 p-5 select-none
                flex flex-col justify-evenly" style={{color: '#e7e7e7'}}>

                    <div className="animate__animated animate__fadeIn">
                        <p className="text-3xl md:text-7xl font-semibold p-3 my-3 rounded
                        hover:bg-opacity-30 hover:bg-black transition duration-300">
                            Arabic OCR (Beta)
                        </p>
                        <p className="md:text-xl font-semibold p-4 rounded
                        hover:bg-opacity-30 hover:bg-black transition duration-300">
                            I've already done the hard work for you by breaking the words
                            down into letters; now it's your responsibility to construct
                            your own OCR programme by supplying the application with
                            letter-image pairs. ^_^
                        </p>
                    </div>
                    
                    <div className="my-3">
                        <button className="sm:text-xl p-2 md:p-6 rounded border
                        hover:bg-white hover:text-black transition
                        animate__animated animate__fadeIn"
                        onClick={getStarted}>
                            Get Started
                        </button>
                    </div>

                    <div>
                        Created by <a 
                        className="text-blue-200 font-semibold"
                        href="https://www.linkedin.com/in/mo-ehab/" 
                        rel="noreferrer" 
                        target="_blank">
                            Mahmoud Ehab
                        </a>
                    </div>
                </div>

                <div className="flex-1 p-5 bg-black bg-opacity-40
                flex flex-col items-center justify-center
                animate__animated animate__fadeInRight animate__delay-1s">
                    <img
                        alt=''
                        className="bg-black bg-opacity-70 rounded-xl"
                        src='OCR.gif'
                    />
                </div>

            </div>
        </div>
    );
}

export default Header;