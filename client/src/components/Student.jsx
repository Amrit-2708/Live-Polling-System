// import React, { useState, useEffect } from 'react';
// import socket from '../socket';

// export default function Student() {
//     const [name, setName] = useState("");
//     const [registered, setRegistered] = useState(false);
//     const [questionData, setQuestionData] = useState(null);
//     const [selected, setSelected] = useState("");
//     const [results, setResults] = useState({});
//     const [submitted, setSubmitted] = useState(false);
//     const [timeLeft, setTimeLeft] = useState(15);

//     useEffect(() => {
//         socket.on('new-question', (data) => {
//             setQuestionData(data);
//             setSelected("");
//             setResults({});
//             setSubmitted(false);
//             setTimeLeft(15);
//         });

//         socket.on('poll-update', (data) => setResults(data));

//         return () => {
//             socket.off('new-question');
//             socket.off('poll-update');
//         };
//     }, []);

//     useEffect(() => {
//         if (!questionData || submitted) return;
//         if (timeLeft <= 0) return;
//         const timer = setInterval(() => {
//             setTimeLeft(prev => prev - 1);
//         }, 1000);
//         return () => clearInterval(timer);
//     }, [questionData, submitted, timeLeft]);

//     const register = () => {
//         if (!name.trim()) return;
//         socket.emit('register-student', name);
//         setRegistered(true);
//     };

//     const submitAnswer = () => {
//         if (!selected) return;
//         socket.emit('submit-answer', selected);
//         setSubmitted(true);
//     };

//     // Utility to calculate percentage
//     const getPercentage = (option) => {
//         const totalVotes = Object.values(results).reduce((a, b) => a + b, 0);
//         if (totalVotes === 0) return 0;
//         return Math.round((results[option] || 0) / totalVotes * 100);
//     };

//     // ---------- Registration Page ----------
//     if (!registered) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-screen bg-white">
//                 <div className="mb-4">
//                     <span
//                         className="px-4 py-1 text-white text-sm font-medium rounded-full"
//                         style={{ backgroundColor: "#7765DA" }}
//                     >
//                         ✨ Intervue Poll
//                     </span>
//                 </div>

//                 <h1 className="text-3xl md:text-4xl font-semibold text-center mb-2">
//                     Let’s <span className="font-bold">Get Started</span>
//                 </h1>

//                 <p className="text-gray-500 text-center mb-10 max-w-xl">
//                     If you’re a student, you’ll be able to <span className="font-bold">submit your answers</span>,
//                     participate in live polls, and see how your responses compare with your classmates
//                 </p>

//                 <div className="flex flex-col items-start w-80 mb-8">
//                     <label className="text-gray-700 text-sm mb-2">Enter your Name</label>
//                     <input
//                         type="text"
//                         value={name}
//                         onChange={e => setName(e.target.value)}
//                         placeholder="Enter your name"
//                         className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#7765DA]"
//                     />
//                 </div>

//                 <button
//                     onClick={register}
//                     disabled={!name.trim()}
//                     className={`px-12 py-2 rounded-full text-white font-medium transition 
//                         ${name.trim() ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
//                     style={{ backgroundColor: "#7765DA" }}
//                 >
//                     Continue
//                 </button>
//             </div>
//         );
//     }

//     // ---------- Waiting Page ----------
//     if (registered && !questionData) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-screen bg-white">
//                 <div className="mb-6">
//                     <span
//                         className="px-4 py-1 text-white text-sm font-medium rounded-full"
//                         style={{ backgroundColor: "#7765DA" }}
//                     >
//                         ✨ Intervue Poll
//                     </span>
//                 </div>

//                 <div className="mb-6">
//                     <div
//                         className="w-10 h-10 border-4 border-[#7765DA] border-t-transparent rounded-full animate-spin"
//                     ></div>
//                 </div>

//                 <h1 className="text-xl font-bold text-center">
//                     Wait for the teacher to ask questions..
//                 </h1>
//             </div>
//         );
//     }

//     // ---------- Question / Result Page ----------
//     if (questionData) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-screen bg-white py-16">
//                 <div className="w-full max-w-2xl">
//                     {/* Question Header */}
//                     <div className="flex justify-between items-center mb-4">
//                         <h2 className="text-lg font-bold">Question 1</h2>
//                         <div className="flex items-center space-x-2">
//                             <span className="text-xl">⏱️</span>
//                             <span className="text-red-500 font-bold">
//                                 00:{timeLeft.toString().padStart(2, '0')}
//                             </span>
//                         </div>
//                     </div>

