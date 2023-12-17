import React, { useState, useEffect, useRef } from "react";
import {
  addDoc,
  deleteDoc,
  onSnapshot,
  doc,
  collection,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./config/firebase";
import { useGlobal } from "./context";
import profile from "./../src/msgcomp/images/avatars/image-amyrobson.png";
import reply from "./../src/msgcomp/images/icon-delete.svg";
import { motion, AnimatePresence } from "framer-motion";
import { VscSend, VscArrowSmallDown } from "react-icons/vsc";
import Chat from "./tesComponent/Chat";
import Loading from "./tesComponent/Loading";
import Nav from "./tesComponent/Nav";
import Menu from "./tesComponent/Menu";
import CreateRoom from "./tesComponent/CreateRoom";
import JoinRoom from "./tesComponent/JoinRoom";

// New InputBox SubComponent
const InputBox = ({ msg, handleKeyPress, handleMsgChange, handleClick }) => {
  return (
    <div className="flex z-40 gap-2 fixed sm:left-0 left-1 bottom-6 sm:bottom-10 w-full px-8 items-center mt-6 items-center  sm:justify-center justify-start ">
      <input
        type="text"
        placeholder="Unleash Your Thoughts Anonymously"
        value={msg}
        onKeyPress={handleKeyPress}
        onChange={handleMsgChange}
        className="w-full max-w-[500px] text-black outline-none bg-white placeholder-text-black  border-2 border-gray-300 shadow-md px-4 py-3 sm:h-[70px] h-[60px] text-[14px] rounded-[25px] focus:border-blue-500 transition duration-300"
      />

      <motion.button
        whileTap={{
          scale: 0.95,
        }}
        transition={{
          duration: 0.3,
        }}
        className="bg-blue-500 text-white h-[50px] px-3 w-[50px] flex items-center justify-center rounded-[50%] transition duration-300 hover:bg-blue-600 focus:outline-none"
        onClick={handleClick}
      >
        <VscSend size={30} />
      </motion.button>
    </div>
  );
};
const MessageList = ({ msgList, messagesEndRef }) => {
  return (
    <motion.div layout className="flex flex-col  gap-4  capitalize  ">
      {msgList.map((doc) => (
        <Chat key={doc.id} message={doc.message} time={doc.time} />
      ))}
      <div ref={messagesEndRef}></div>
    </motion.div>
  );
};
function Messages() {
  const messagesEndRef = useRef(null);
  const {
    nav,
    setNav,
    general,
    setGeneral,
    createRoom,
    setCreateRoom,
    joinRoom,
    setJoinRoom,
  } = useGlobal();
  const collectionRef = collection(db, "messages");
  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState([]);
  const unsubscribeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    if (!msg.trim()) {
      return;
    } else {
      const date = new Date();
      try {
        await addDoc(collectionRef, { message: msg, time: date });
        setMsg("");
      } catch (err) {
        console.error(err);
        setError("Failed to add the message");
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleClick();
    }
  };

  const handleMsgChange = (event) => {
    setMsg(event.target.value);
  };

  const getMessages = () => {
    try {
      const q = query(collectionRef, orderBy("time", "asc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const updatedData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setIsLoading(false);
        setMsgList(updatedData);
      });

      unsubscribeRef.current = unsubscribe;
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setError("Failed to fetch messages");
    }
  };

  useEffect(() => {
    getMessages();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgList]);

  return (
    <div className="flex flex-col bg-white px-6 items-center justify-center pb-20 ">
      <Nav />
      <AnimatePresence>{nav && <Menu />}</AnimatePresence>
      {/* Use the InputBox component */}
      <InputBox
        msg={msg}
        handleKeyPress={handleKeyPress}
        handleMsgChange={handleMsgChange}
        handleClick={handleClick}
      />
      {(general && (
        <div>
          {isLoading ? (
            <Loading />
          ) : (
            <MessageList msgList={msgList} messagesEndRef={messagesEndRef} />
          )}
        </div>
      )) ||
        (createRoom && <CreateRoom />)
        ||
        (joinRoom && <JoinRoom/>)
        } 

      <button
        className=" fixed z-40 br flex items-center justify-center h-[40px] w-[40px] rounded-[50%] bg-white bottom-[100px] right-2 text-gray-900 "
        onClick={() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <VscArrowSmallDown size={30} />
      </button>
    </div>
  );
}

export default Messages;
