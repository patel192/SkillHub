import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export const LearningPage = () => {
    const [lessons, setLessons] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [learningOpen, setLearningOpen] = useState(true);
  const [challengesOpen, setChallengesOpen] = useState(false);
  const [userCode, setUserCode] = useState("");
  const { courseId } = useParams();

  // Fetch lessons
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch(`http://localhost:8000/lessons/${courseId}`);
        const data = await res.json();
        if (Array.isArray(data.data)) {
          setLessons(data.data);
          if (data.data.length > 0) {
            setSelectedLesson(data.data[0]);
            
          }
        }
      } catch (err) {
        console.error("Error fetching lessons:", err);
      }
    };
    fetchLessons();
  }, [courseId]);

  // Fetch challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await fetch(`http://localhost:8000/challenges/${courseId}`);
        const data = await res.json();
        if (Array.isArray(data.data)) {
          setChallenges(data.data);

        }
      } catch (err) {
        console.error("Error fetching challenges:", err);
      }
    };
    fetchChallenges();
  }, [courseId]);

  // Parse content for lessons
  const parseContent = (content = "") => {
    const regex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    let parts = [];
    let lastIndex = 0;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const textPart = content.slice(lastIndex, match.index).trim();
        if (textPart) {
          parts.push({ type: "note", text: textPart });
        }
      }
      parts.push({
        type: "code",
        lang: match[1] || "javascript",
        text: match[2],
      });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      const textPart = content.slice(lastIndex).trim();
      if (textPart) {
        parts.push({ type: "note", text: textPart });
      }
    }
    return parts;
  };

  // Run challenge code
  const handleRunCode = async () => {
    if (!selectedChallenge?._id) {
      alert("Please select a challenge first.");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:8000/verify-challenge/${selectedChallenge._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userCode }),
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("✅ All tests passed!");
      } else {
        alert("❌ Some tests failed:\n" + JSON.stringify(data.results, null, 2));
      }
    } catch (err) {
      console.log("Verification results:", data);

      alert(`Error: ${err.message}`);
    }
  };

  return (
  <div className="flex h-screen bg-[#0d1117] text-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#161b22] border-r border-gray-700 overflow-y-auto">
        <h2 className="p-4 text-lg font-bold border-b border-gray-700">
          Course Menu
        </h2>

        {/* Learning Dropdown */}
        <div>
          <button
            onClick={() => setLearningOpen(!learningOpen)}
            className="w-full text-left px-4 py-2 font-semibold hover:bg-[#21262d] flex justify-between items-center"
          >
            <span>📚 Learning</span>
            <span>{learningOpen ? "▲" : "▼"}</span>
          </button>
          {learningOpen && (
            <div className="pl-4">
              {lessons.map((lesson) => (
                <button
                  key={lesson._id}
                  onClick={() => {
                    setSelectedLesson(lesson);
                    setSelectedChallenge(null);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#21262d] ${
                    selectedLesson?._id === lesson._id ? "bg-[#30363d]" : ""
                  }`}
                >
                  {lesson.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Challenges Dropdown */}
        <div>
          <button
            onClick={() => setChallengesOpen(!challengesOpen)}
            className="w-full text-left px-4 py-2 font-semibold hover:bg-[#21262d] flex justify-between items-center"
          >
            <span>🏆 Challenges</span>
            <span>{challengesOpen ? "▲" : "▼"}</span>
          </button>
          {challengesOpen && (
            <div className="pl-4">
              {challenges.map((challenge) => (
                <button
                  key={challenge._id}
                  onClick={() => {
                    setSelectedChallenge(challenge);
                    console.log(selectedChallenge._id)
                    setSelectedLesson(null);
                    setUserCode(challenge.starterCode || "");
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#21262d] ${
                    selectedChallenge?._id === challenge._id
                      ? "bg-[#30363d]"
                      : ""
                  }`}
                >
                  {challenge.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Lesson View */}
        {selectedLesson && (
          <>
            <h1 className="text-2xl font-bold mb-4">{selectedLesson.title}</h1>
            {parseContent(selectedLesson.content).map((part, idx) =>
              part.type === "note" ? (
                <p
                  key={idx}
                  className="mb-4 leading-relaxed text-gray-200 whitespace-pre-line"
                >
                  {part.text}
                </p>
              ) : (
                <SyntaxHighlighter
                  key={idx}
                  language={part.lang}
                  style={vscDarkPlus}
                  customStyle={{
                    backgroundColor: "#161b22",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                >
                  {part.text}
                </SyntaxHighlighter>
              )
            )}
          </>
        )}

        {/* Challenge View */}
        {selectedChallenge && (
          <>
            <h1 className="text-2xl font-bold mb-2">
              {selectedChallenge.title}
            </h1>
            <p className="mb-4 text-gray-300">
              {selectedChallenge.description}
            </p>

            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="w-full h-64 p-4 font-mono text-sm bg-[#161b22] text-white border border-gray-600 rounded mb-4"
            />

            <div className="flex gap-4">
              <button
                onClick={handleRunCode}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              >
                ▶ Run
              </button>
              <button
                onClick={() =>
                  setUserCode(selectedChallenge.solutionCode || "")
                }
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
              >
                💡 Show Solution
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
