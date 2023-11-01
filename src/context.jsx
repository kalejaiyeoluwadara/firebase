import React, { useContext, useState, useEffect } from "react";
const AppContext = React.createContext();
import { motion, AnimatePresence } from "framer-motion";

function AppProvider({ children }) {
 const [name,setName] = useState("User101");
 const [img, setImg] = useState(
   "https://lh3.googleusercontent.com/a/ACg8ocI-XIxka7VH209b-UB9U9lPqA2g-omrmvg_211bWyYUCw=s96-c"
 );
  return (
    <AppContext.Provider value={{img,setImg,name,setName}} >
      {children}
    </AppContext.Provider>
  );
}
export const useGlobal = () => {
  return useContext(AppContext);
};

export default AppProvider;
