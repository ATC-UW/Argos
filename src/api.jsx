import axios from "axios";

const apiUrl = import.meta.env.VITE_APP_API_URL || "http://localhost:8000";

const getLeaderboardData = async () => {
  const response = await axios.get(apiUrl + "/leaderboard");
  return response.data.leaderboard;
};

const submitFilesToLeaderboard = async (name, txtFile, pyFile) => {
  const formData = new FormData();
  formData.append("file1", txtFile);
  formData.append("file2", pyFile);

  const response = await axios.post(apiUrl + "/upload-files/" + name, formData);
  return response.data;
};

export { getLeaderboardData, submitFilesToLeaderboard };
