import React from 'react'

const IconButton = ({ icon, onClick, className }) => {
    return (
        <button 
            onClick={onClick} 
            className={`flex justify-center items-center w-12 h-12 rounded-md border-[1px] border-[#e3ebf6] text-xl ${className}`} 
        >
            {icon}
        </button>
    );
};


export default IconButton
