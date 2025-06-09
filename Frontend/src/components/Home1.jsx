import React, { useContext, useState } from 'react';
import "../App.css";
import { RiImageAiLine } from "react-icons/ri";
import { LuImagePlus } from "react-icons/lu";
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import { FaPlus, FaArrowUp } from "react-icons/fa6";
import Chat from './Chat'; 


function Home1() {
   const { 
      startRes, setStartRes, popUp, setPopUp, input, setInput, 
      feature, setFeature, showResult, setShowResult, prevFeature, setPrevFeature, genImgUrl, setGenImgUrl 
   } = useContext(dataContext);

   async function handleSubmit(e) {
      e.preventDefault(); // Ensure preventDefault is called correctly
      if (!input) return;

      setStartRes(true);
      setPrevFeature(feature);
      setShowResult("");

      prevUser.data = user.data;
      prevUser.mime_type = user.mime_type;
      prevUser.imgUrl = user.imgUrl;
      prevUser.prompt = input;

      setInput(""); // Clear input field
      console.log("Params before API call:", prevUser);
      let result = await generateResponse(prevUser); 
      setShowResult(result);
      setFeature("chat");

      // Reset user image data
      user.data = null;
      user.mime_type = null;
      user.imgUrl = null;
   }

   function handleImage(e) {
      setFeature("upimg");
      let file = e.target.files[0];

      if (file) {
         let reader = new FileReader();
         reader.onload = (event) => {
            let base64 = event.target.result.split(",")[1];
            user.data = base64;
            user.mime_type = file.type;
            user.imgUrl = `data:${user.mime_type};base64,${user.data}`;
         };
         reader.readAsDataURL(file);
      }
   }

   async function handleGenerateImg(e) {
      e.preventDefault(); // Prevent form submission
      setStartRes(true);
      setPrevFeature(feature);
      setGenImgUrl("");
      prevUser.prompt = input;

      try {
         let result = await query(prevUser);
         let url = URL.createObjectURL(result);
         setGenImgUrl(url);
      } catch (error) {
         console.error("Error generating image:", error);
      }

      setInput("");
      setFeature("chat");
   }

   return (
      <div className='home'>
         <nav>
            <div className="logo" onClick={() => {
               setStartRes(false);
               setFeature("chat");
            }}>Smart AI Bot</div>
         </nav>
         <input type="file" accept='image/*' hidden id="inputImg" onChange={handleImage} />

         {!startRes ? (
            <div className="hero">
               <span id="tag">What can I help with?</span>
               <div className="cate">
                  <div className="upImg" onClick={() => document.getElementById("inputImg").click()}>
                     <LuImagePlus />
                     <span>Upload Image</span>
                  </div>
                  <div className="genImg" onClick={() => setFeature("genimg")}>
                     <RiImageAiLine />
                     <span>Generate Image</span>
                  </div>
                  <div className="chat" onClick={() => setFeature("chat")}>
                     <MdOutlineChatBubbleOutline />
                     <span>Let's Chat</span>
                  </div>
               </div>
            </div>
         ) : (
            <Chat />
         )}

         <form className="input-box" onSubmit={(e) => {
            if (input) {
               if (feature === "genimg") {
                  handleGenerateImg(e);
               } else {
                  handleSubmit(e);
               }
            }
         }}>
            <img src={user.imgUrl} alt="" id="im" />

            {popUp ? (
               <div className="pop-up">
                  <div className="select-up" onClick={() => {
                     setPopUp(false);
                     setFeature("chat");
                     document.getElementById("inputImg").click();
                  }}>
                     <LuImagePlus />
                     <span>Upload Image</span>
                  </div>
                  <div className="select-gen" onClick={() => {
                     setFeature("genimg");
                     setPopUp(false);
                  }}>
                     <RiImageAiLine />
                     <span>Generate Image</span>
                  </div>
               </div>
            ) : null}

            <div id="add" onClick={() => setPopUp(prev => !prev)}>
               {feature === "genimg" ? <RiImageAiLine id="genImg" /> : <FaPlus />}
            </div>

            <input
               type="text"
               placeholder="Ask Something.."
               value={input}
               onChange={(e) => setInput(e.target.value)}
            />
            {input && (
               <button id="submit" type="submit">
                  <FaArrowUp />
               </button>
            )}
         </form>
      </div>
   );
}

export default Home1;
