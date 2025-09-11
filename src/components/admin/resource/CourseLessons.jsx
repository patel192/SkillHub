import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PlusCircle, ArrowLeft, FileText, Code2 } from "lucide-react";

export const CourseLessons = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newLesson, setNewLesson] = useState({ title: "", content: "" });

  // Fetch lessons
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch(`http://localhost:8000/lessons/${courseId}`);
        const data = await res.json();
        setLessons(data.data || []);
        if (data.data && data.data.length > 0) {
          setSelectedLesson(data.data[0]); // show first lesson by default
        }
      } catch (err) {
        console.error("Error fetching lessons:", err.message);
      }
    };
    fetchLessons();
  }, [courseId]);

  // Add new lesson
  const handleAddLesson = async () => {
    if (!newLesson.title.trim() || !newLesson.content.trim()) return;
    try {
      const res = await fetch("http://localhost:8000/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newLesson, courseId }),
      });
      const data = await res.json();
      setLessons((prev) => [...prev, data.data]);
      setNewLesson({ title: "", content: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Error adding lesson:", err.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 p-4 flex flex-col">
        <Link
          to="/resources"
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-4"
        >
          <ArrowLeft size={18} /> Back to Courses
        </Link>
        <h2 className="text-lg font-bold mb-4">Lessons</h2>
        <ul className="space-y-2 flex-1 overflow-y-auto">
          {lessons.map((lesson) => (
            <li
              key={lesson._id}
              onClick={() => setSelectedLesson(lesson)}
              className={`cursor-pointer p-2 rounded-lg transition ${
                selectedLesson?._id === lesson._id
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-300"
              }`}
            >
              <FileText size={16} className="inline mr-2" />
              {lesson.title}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {selectedLesson ? (
          <>
            <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText size={22} /> {selectedLesson.title}
            </h1>
            <pre className="bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto font-mono text-gray-300">
              {selectedLesson.content}
            </pre>
          </>
        ) : (
          <p className="text-gray-400">Select a lesson from the sidebar</p>
        )}
      </main>

      {/* Floating Add Lesson Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-full shadow-lg flex items-center gap-2"
      >
        <PlusCircle size={20} /> Add Lesson
      </button>

      {/* Modal for Add Lesson */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Add New Lesson</h2>
            <input
              type="text"
              placeholder="Lesson Title"
              value={newLesson.title}
              onChange={(e) =>
                setNewLesson({ ...newLesson, title: e.target.value })
              }
              className="p-2 w-full mb-3 rounded bg-gray-700 text-white"
            />
            <textarea
              placeholder="Lesson Notes & Code"
              rows={6}
              value={newLesson.content}
              onChange={(e) =>
                setNewLesson({ ...newLesson, content: e.target.value })
              }
              className="p-2 w-full rounded bg-gray-700 text-white font-mono"
            ></textarea>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLesson}
                className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
              >
                Save Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


