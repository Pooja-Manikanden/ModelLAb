import { useState, useEffect } from "react";
import "./App.css";

function App() {
    const [name, setName] = useState("");
    const [registerNumber, setRegisterNumber] = useState("");
    const [department, setDepartment] = useState("");
    const [students, setStudents] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const API_URL = "http://localhost:5000";

    // Load all students from MongoDB
    const loadStudents = async () => {
        try {
            const response = await fetch(`${API_URL}/students`);

            if (!response.ok) {
                throw new Error("Failed to fetch students");
            }

            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error("Error loading students:", error);
            setMessage("Could not load students. Check your backend.");
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    // Save student to MongoDB
    const addStudent = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const student = {
            name: name.trim(),
            registerNumber: registerNumber.trim(),
            department: department.trim()
        };

        try {
            const response = await fetch(`${API_URL}/students`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(student)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to save student");
            }

            setMessage("Student saved successfully!");
            setName("");
            setRegisterNumber("");
            setDepartment("");

            await loadStudents();
        } catch (error) {
            console.error("Error saving student:", error);
            setMessage("Error: " + error.message);
        } finally {
            setLoading(false);
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

                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Student"}
                </button>
            </form>

            {message && <p>{message}</p>}

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