import { useState, useRef, useEffect } from "react";
import { FaFileUpload, FaSpinner } from "react-icons/fa";
import { getLeaderboardData, submitFilesToLeaderboard } from "./api";

function App() {
  const fileInputRef = useRef(null);
  const [txtFile, setTxtFile] = useState(null);
  const [pyFile, setPyFile] = useState(null);
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [loadingCycle, setLoadingCycle] = useState(0);

  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    // getScores();
    (async () => {
      const data = await getLeaderboardData();
      data.sort((a, b) => b.score - a.score);
      setLeaderboardData(data);
    })();
  }, []);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingCycle((prev) => (prev + 1) % 3)
      }, 500);

      const timeout = setTimeout(() => {
        setLoading(false);
      }, 150000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [loading]);

  useEffect(() => {
    setLoadingText("Loading" + ".".repeat(loadingCycle + 1));
  }, [loadingCycle]);


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
  };

  const handleFileUpload = async () => {
    if (loading) {
      alert("Already uploading");
      return;
    }
    if (txtFile && pyFile && name !== null) {
      //   const result = await submitFilesToLeaderboard(name, txtFile, pyFile);
      setLoading(true);
      const result = await submitFilesToLeaderboard(name, txtFile, pyFile);
      if (result.error) {
        alert(result.error);
        setLoading(false);
      } else {
        alert("Files uploaded successfully");
        const newLeaderboardData = await getLeaderboardData();
        newLeaderboardData.sort((a, b) => b.score - a.score);
        setLeaderboardData(newLeaderboardData);
        setTxtFile(null);
        setPyFile(null);
        setLoading(false);
      }
    } else {
      alert(
        "Please select a .txt file and a .py file and put in your name before uploading"
      );
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".txt, .py"
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
            className="border-dashed mb-4 p-2 rounded-md border-gray-600"
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
              className={`${
                !loading ? "bg-green-500" : "bg-slate-500"
              } text-white rounded-lg px-4 py-2 cursor-pointer hover:${
                !loading ? "bg-green-500" : "bg-slate-500"
              } transition w-32 h-8 item-center justify-center`}
              onClick={handleFileUpload}
            >
              {loading ? (                
                <div className="flex items-center">
                  <FaSpinner className="animate-spin mr-2" />
                  {loadingText}
                </div>) : "Submit"}
            </div>
            {txtFile && pyFile && <div>File uploaded</div>}
          </div>
          <div className="font-bold">Please note that it will take around 2.5 minutes to grade your submission!</div>
        </div>
        <div className="flex-1 flex flex-col justify-top p-5 font-bold">
          Leaderboard (Top 15 Submissions)
          <ul>
            {leaderboardData.map((entry, id) => {
              return (
                <li key={id}>
                  <p>
                    {id + 1}. {entry.name}: {entry.score}. Submitted at{" "}
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
