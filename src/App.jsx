import { useState, useRef, useEffect } from "react";
import { FaFileUpload } from "react-icons/fa";
import { getLeaderboardData, submitFilesToLeaderboard } from "./api";

function App() {
  const fileInputRef = useRef(null);
  const [txtFile, setTxtFile] = useState(null);
  const [pyFile, setPyFile] = useState(null);
  const [name, setName] = useState(null);

  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    // getScores();
    (async () => {
      const data = await getLeaderboardData();
      console.log(data);
      setLeaderboardData(data);
    })();
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = event.target.files;

    let txtFile = null;
    let pyFile = null;

    for (let file of files) {
      if (file.type === "text/plain" && file.name.endsWith(".txt")) {
        txtFile = file;
      } else if (file.name.endsWith(".py")) {
        pyFile = file;
      }
    }

    setTxtFile(txtFile);
    setPyFile(pyFile);

    if (!txtFile || !pyFile) {
      alert("Please select both a .txt file and a .py file.");
    }
    console.log(txtFile, pyFile);
  };

  const handleFileUpload = async () => {
    if (txtFile && pyFile && name !== null) {
      const result = await submitFilesToLeaderboard(name, txtFile, pyFile);
      if (result.error) {
        alert(result.error);
      } else {
        alert("Files uploaded successfully");
        const newLeaderboardData = await getLeaderboardData();
        setLeaderboardData(newLeaderboardData);
      }
    } else {
      alert("Please select a .txt file and a .py file before uploading");
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".txt,.py"
        multiple
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <div className="flex h-screen">
        <div className="flex flex-col flex-1 p-5 border-r border-gray-300">
          <input
            type="text"
            placeholder="Enter your name"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            className=" border-gray-400 border-dashed mb-4 p-2 rounded-md"
          />
          <div
            className="flex-1 flex flex-col items-center justify-center border-2 border-gray-400 border-dashed rounded-md mb-2"
            onClick={handleButtonClick}
          >
            <FaFileUpload />
            <p className="font-bold"> Click to Upload Files </p>
            <p> (requirements.txt & maker.py) </p>
          </div>
          <div className="flex-1 flex">
            <div
              className="bg-green-500 text-white rounded-lg px-4 py-2 cursor-pointer hover:bg-green-600 transition w-32 h-8 item-center justify-center"
              onClick={handleFileUpload}
            >
              Upload
            </div>
            <input
              type="text"
              name="name"
              id=""
              onChange={(e) => {
                setName(e.target.value);
              }}
              className="w-48 h-8"
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-top p-5 font-bold">
          Leaderboard (Top 15 Submissions)
          <ul>
            {leaderboardData.map((entry, id) => {
              return (
                <li key={id}>
                  <p>
                    {entry.name}: {entry.score}. Submitted at{" "}
                    {new Date(entry.time).toLocaleDateString("en-US")}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
