import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
export const LearningPage = () => {
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [loading, setLoading] = useState(true);

  const {courseId} = useParams()

  useEffect(() => {
    async function fetchLessons() {
      try {
        const res = await fetch(`http://localhost:8000/lessons/${courseId}`);
        const data = await res.json();
        setLessons(data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching lessons:", err);
        setLoading(false);
      }
    }
    fetchLessons();
  }, [courseId]);

  if (loading) {
    return <div className="text-center p-6">Loading lessons...</div>;
  }

  if (!lessons.length) {
    return <div className="text-center p-6">No lessons found for this course.</div>;
  }
  return (
  <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 text-blue-600">Lessons</h2>
        <ul>
          {lessons.map((lesson, index) => (
            <li
              key={index}
              onClick={() => setCurrentLesson(index)}
              className={`cursor-pointer px-3 py-2 rounded-lg mb-2 transition-colors ${
                index === currentLesson
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-100 text-gray-700"
              }`}
            >
              {lesson.title}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">
            {lessons[currentLesson]?.title}
          </h1>

          {lessons[currentLesson]?.type === "note" && (
            <p className="text-gray-700 mb-4">{lessons[currentLesson].content}</p>
          )}

          {lessons[currentLesson]?.type === "code" && (
            <SyntaxHighlighter
              language="javascript"
              style={atomDark}
              customStyle={{
                borderRadius: "0.5rem",
                padding: "1rem",
                fontSize: "0.9rem",
              }}
            >
              {lessons[currentLesson].content}
            </SyntaxHighlighter>
          )}
        </div>
      </main>
    </div>
  );
};