//                     {/* Question Box */}
//                     <div className="rounded-t-md bg-gradient-to-r from-gray-800 to-gray-700 text-white font-semibold px-4 py-3">
//                         {questionData.question}
//                     </div>

//                     {/* Options OR Results */}
//                     <div className="border border-[#7765DA] border-t-0 rounded-b-md p-4 space-y-3">
//                         {questionData.options.map((opt, idx) => {
//                             const percentage = getPercentage(opt);
//                             return (
//                                 <div key={idx} className="relative">
//                                     {!submitted ? (
//                                         // Before submit: clickable options
//                                         <div
//                                             onClick={() => setSelected(opt)}
//                                             className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition 
//                                                 ${selected === opt
//                                                     ? 'border border-[#7765DA] bg-white'
//                                                     : 'bg-gray-100 hover:bg-gray-200'
//                                                 }`}
//                                         >
//                                             <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
//                                                 ${selected === opt ? 'bg-[#7765DA] text-white' : 'bg-gray-300 text-gray-700'}
//                                             `}>
//                                                 {idx + 1}
//                                             </div>
//                                             <span className={`font-medium ${selected === opt ? 'text-black' : 'text-gray-700'}`}>
//                                                 {opt}
//                                             </span>
//                                         </div>
//                                     ) : (
//                                         // After submit: show results bar
//                                         <div className="relative flex items-center space-x-3 bg-gray-100 rounded-md overflow-hidden">
//                                             <div
//                                                 className="absolute top-0 left-0 h-full bg-[#7765DA] transition-all duration-500"
//                                                 style={{ width: `${percentage}%` }}
//                                             ></div>
//                                             <div className="flex items-center space-x-3 p-3 relative z-10 w-full">
//                                                 <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-[#7765DA] text-white">
//                                                     {idx + 1}
//                                                 </div>
//                                                 <span className="font-medium text-white">{opt}</span>
//                                                 <span className="ml-auto font-semibold text-black">{percentage}%</span>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             );
//                         })}
//                     </div>

//                     {/* Submit Button or Info */}
//                     {!submitted ? (
//                         <div className="flex justify-center mt-6">
//                             <button
//                                 onClick={submitAnswer}
//                                 disabled={!selected}
//                                 className={`px-12 py-2 rounded-full text-white font-medium transition 
//                                     ${selected ? '' : 'opacity-50 cursor-not-allowed'}`}
//                                 style={{
//                                     background: 'linear-gradient(to right, #7765DA, #4F46E5)'
//                                 }}
//                             >
//                                 Submit
//                             </button>
//                         </div>
//                     ) : (
//                         <p className="text-center mt-6 font-semibold">
//                             Wait for the teacher to ask a new question..
//                         </p>
//                     )}
//                 </div>
//             </div>
//         );
//     }

//     return null;
// }









import React, { useState, useEffect, useCallback } from 'react';
import socket from '../socket';

