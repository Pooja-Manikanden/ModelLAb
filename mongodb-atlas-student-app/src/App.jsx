import { useState, useEffect } from "react";

function App() {
    const [name, setName] = useState("");
    const [registerNumber, setRegisterNumber] = useState("");
    const [department, setDepartment] = useState("");
    const [students, setStudents] = useState([]);

    const loadStudents = async () => {
        const response = await fetch("http://localhost:5000/students");
        const data = await response.json();
        setStudents(data);
    };

    useEffect(() => {
        loadStudents();
    }, []);

    const addStudent = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5000/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                registerNumber,
                department
            })
        });

        if (response.ok) {
            setName("");
            setRegisterNumber("");
            setDepartment("");
            loadStudents();
        } else {
            alert("Failed to save student details");
        }
    };

    return (
        <div>
            <h1>Student Details</h1>

            <form onSubmit={addStudent}>
                <label>Student Name: </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <br /><br />

                <label>Register Number: </label>
                <input
                    type="text"
                    value={registerNumber}
                    onChange={(e) => setRegisterNumber(e.target.value)}
                    required
                />
                <br /><br />

                <label>Department: </label>
                <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                />
                <br /><br />

                <button type="submit">Save Student</button>
            </form>

            <hr />

            <h2>Saved Student Details</h2>

            {students.length === 0 ? (
                <p>No student records found.</p>
            ) : (
                <table border="1" cellPadding="8">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Register Number</th>
                            <th>Department</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.map((student) => (
                            <tr key={student._id}>
                                <td>{student.name}</td>
                                <td>{student.registerNumber}</td>
                                <td>{student.department}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default App;