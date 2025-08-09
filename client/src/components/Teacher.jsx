import React, { useState, useEffect } from 'react';
import socket from '../socket';

export default function Teacher() {
    // State for Polls
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([
        { text: "", isCorrect: false },
        { text: "", isCorrect: false }
    ]);
    const [duration, setDuration] = useState("60");
    const [results, setResults] = useState({});
    const [pollActive, setPollActive] = useState(false);
    const [askedQuestion, setAskedQuestion] = useState(null);

    // State for History
    const [pollHistory, setPollHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    // State for Chat and Participants
    const [showChat, setShowChat] = useState(false);
    const [activeTab, setActiveTab] = useState("chat");
    const [messages, setMessages] = useState([]);
    const [participants, setParticipants] = useState([]);

    // Effect for Socket Listeners
    useEffect(() => {
        socket.emit('get-participants');
        socket.on('poll-update', (data) => setResults(data));
        socket.on('all-answered', () => alert("All students have answered!"));

        socket.on('chat-message', (msg) => {
            setMessages(prev => [...prev, msg]);
        });
        socket.on('update-participants', (list) => {
            setParticipants(list);
        });

        return () => {
            socket.off('poll-update');
            socket.off('all-answered');
            socket.off('chat-message');
            socket.off('update-participants');
        };
    }, []);

    const kickStudent = (studentName) => {
        if (window.confirm(`Are you sure you want to kick out ${studentName}?`)) {
            socket.emit('kick-student', studentName);
        }
    };


    // Helper functions for poll creation
    const handleOptionChange = (index, field, value) => {
        const updatedOptions = [...options];
        if (field === 'text') {
            updatedOptions[index].text = value;
        } else if (field === 'isCorrect') {
            updatedOptions[index].isCorrect = value === 'true';
        }
        setOptions(updatedOptions);
    };

    const addOption = () => {
        setOptions([...options, { text: "", isCorrect: false }]);
    };

    // Function to send a question
    const sendQuestion = () => {
        const optionTexts = options.map(o => o.text);
        const qData = {
            question,
            options: optionTexts,
            duration
        };
        socket.emit('ask-question', qData);
        setAskedQuestion(qData);
        setPollActive(true);
        setShowHistory(false);
    };

    // Function to calculate vote percentage
    const getPercentage = (option) => {
        const totalVotes = Object.values(results).reduce((a, b) => a + b, 0);
        if (totalVotes === 0) return 0;
        return Math.round((results[option] || 0) / totalVotes * 100);
    };

    // Function to reset poll and archive the last one
    const resetPoll = () => {
        if (askedQuestion) {
            const completedPoll = {
                question: askedQuestion.question,
                options: askedQuestion.options,
                results: results
            };
            setPollHistory(prev => [...prev, completedPoll]);
        }
        setQuestion("");
        setOptions([
            { text: "", isCorrect: false },
            { text: "", isCorrect: false }
        ]);
        setResults({});
        setAskedQuestion(null);
        setPollActive(false);
    };

    const isFormValid = question.trim() !== '' && options.every(opt => opt.text.trim() !== '');

    // Function to render the chat UI
    const renderChatUI = () => (
        <>
            <div
                className="fixed bottom-6 right-6 bg-[#7765DA] w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg text-2xl"
                onClick={() => setShowChat(!showChat)}
            >
                💬
            </div>
            {showChat && (
                <div className="fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-2xl border overflow-hidden flex flex-col z-50">
                    <div className="flex border-b">
                        <button
                            className={`flex-1 py-2 text-sm font-semibold transition-colors ${activeTab === "chat" ? "border-b-2 border-[#7765DA] text-[#7765DA]" : "text-gray-500 hover:bg-gray-100"}`}
                            onClick={() => setActiveTab("chat")}
                        >
                            Chat
                        </button>
                        <button
                            className={`flex-1 py-2 text-sm font-semibold transition-colors ${activeTab === "participants" ? "border-b-2 border-[#7765DA] text-[#7765DA]" : "text-gray-500 hover:bg-gray-100"}`}
                            onClick={() => setActiveTab("participants")}
                        >
                            Participants
                        </button>
                    </div>

                    {activeTab === "chat" && (
                        <div className="flex flex-col h-80">
                            <div className="flex-1 p-3 space-y-4 overflow-y-auto">
                                {messages.length === 0 ? (
                                    <p className="text-center text-gray-500 pt-4">No messages yet.</p>
                                ) : (
                                    messages.map((msg, idx) => (
                                        <div key={idx} className="flex flex-col items-start">
                                            <span className="text-xs font-semibold mb-1 text-gray-500">{msg.message.user}</span>
                                            {console.log(msg)}
                                            <div className="px-3 py-2 max-w-[80%] rounded-lg break-words bg-gray-200 text-gray-800 rounded-bl-none">
                                                {msg.message.text}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "participants" && (
                        <div className="h-80 flex flex-col">
                            {/* Header */}
                            <div className="flex justify-between items-center p-3 border-b bg-gray-50">
                                <span className="text-xs font-bold uppercase text-gray-500">Name</span>
                                <span className="text-xs font-bold uppercase text-gray-500">Action</span>
                            </div>
                            {/* List */}
                            <div className="flex-1 overflow-y-auto">
                                {participants.length === 0 ? (
                                    <p className="text-center text-gray-500 pt-4">No participants have joined.</p>
                                ) : (
                                    participants.map((participantName, idx) => (
                                        <div key={idx} className="flex justify-between items-center px-3 py-2 hover:bg-gray-100">
                                            <span className="text-gray-800 text-sm font-medium">{participantName}</span>
                                            <button
                                                onClick={() => kickStudent(participantName)}
                                                className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                                            >
                                                Kick out
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );

    // -------- POLL HISTORY VIEW --------
    if (showHistory) {
        return (
            <div className="p-8 bg-white min-h-screen">
                <h1 className="text-3xl font-bold max-w-4xl mb-10 mx-auto">View Poll History</h1>
                {pollHistory.length === 0 ? (
                    <p className="text-gray-500 text-center">No polls have been asked yet.</p>
                ) : (
                    <div className="space-y-8 max-w-4xl mx-auto">
                        {pollHistory.map((poll, idx) => {
                            const totalVotes = Object.values(poll.results).reduce((a, b) => a + b, 0);
                            return (
                                <div key={idx}>
                                    <h2 className="text-xl font-semibold mb-3">Question {idx + 1}</h2>
                                    <div className="w-full border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                        <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white font-semibold px-4 py-3">
                                            {poll.question}
                                        </div>
                                        <div className="p-4 space-y-3">
                                            {poll.options.map((opt, oIdx) => {
                                                const percentage = totalVotes > 0 ? Math.round((poll.results[opt] || 0) / totalVotes * 100) : 0;
                                                return (
                                                    <div key={oIdx} className="relative bg-gray-100 rounded-md overflow-hidden border">
                                                        <div
                                                            className="absolute top-0 left-0 h-full bg-[#7765DA] transition-all duration-500"
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                        <div className="flex items-center space-x-3 p-3 relative z-10">
                                                            <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-[#7765DA] text-white">
                                                                {oIdx + 1}
                                                            </div>
                                                            <span className="font-medium text-gray-800">{opt}</span>
                                                            <span className="ml-auto font-semibold text-gray-800">{percentage}%</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div
                    className={`${pollHistory.length === 0 ? 'text-center' : ''} max-w-4xl mx-auto`}
                >
                    <button
                        onClick={() => setShowHistory(false)}
                        className="mt-8 px-6 py-2 rounded-full text-white font-medium bg-[#7765DA] hover:bg-purple-700"
                    >
                        Back to Current Poll
                    </button>
                </div>
            </div>
        );
    }

    // -------- POLL VIEW --------
    if (pollActive && askedQuestion) {
        return (
            <div className="relative min-h-screen bg-gray-50">
                <div className="flex justify-end py-4 px-10">
                    <button
                        onClick={() => setShowHistory(true)}
                        className='mt-8 px-6 py-2 rounded-full text-white font-medium bg-[#7765DA] hover:bg-purple-700'
                    >
                        View Poll History
                    </button>
                </div>
                <h1 className='max-w-2xl mx-auto font-bold'>Question</h1>
                <div className="flex flex-col items-center justify-start py-4">
                    <div className="w-full max-w-2xl border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white">
                        <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white font-semibold px-4 py-3">
                            {askedQuestion.question}
                        </div>
                        <div className="p-4 space-y-3">
                            {askedQuestion.options.map((opt, idx) => {
                                const percentage = getPercentage(opt);
                                return (
                                    <div key={idx} className="relative bg-gray-100 rounded-md overflow-hidden border">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-[#7765DA] transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                        <div className="flex items-center space-x-3 p-3 relative z-10">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-[#7765DA] text-white">
                                                {idx + 1}
                                            </div>
                                            <span className="font-medium text-gray-800">{opt}</span>
                                            <span className="ml-auto font-semibold text-gray-800">{percentage}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className='max-w-2xl mx-auto text-end'>
                    <button
                        onClick={resetPoll}
                        className="px-6 py-2 rounded-full text-white font-medium bg-[#7765DA] hover:bg-purple-700"
                    >
                        + Ask a new question
                    </button>
                </div>
                {renderChatUI()}
            </div>
        );
    }

    // -------- QUESTION CREATION VIEW --------
    return (
        <div>
            <div className="px-12 py-12 sm:px-18 sm:py-8 lg:px-30 lg:pt-14 lg:max-w-3/4 bg-white text-black font-sans">{/*min-h-screen tha yaha */}
                <button className="text-sm font-semibold px-4 py-1 rounded-full bg-[#EDE9FE] text-[#7C3AED] mb-6">
                    🎓 Intervue Poll
                </button>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2">
                    Let’s <span className="font-bold">Get Started</span>
                </h1>
                <p className="text-justify text-gray-500 mb-8">
                    you’ll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
                </p>

                <div className="flex items-center justify-between mb-2">
                    <label className="font-semibold text-sm text-gray-800">Enter your question</label>
                    <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="border rounded px-3 py-1 text-sm focus:outline-none"
                    >
                        <option value="30">30 seconds</option>
                        <option value="60">60 seconds</option>
                        <option value="90">90 seconds</option>
                    </select>
                </div>

                <div className="relative w-full mb-4">
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Type your question here"
                        maxLength={100}
                        className="w-full h-36 p-3 pr-10 pb-6 rounded-sm bg-gray-100 text-sm resize-none"
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400 pointer-events-none">
                        {question.length}/100
                    </div>
                </div>

                <div className="mb-4">
                    <div className="grid grid-cols-12 sm:grid sm:grid-cols-20 sm:gap-2 font-semibold text-sm mb-2">
                        <div className="col-span-6 sm:col-span-11">Edit Options</div>
                        <div className="col-span-6 ml-12 sm:col-span-6 md:ml-6 lg:col-span-8">Is it Correct?</div>
                    </div>

                    {options.map((opt, idx) => (
                        <div className="grid grid-cols-12 sm:grid sm:grid-cols-12 sm:gap-2 md:grid md:grid-cols-18 md:gap-2 md:mb-2 md:items-center" key={idx}>
                            <div className="col-span-1 text-center w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-base font-bold text-white">
                                {idx + 1}
                            </div>
                            <input
                                className="col-span-6 ml-5 sm:ml-0 md:ml-1 lg:ml-2 sm:col-span-6 md:col-span-9 p-2 rounded bg-gray-100 outline-none"
                                placeholder={`Option ${idx + 1}`}
                                value={opt.text}
                                onChange={(e) => handleOptionChange(idx, 'text', e.target.value)}
                            />
                            <div className="col-span-5 sm:col-span-4 flex items-center space-x-4">
                                <label className="ml-6 sm:ml-7 md:ml-5 flex items-center space-x-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`correct-${idx}`}
                                        value="true"
                                        checked={opt.isCorrect === true}
                                        onChange={(e) => handleOptionChange(idx, 'isCorrect', e.target.value)}
                                        className="hidden peer"
                                    />
                                    <div className="w-4 h-4 rounded-full border-2 border-purple-600 peer-checked:bg-purple-600"></div>
                                    <span>Yes</span>
                                </label>
                                <label className="flex items-center space-x-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`correct-${idx}`}
                                        value="false"
                                        checked={opt.isCorrect === false}
                                        onChange={(e) => handleOptionChange(idx, 'isCorrect', e.target.value)}
                                        className="hidden peer"
                                    />
                                    <div className="w-4 h-4 rounded-full border-2 border-purple-600 peer-checked:bg-purple-600"></div>
                                    <span>No</span>
                                </label>
                            </div>

                        </div>
                    ))}

                    <div className='grid grid-cols-12 md:grid md:grid-cols-18 md:ml-2'>
                        <button
                            onClick={addOption}
                            className="mt-3 px-4 py-2 col-start-2 ml-5 sm:ml-0 sm:col-start-2 col-span-6 lg:col-span-6 lg:col-start-2 text-sm rounded border border-[#7C3AED] text-[#7C3AED] hover:bg-[#F3E8FF]"
                        >
                            + Add More option
                        </button>
                    </div>
                </div>
            </div>

            <hr class="border-t border-gray-300" />

            <div className="flex justify-end mt-6 mx-12 mb-6">
                <button
                    onClick={sendQuestion}
                    disabled={!isFormValid}
                    className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-6 py-2 rounded-full text-sm font-medium disabled:bg-white disabled:text-black border-1 disabled:border-gray-300 disabled:cursor-not-allowed"
                >
                    Ask Question
                </button>
            </div>

        </div>

    );
}