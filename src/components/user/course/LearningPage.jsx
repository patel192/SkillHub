import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
export const LearningPage = () => {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const {courseId} = useParams()

  useEffect(() => {
    // Fetch lessons
    const fetchLessons = async () => {
      try {
        const res = await fetch(`http://localhost:8000/lessons/${courseId}`);
        const data = await res.json();
        setLessons(data.data);
        console.log(data);
        if (data.length > 0) {
          setSelectedLesson(res.data.data[0]);
        }
      } catch (err) {
        console.error("Error fetching lessons:", err);
      }
    };

    fetchLessons();
  }, [courseId]);

  // Function to split content into notes and code blocks
  const parseContent = (content) => {
    const regex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    let parts = [];
    let lastIndex = 0;

    while ((match = regex.exec(content)) !== null) {
      // Push text before code block as notes
      if (match.index > lastIndex) {
        parts.push({
          type: "note",
          text: content.slice(lastIndex, match.index).trim(),
        });
      }
      // Push code block
      parts.push({
        type: "code",
        lang: match[1] || "javascript",
        text: match[2],
      });
      lastIndex = regex.lastIndex;
    }

    // Push any remaining text after last code block
    if (lastIndex < content.length) {
      parts.push({
        type: "note",
        text: content.slice(lastIndex).trim(),
      });
    }

    return parts;
  };
  return (
   <div className="flex h-screen bg-[#0d1117] text-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#161b22] border-r border-gray-700 overflow-y-auto">
        <h2 className="p-4 text-lg font-bold border-b border-gray-700">
          Lessons
        </h2>
        {lessons.map((lesson) => (
          <button
            key={lesson._id}
            onClick={() => setSelectedLesson(lesson)}
            className={`block w-full text-left px-4 py-2 hover:bg-[#21262d] ${
              selectedLesson?._id === lesson._id ? "bg-[#30363d]" : ""
            }`}
          >
            {lesson.title}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedLesson ? (
          <>
            <h1 className="text-2xl font-bold mb-4">{selectedLesson.title}</h1>
            {parseContent(selectedLesson.content).map((part, idx) =>
              part.type === "note" ? (
                part.text && (
                  <p key={idx} className="mb-4 leading-relaxed text-gray-200">
                    {part.text}
                  </p>
                )
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
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};
