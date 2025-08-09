import React from 'react';
import Teacher from './components/Teacher';
import Student from './components/Student';
import './App.css';

function App() {
  const [role, setRole] = React.useState("");           // Final role after Continue
  const [selectedRole, setSelectedRole] = React.useState(""); // Temporary selection

  if (!role) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-16 sm:flex sm:flex-col sm:items-center sm:justify-center sm:min-h-screen bg-white">
        {/* Badge */}
        <div className="mb-4">
          <span
            className="px-4 py-1 text-white text-sm font-medium rounded-full"
            style={{ backgroundColor: "#7765DA" }}
          >
            ✨ Intervue Poll
          </span>
        </div>

        <div className='bg-aber-700'>
          <h1 className="text-3xl md:text-4xl font-semibold text-center mb-2">
            Welcome to the <span className="font-bold">Live Polling System</span>
          </h1>

          <p className="text-gray-500 text-center mb-10">{/*max-w-lg bhi tha yaha*/}
            Please select the role that best describes you to begin using the live polling system
          </p>
        </div>

        {/* Role Cards */}
        <div className="sm:flex sm:flex-row sm:gap-6 sm:mb-8 flex flex-col gap-y-6">
          {/* Student Card */}
          <div
            onClick={() => setSelectedRole("student")}
            className={`cursor-pointer border-3 rounded-md px-6 py-6 w-74 text-ccenter hover:shadow-md transition ${selectedRole === "student" ? "border-[#5767D0]" : "border-gray-200"
              }`}
          >
            <h2 className="font-bold mb-2">I’m a Student</h2>
            <p className="text-gray-500 text-sm">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry
            </p>
          </div>

          {/* Teacher Card */}
          <div
            onClick={() => setSelectedRole("teacher")}
            className={`cursor-pointer border-3 rounded-md px-6 py-6 w-74 text-ccenter hover:shadow-md transition ${selectedRole === "teacher" ? "border-[#7765DA]" : "border-gray-200"
              }`}
          >
            <h2 className="font-bold mb-2">I’m a Teacher</h2>
            <p className="text-gray-500 text-sm">
              Submit answers and view live poll results in real-time.
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => {
            if (selectedRole) setRole(selectedRole);
          }}
          className="px-12 py-2 mt-8 sm:px-12 sm:py-2 rounded-full text-white sm:font-medium sm:transition"
          style={{ backgroundColor: "#7765DA" }}
        >
          Continue
        </button>
      </div>
    );
  }

  return role === "teacher" ? <Teacher /> : <Student />;
}

export default App;
