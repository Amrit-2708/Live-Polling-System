import React from 'react';
import Teacher from './components/Teacher';
import Student from './components/Student';
import './App.css'


function App() {
    const [role, setRole] = React.useState("");

    if (!role) {
        return (
            <div className='bg-amber-400'>
                <div className=''>
                    <h1 className='text-5xl'>Welcome to the Live Polling System</h1>
                    <p>Please select the role that best describes you to begin using the live polling system</p>
                </div>
                <div>
                    <button onClick={() => setRole("teacher")}>Login as Teacher</button>
                    <button onClick={() => setRole("student")}>Login as Student</button>
                </div>

            </div>
        );
    }

    return role === "teacher" ? <Teacher /> : <Student />;
}

export default App;
