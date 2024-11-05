import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([
    { sender: 'bot', text: 'Hi there! How can I help you today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message to conversation
    const newConversation = [...conversation, { sender: 'user', text: userInput }];
    setConversation(newConversation);
    setUserInput('');
    setIsTyping(true);

    try {
      // Send the user input to the backend API
      const response = await axios.post('/api/chatbot', { message: userInput });
      const botMessage = response.data.message;

      // Add bot response to conversation
      setConversation([...newConversation, { sender: 'bot', text: botMessage }]);
    } catch (error) {
      setConversation([...newConversation, { sender: 'bot', text: 'Sorry, something went wrong!' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Icon */}
      <button
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none"
        onClick={toggleChatbot}
      >
        💬 Help
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white shadow-lg rounded-lg w-80 max-w-sm p-4 mt-2">
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <h2 className="text-lg font-semibold text-gray-800">Ascent Assistant</h2>
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={toggleChatbot}
            >
              ✕
            </button>
          </div>

            {/* Intro Text */}
                <div className="text-sm text-gray-600 content-center">
                <img src="https://media.istockphoto.com/id/1010001882/vector/%C3%B0%C3%B0%C2%B5%C3%B1%C3%B0%C3%B1%C3%B1.jpg?s=612x612&w=0&k=20&c=1jeAr9KSx3sG7SKxUPR_j8WPSZq_NIKL0P-MA4F1xRw=" alt="Logo" className="w-8 h-8 mr-2" />
                <p>Welcome to Ascent Assistant! Here to help you navigate and get the best out of your portal experience. Ask me anything!</p>
                </div>

           {/* Conversation Messages */}
          <div className="overflow-y-auto h-64 border-b mb-2 p-2 space-y-2">
             {conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-2 rounded-lg text-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-gray-500 text-sm italic">Chatbot is typing...</div>
            )}
          </div>

          {/* User Input */}
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              style={{color: 'grey'}}
              value={userInput}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 focus:outline-none"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;


// Chatbot.jsx (With Integrated API)

// import React, { useState } from "react";

// const Chatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [userMessage, setUserMessage] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Function to handle sending the user's message to the backend
//   const sendMessageToChatbot = async (userMessage) => {
//     try {
//       setLoading(true);
//       const response = await fetch("http://localhost:5000/api/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ message: userMessage }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           { sender: "user", content: userMessage },
//           { sender: "bot", content: data.botMessage },
//         ]);
//       } else {
//         console.error("Error:", data.error);
//       }
//     } catch (error) {
//       console.error("Failed to send message:", error);
//     } finally {
//       setLoading(false);
//       setUserMessage(""); // Clear input after sending
//     }
//   };

//   // Handle user message submit
//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (userMessage.trim()) {
//       sendMessageToChatbot(userMessage);
//     }
//   };

//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//       {/* Toggle Chatbot Button */}
//       <button
//         className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         Chat
//       </button>

//       {/* Chatbot Window */}
//       {isOpen && (
//         <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 mt-2 w-80 h-96 flex flex-col">
//           <h3 className="text-xl font-semibold mb-4 text-center">Chatbot Assistant</h3>
//           <div className="flex-1 overflow-y-auto mb-4 p-2 border-t border-gray-200 space-y-2">
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`${
//                   msg.sender === "user" ? "text-right" : "text-left"
//                 }`}
//               >
//                 <p
//                   className={`inline-block p-2 rounded-lg ${
//                     msg.sender === "user"
//                       ? "bg-blue-500 text-white"
//                       : "bg-gray-200 text-gray-800"
//                   }`}
//                 >
//                   {msg.content}
//                 </p>
//               </div>
//             ))}
//             {loading && (
//               <div className="text-gray-500 text-center">
//                 Typing...
//               </div>
//             )}
//           </div>

//           {/* Input for User Messages */}
//           <form onSubmit={handleSendMessage} className="flex items-center">
//             <input
//               type="text"
//               placeholder="Type a message..."
//               value={userMessage}
//               onChange={(e) => setUserMessage(e.target.value)}
//               className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               type="submit"
//               disabled={loading}
//               className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 disabled:opacity-50"
//             >
//               Send
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chatbot;
