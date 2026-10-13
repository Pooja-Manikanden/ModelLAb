
import { useState } from "react";
import { Dropbox } from "dropbox";

function App() {
  const [name, setName] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const token = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!token) {
      setMessage("Dropbox token is missing.");
      return;
    }

    if (!file) {
      setMessage("Please select your assignment file.");
      return;
    }

    try {
      const dbx = new Dropbox({ accessToken: token });

      const fileName = `${registerNumber}_${file.name}`;

      await dbx.filesUpload({
        path: "/" + fileName,
        contents: file,
        mode: { ".tag": "overwrite" }
      });

      setMessage(
        `Assignment uploaded successfully for ${name} (${department})!`
      );

      setName("");
      setRegisterNumber("");
      setDepartment("");
      setFile(null);
      event.target.reset();
    } catch (error) {
      setMessage(
        error?.error?.error_summary ||
        error.message ||
        "Upload failed."
      );
    }
  }

  return (
    <div>
      <h1>Student Assignment Submission</h1>

      <form onSubmit={handleSubmit}>
        <label>Student Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <br /><br />

        <label>Register Number:</label>
        <input
          type="text"
          value={registerNumber}
          onChange={(e) => setRegisterNumber(e.target.value)}
          required
        />

        <br /><br />

        <label>Department:</label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        >
          <option value="">Select Department</option>
          <option value="IT">Information Technology</option>
          <option value="CSE">Computer Science</option>
          <option value="ECE">Electronics and Communication</option>
          <option value="EEE">Electrical and Electronics</option>
        </select>

        <br /><br />

        <label>Assignment File:</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />

        <br /><br />

        <button type="submit">Submit Assignment to Dropbox</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default App;