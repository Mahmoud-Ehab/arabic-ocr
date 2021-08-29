import { React } from 'react';

const Loading = (props) => {
    return (
        <div className="fixed flex flex-row justify-center items-center
        w-screen h-screen z-30 animate__animated animate__fadeIn">

          <div className="bg-white animate-pulse sm:text-xl shadow-2xl 
          border-2 border-black rounded p-4">
            {props.state}
          </div>

        </div>
    );
}

export default Loading;