import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import { auth, db } from "./firebase";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [isRegister, setIsRegister] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadStudents();
    } else {
      setStudents([]);
    }
  }, [user]);

  async function handleAuth(e) {
    e.preventDefault();
    setMessage("");

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        setMessage("Registration successful!");
      } else {
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        setMessage("Login successful!");
      }
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function addStudent(e) {
    e.preventDefault();
    setMessage("");

    try {
      await addDoc(collection(db, "students"), {
        name: name,
        department: department,
        email: user.email,
        uid: user.uid,
        createdAt: serverTimestamp()
      });

      setName("");
      setDepartment("");
      setMessage("Student saved successfully!");

      await loadStudents();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function loadStudents() {
    if (!user) return;

    try {
      const q = query(
        collection(db, "students"),
        where("uid", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      setStudents(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      setMessage("Logged out successfully!");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Student Registration System</h1>
        <p>React + Firebase Authentication + Firestore</p>
      </header>

      <main>
        {message && <p className="message">{message}</p>}

        {!user ? (
          <section className="card">
            <h2>{isRegister ? "Create Account" : "Login"}</h2>

            <form onSubmit={handleAuth}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />

              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                minLength={6}
                required
              />

              <button type="submit">
                {isRegister ? "Register" : "Login"}
              </button>
            </form>

            <p>
              {isRegister
                ? "Already have an account?"
                : "New user?"}{" "}
              <button
                type="button"
                className="link"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setMessage("");
                }}
              >
                {isRegister ? "Login here" : "Register here"}
              </button>
            </p>
          </section>
        ) : (
          <>
            <section className="card">
              <h2>Welcome!</h2>
              <p>Logged in as: {user.email}</p>
              <button onClick={handleLogout}>Logout</button>
            </section>

            <section className="card">
              <h2>Add Student Details</h2>

              <form onSubmit={addStudent}>
                <label>Student Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter student name"
                  required
                />

                <label>Department</label>
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Enter department"
                  required
                />

                <button type="submit">Save Student</button>
              </form>
            </section>

            <section className="card">
              <h2>My Student Records</h2>

              {students.length === 0 ? (
                <p>No student records yet.</p>
              ) : (
                students.map((student) => (
                  <div className="student" key={student.id}>
                    <strong>{student.name}</strong>
                    <p>Department: {student.department}</p>
                    <p>Email: {student.email}</p>
                  </div>
                ))
              )}

              <button onClick={loadStudents}>
                Refresh Records
              </button>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;