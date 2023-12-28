import { format } from 'date-fns';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { GoPerson } from 'react-icons/go';
import { useGlobal } from '../context';

function Chatty({ message, time, uniqueId }) {
  // Convert Firestore timestamp to JavaScript Date object
  const dateObject = time.toDate();
  const { uniqueId: contextUniqueId } = useGlobal();

  // Format the date as a string
  const formattedTime = format(dateObject, 'hh:mm a'); // Adjust the format as needed

  const [select, setSelect] = useState(false);
  const { isLight } = useGlobal();

  return (
    <>
      {uniqueId === contextUniqueId ? (
        <div className="flex relative  w-full items-center justify-end   ">
          <span className={`px-4 py-3 rounded-[20px] bg-blue-500 ${isLight ? 'text-white':''}  min-w-[20px]  `}>{message}</span>
          <span className={` ${isLight ? 'text-gray-600 font-[600] ':'text-gray-400'} absolute -bottom-5 right-2 text-[12px]`}>{formattedTime}</span>
        </div>
      ) : (
        <div className="flex relative  w-full items-center justify-start   ">
          <span className={`px-4 py-3 rounded-[15px] ${isLight ?'text-black bg-white shadow-sm ':'bg-gray-700'} min-w-[20px]  `}>
            <span className={` ${isLight ? 'text-gray-600 font-[600] ':'text-gray-400'} absolute -bottom-5 left-2 text-[12px]`}>{formattedTime}</span>
            {message}
          </span>
        </div>
      )}
    </>
  );
}

export default Chatty;