export default function Student() {
    const [name, setName] = useState("");
    const [registered, setRegistered] = useState(false);
    const [questionData, setQuestionData] = useState(null);
    const [selected, setSelected] = useState("");
    const [results, setResults] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15);
    const [kicked, setKicked] = useState(false);

    // Chat & Participants
    const [showChat, setShowChat] = useState(false);
    const [activeTab, setActiveTab] = useState("chat");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [participants, setParticipants] = useState([]);




    useEffect(() => {
        socket.on('you-have-been-kicked', () => {
            // 1. Set the state to show the kicked-out screen
            setKicked(true);
            // 2. The client disconnects itself
            socket.disconnect();
        });

        socket.on('new-question', (data) => {
            setQuestionData(data);
            setSelected("");
            setResults({});
            setSubmitted(false);
            // setTimeLeft(15);
            // --- UPDATED: Use the duration sent by the teacher ---
            setTimeLeft(parseInt(data.duration, 10) || 60);
        });

        socket.on('poll-update', (data) => setResults(data));

        // Listen for chat messages
        socket.on('chat-message', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        // Update participants list
        socket.on('update-participants', (list) => {
            setParticipants(list);
        });

        return () => {
            socket.off('new-question');
            socket.off('poll-update');
            socket.off('chat-message');
            socket.off('update-participants');
            socket.off('you-have-been-kicked');
        };
    }, []);
    
    const submitAnswer = useCallback(() => {
        socket.emit('submit-answer', selected || ""); // Send selection or empty string
        setSubmitted(true);
    }, [selected]);

    // useEffect(() => {
    //     if (!questionData || submitted) return;
    //     if (timeLeft <= 0) return;
    //     const timer = setInterval(() => {
    //         setTimeLeft(prev => prev - 1);
    //     }, 1000);
    //     return () => clearInterval(timer);
    // }, [questionData, submitted, timeLeft]);

    // --- UPDATED: Timer now auto-submits ---
    useEffect(() => {
        if (!questionData || submitted) return;

        if (timeLeft <= 0) {
            if (!submitted) {
                // Automatically submit when time runs out
                submitAnswer();
            }
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [questionData, submitted, timeLeft, submitAnswer]);

    const register = () => {
        if (!name.trim()) return;
        socket.emit('register-student', name);
        socket.emit('join-participants', name); // 👈 add this
        setRegistered(true);
    };

    // const submitAnswer = () => {
    //     if (!selected) return;
    //     socket.emit('submit-answer', selected);
    //     setSubmitted(true);
    // };


    // const submitAnswer = () => {
    //     socket.emit('submit-answer', selected || ""); // Send selection or empty string
    //     setSubmitted(true);
    // };



    const sendMessage = () => {
        if (!message.trim()) return;
        const msgObj = { user: name, text: message };
        socket.emit('chat-message', msgObj);
        setMessage("");
    };

    const getPercentage = (option) => {
        const totalVotes = Object.values(results).reduce((a, b) => a + b, 0);
        if (totalVotes === 0) return 0;
        return Math.round((results[option] || 0) / totalVotes * 100);
    };


    if (kicked) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center p-4">
                <span className="px-4 py-1 text-white text-sm font-medium rounded-full bg-[#7C3AED] mb-6">
                    ✨ Intervue Poll
                </span>
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-3">
                    You've been Kicked out !
                </h1>
                <p className="text-gray-500">
                    Looks like the teacher has removed you from the poll system. Please try again sometime.
                </p>
            </div>
        );
    }

    // ---------- Registration Page ----------
    if (!registered) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen mx-6 bg-white">
                <div className="mb-4">
                    <span
                        className="px-4 py-1 text-white text-sm font-medium rounded-full"
                        style={{ backgroundColor: "#7765DA" }}
                    >
                        ✨ Intervue Poll
                    </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-semibold text-center mb-2">
                    Let’s <span className="font-bold">Get Started</span>
                </h1>

                <p className="text-gray-500 text-center mb-8 max-w-xl">
                    If you’re a student, you’ll be able to <span className="font-bold">submit your answers</span>,
                    participate in live polls, and see how your responses compare with your classmates
                </p>

                <div className="flex flex-col items-start w-80 mb-8">
                    <label className="text-gray-700 text-sm mb-2">Enter your Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#7765DA]"
                    />
                </div>

                <button
                    onClick={register}
                    disabled={!name.trim()}
                    className={`px-12 py-2 rounded-full text-white font-medium transition 
                        ${name.trim() ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                    style={{ backgroundColor: "#7765DA" }}
                >
                    Continue
                </button>
            </div>
        );
    }

    // ---------- Waiting Page ----------
    if (registered && !questionData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="mb-6">
                    <span
                        className="px-4 py-1 text-white text-sm font-medium rounded-full"
                        style={{ backgroundColor: "#7765DA" }}
                    >
                        ✨ Intervue Poll
                    </span>
                </div>

                <div className="mb-6">
                    <div
                        className="w-10 h-10 border-4 border-[#7765DA] border-t-transparent rounded-full animate-spin"
                    ></div>
                </div>

                <h1 className="text-xl font-bold text-center">
                    Wait for the teacher to ask questions..
                </h1>

                {/* {renderChatButton()} */}
            </div>
        );
    }

    // ---------- Question / Result Page ----------
    const renderOptionsOrResults = () => (
        <div className="border border-[#7765DA] border-t-0 rounded-b-md p-4 space-y-3">
            {questionData.options.map((opt, idx) => {
                const percentage = getPercentage(opt);
                return (
                    <div key={idx} className="relative">
                        {!submitted ? (
                            // Before submit: clickable options
                            <div
                                onClick={() => setSelected(opt)}
                                className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition 
                                    ${selected === opt
                                        ? 'border border-[#7765DA] bg-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                                    ${selected === opt ? 'bg-[#7765DA] text-white' : 'bg-gray-300 text-gray-700'}
                                `}>
                                    {idx + 1}
                                </div>
                                <span className={`font-medium ${selected === opt ? 'text-black' : 'text-gray-700'}`}>
                                    {opt}
                                </span>
                            </div>
                        ) : (
                            // After submit: show results bar
                            <div className="relative flex items-center space-x-3 bg-gray-100 rounded-md overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-full bg-[#7765DA] transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                ></div>
                                <div className="flex items-center space-x-3 p-3 relative z-10 w-full">
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-[#7765DA] text-white">
                                        {idx + 1}
                                    </div>
                                    <span className="font-medium text-white">{opt}</span>
                                    <span className="ml-auto font-semibold text-black">{percentage}%</span>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );

    // const renderChatButton = () => (
    //     <>
    //         {/* Floating Chat Button */}
    //         <div
    //             className="fixed bottom-6 right-6 bg-[#7765DA] w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
    //             onClick={() => setShowChat(!showChat)}
    //         >
    //             💬
    //         </div>

    //         {showChat && (
    //             <div className="fixed bottom-24 sm:right-6 w-80 bg-white rounded-lg shadow-lg border overflow-hifdden flex flex-col">
    //                 {/* Tabs */}
    //                 <div className="flex border-b">
    //                     <button
    //                         className={`flex-1 py-2 text-sm font-semibold ${activeTab === "chat" ? "border-b-2 border-[#7765DA]" : ""
    //                             }`}
    //                         onClick={() => setActiveTab("chat")}
    //                     >
    //                         Chat
    //                     </button>
    //                     <button
    //                         className={`flex-1 py-2 text-sm font-semibold ${activeTab === "participants" ? "border-b-2 border-[#7765DA]" : ""
    //                             }`}
    //                         onClick={() => setActiveTab("participants")}
    //                     >
    //                         Participants
    //                     </button>
    //                 </div>

    //                 {/* Chat Tab */}
    //                 {activeTab === "chat" && (
    //                     <div className="flex flex-col h-80">
    //                         {/* Messages */}
    //                         <div className="flex-1 p-3 space-y-3 overflow-y-auto">
    //                             {messages.map((msg, idx) => (
    //                                 <div
    //                                     key={idx}
    //                                     className={`flex flex-col ${msg.user === name ? "items-end" : "items-start"
    //                                         }`}
    //                                 >
    //                                     {/* Sender Name */}
    //                                     {console.log(messages)}
    //                                     <span
    //                                         className={`text-xs font-semibold mb-1 ${msg.user === name ? "text-purple-600" : "text-blue-600"
    //                                             }`}
    //                                     >
    //                                         {/* {msg.user} */}
    //                                         {msg.message.user}

    //                                     </span>
    //                                     {/* Chat Bubble */}
    //                                     <div
    //                                         className={`px-3 py-2 max-w-[70%] text-white rounded-lg ${msg.user === name
    //                                             ? "bg-[#7765DA] rounded-br-none"
    //                                             : "bg-gray-800 rounded-bl-none"
    //                                             }`}
    //                                     >
    //                                         {msg.message.text}
    //                                         {/* console.log({msg.text}); */}
    //                                         {/* {console.log(msg.text)} */}
    //                                     </div>
    //                                 </div>
    //                             ))}
    //                         </div>

    //                         {/* Input Area */}
    //                         <div className="p-2 border-t flex">
    //                             <input
    //                                 type="text"
    //                                 value={message}
    //                                 onChange={(e) => setMessage(e.target.value)}
    //                                 placeholder="Type a message"
    //                                 className="flex-1 px-3 py-1 border rounded-l-md focus:outline-none"
    //                                 onKeyDown={(e) => e.key === "Enter" && sendMessage()}
    //                             />
    //                             <button
    //                                 onClick={sendMessage}
    //                                 className="bg-[#7765DA] text-white px-3 py-1 rounded-r-md hover:bg-purple-700"
    //                             >
    //                                 Send
    //                             </button>
    //                         </div>
    //                     </div>
    //                 )}

    //                 {/* Participants Tab */}
    //                 {activeTab === "participants" && (
    //                     <div className="h-80 overflow-y-auto p-3 space-y-2">
    //                         {participants.map((p, idx) => (
    //                             <div
    //                                 key={idx}
    //                                 className="p-2 rounded-md bg-gray-100 text-gray-800 text-sm font-medium"
    //                             >
    //                                 {p}
    //                             </div>
    //                         ))}
    //                     </div>
    //                 )}
    //             </div>
    //         )}
    //     </>
    // );

    const renderChatButton = () => (
        <>
            {/* Floating Chat Button */}
            <div
                className={`fixed bottom-6 right-6 bg-[#7765DA] w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg text-2xl z-40 ${showChat ? 'sm:flex' : 'flex'}`}
                onClick={() => setShowChat(true)}
            >
                💬
            </div>

            {/* Chat Popup */}
            {showChat && (
                <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-80 sm:max-h-[30rem] bg-white rounded-none sm:rounded-lg shadow-2xl border flex flex-col z-50">
                    <div className="flex items-center justify-between border-b p-2">
                        <h3 className="font-bold text-lg text-gray-700 pl-2">Live Chat</h3>
                        <button onClick={() => setShowChat(false)} className="p-2 rounded-full hover:bg-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="flex border-b">
                        <button
                            className={`flex-1 py-2 text-sm font-semibold ${activeTab === "chat" ? "border-b-2 border-[#7765DA] text-[#7765DA]" : "text-gray-500"}`}
                            onClick={() => setActiveTab("chat")}
                        >
                            Chat
                        </button>
                        <button
                            className={`flex-1 py-2 text-sm font-semibold ${activeTab === "participants" ? "border-b-2 border-[#7765DA] text-[#7765DA]" : "text-gray-500"}`}
                            onClick={() => setActiveTab("participants")}
                        >
                            Participants
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {activeTab === "chat" && (
                            <div className="p-3 space-y-4">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex flex-col ${msg.user === name ? "items-end" : "items-start"}`}>
                                        {/* --- SENDER'S NAME RE-ADDED HERE --- */}
                                        <span className="text-xs font-semibold mb-1 text-gray-500">
                                            {msg.message.user}
                                        </span>
                                        <div className={`px-3 py-2 max-w-[80%] rounded-lg break-words ${msg.user === name ? "bg-[#7765DA] text-white rounded-br-none" : "bg-gray-200 text-gray-800 rounded-bl-none"}`}>
                                            {msg.message.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === "participants" && (
                            <div className="p-3 space-y-2">
                                {participants.map((p, idx) => (
                                    <div key={idx} className="p-2 rounded-md bg-gray-100 text-gray-800 text-sm font-medium">{p}</div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-2 border-t flex">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#7765DA]"
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button onClick={sendMessage} className="bg-[#7765DA] text-white px-4 py-2 rounded-r-md hover:bg-purple-700">
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );

    return (
        <div className="flex flex-col items-center mx-8 justify-start min-h-screen bg-white py-48">
            <div className="w-full max-w-2xl">
                {/* Question Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Question</h2>
                    <div className="flex items-center space-x-2">
                        <span className="text-xl">⏱️</span>
                        <span className="text-red-500 font-bold">
                            00:{timeLeft.toString().padStart(2, '0')}
                        </span>
                    </div>
                </div>

                {/* Question Box */}
                <div className="rounded-t-md bg-gradient-to-r from-gray-800 to-gray-700 text-white font-semibold px-4 py-3">
                    {questionData.question}
                </div>

                {renderOptionsOrResults()}

                {!submitted ? (
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={submitAnswer}
                            disabled={!selected}
                            className={`px-12 py-2 rounded-full text-white font-medium transition 
                                ${selected ? '' : 'opacity-50 cursor-not-allowed'}`}
                            style={{
                                background: 'linear-gradient(to right, #7765DA, #4F46E5)'
                            }}
                        >
                            Submit
                        </button>
                    </div>
                ) : (
                    <p className="text-center mt-6 font-semibold">
                        Wait for the teacher to ask a new question..
                    </p>
                )}
            </div>

            {renderChatButton()}
        </div>
    );
}








