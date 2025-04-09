import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5003", {
  reconnectionAttempts: 5,
  timeout: 10000,
});

export default function CollabPage() {
  const { sessionId } = useParams();
  const [code, setCode] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    // Socket connection handlers
    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("join_session", sessionId);
    });

    socket.on("code_update", (newCode) => {
      setCode(newCode);
    });

    socket.on("disconnect", () => setIsConnected(false));

    // Fetch problem details from matching service
    const fetchProblem = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/problems/${sessionId.split("_")[2]}`
        );
        const data = await res.json();
        setProblem(data);
        setCode(data.starterCode || "");
      } catch (err) {
        console.error("Failed to fetch problem:", err);
      }
    };

    fetchProblem();

    return () => {
      socket.off("connect");
      socket.off("code_update");
      socket.off("disconnect");
    };
  }, [sessionId]);

  const handleCodeChange = (value) => {
    setCode(value);
    socket.emit("code_update", { sessionId, code: value });
  };

  return (
    <div className="collab-container">
      {problem && (
        <div className="problem-header">
          <h2>{problem.title}</h2>
        </div>
      )}
      <Editor
        height="80vh"
        defaultLanguage="javascript"
        value={code}
        onChange={handleCodeChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          readOnly: !isConnected,
        }}
      />
      {!isConnected && (
        <div className="connection-banner">
          Reconnecting to collaboration server...
        </div>
      )}
    </div>
  );
}
