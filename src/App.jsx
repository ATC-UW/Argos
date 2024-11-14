import { useState, useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { FaFileUpload } from "react-icons/fa"
import { createClient } from '@supabase/supabase-js';

const supabase = createClient("https://bkjucfjkxpyxhqkdwrmx.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJranVjZmpreHB5eGhxa2R3cm14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyMTM4MzcsImV4cCI6MjA0Njc4OTgzN30.KvJagdnKgLxv_4LFW7GaBQuzoJvGHZw7rUhmyrlYXKs")
function App() {
  const fileInputRef = useRef(null)
  const [txtFile, setTxtFile] = useState(null)
  const [pyFile, setPyFile] = useState(null)
  const [result, setResult] = useState(null)
  const [name, setName] = useState(null)

  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    getScores()
  }, [])

  async function getScores() {
    const {data} = await supabase.from("leaderboard").select().order('score', { ascending: false })
    console.log(data);
    
    setLeaderboardData(data)
  }

  const handleButtonClick = () => {
    fileInputRef.current.click();
  }

  const handleFileChange = (event) => {
    const files = event.target.files
    
    let txtFile = null
    let pyFile = null

    for (let file of files) {
      if (file.type === "text/plain" && file.name.endsWith('.txt')) {
        txtFile = file;
      } else if (file.name.endsWith('.py')) {
        pyFile = file;
      }
    }

    setTxtFile(txtFile);
    setPyFile(pyFile);

    if (!txtFile || !pyFile) {
      alert('Please select both a .txt file and a .py file.');
    }
  }

  const handleFileUpload = async () => {
    if (txtFile && pyFile) {
      const formData = new FormData()
      formData.append('txtFile', txtFile)
      formData.append('pyFile', pyFile)
      
      const response = await fetch("API", {
        method: "POST",
        body: formData
      })

      if (!response.ok) {
        throw new Error('Error with network response!')
      }
      const resultData = await response.json()
      setResult(resultData)
    } else {
      alert("Please select a .txt file and a .py file before uploading")
    }
  }

  const handleButtonClick2 = () => {
    console.log(name);
    
  }

  return (
    <>
      <input type="file" ref={fileInputRef} style={{display:'none'}} onChange={handleFileChange}/>
      <div className="flex h-screen">
        <div className="flex flex-col flex-1 p-5 border-r border-gray-300">
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-gray-400 border-dashed rounded-md mb-2" onClick={handleButtonClick}>
              <FaFileUpload/>
              <p className="font-bold"> Click to Upload Files </p> 
              <p> (requirements.txt & maker.py) </p>
          </div>
          <div className="flex-1 flex">
            <div className="bg-green-500 text-white rounded-lg px-4 py-2 cursor-pointer hover:bg-green-600 transition w-32 h-8 item-center justify-center" onClick={handleButtonClick2}>Upload</div>
            <input type="text" name="name" id="" onChange={(e) => {setName(e.target.value)}} className='w-48 h-8'/>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-top p-5 font-bold">
          Leaderboard (Top 15 Submissions)
          <ul>
          {
            leaderboardData.map((entry) => {
              return(
              <li key={entry.id}>
                <p>{entry.name}: {entry.score}</p>
              </li>
              )
            })
            
          }
          </ul>
        </div>
      </div>
    </>
  )
}

export default App
