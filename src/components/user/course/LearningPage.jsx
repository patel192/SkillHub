import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
export const LearningPage = () => {
 const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [learningOpen, setLearningOpen] = useState(true);

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);

  // Fetch lessons
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch(`http://localhost:8000/lessons/${courseId}`);
        const data = await res.json();
        if (Array.isArray(data.data)) {
          setLessons(data.data);
          if (data.data.length > 0) setSelectedLesson(data.data[0]);
        }
      } catch (err) {
        console.error("Error fetching lessons:", err);
      }
    };
    fetchLessons();
  }, [courseId]);

  // Fetch quiz questions
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`http://localhost:8000/questions/${courseId}`);
        console.log(res.body)
        if (Array.isArray()) setQuizQuestions();
        console.log(quizQuestions);
      } catch (err) {
        console.error("Error fetching quiz:", err);
      }
    };
    fetchQuiz();
  }, [courseId]);

  // Parse lesson content
  const parseContent = (content = "") => {
    const regex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    let parts = [];
    let lastIndex = 0;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const textPart = content.slice(lastIndex, match.index).trim();
        if (textPart) parts.push({ type: "note", text: textPart });
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
      if (textPart) parts.push({ type: "note", text: textPart });
    }
    return parts;
  };

  const handleQuizChange = (questionId, option) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitQuiz = () => {
    const results = quizQuestions.map((q) => ({
      ...q,
      userAnswer: quizAnswers[q.id] || null,
      isCorrect: quizAnswers[q.id] === q.correctAnswer,
    }));

    const correctCount = results.filter((r) => r.isCorrect).length;

    setQuizResults({
      total: quizQuestions.length,
      correct: correctCount,
      details: results,
    });
  };

  const selectedQuestion = quizQuestions.find(
    (q) => q.id === selectedQuestionId
  );

  return (
    <div className="flex h-screen bg-[#0d1117] text-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#161b22] border-r border-gray-700 overflow-y-auto">
        <h2 className="p-4 text-lg font-bold border-b border-gray-700">
          Course Menu
        </h2>

        {/* Lessons Dropdown */}
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
                    setSelectedQuestionId(null);
                    setQuizAnswers({});
                    setQuizResults(null);
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

        {/* Quiz Sidebar */}
        {quizQuestions.length > 0 && (
          <div className="mt-4">
            <h2 className="p-4 text-lg font-bold border-b border-gray-700">
              📝 Quiz
            </h2>
            <div className="pl-4">
              {quizQuestions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuestionId(q.id)}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#21262d] ${
                    selectedQuestionId === q.id ? "bg-[#30363d]" : ""
                  }`}
                >
                  Question {idx + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Lesson Content */}
        {selectedLesson && !selectedQuestion && (
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

        {/* Selected Quiz Question */}
        {selectedQuestion && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Question: {quizQuestions.indexOf(selectedQuestion) + 1}
            </h2>
            <p className="mb-4">{selectedQuestion.question}</p>
            {selectedQuestion.options.map((opt) => (
              <label key={opt} className="block mb-2">
                <input
                  type="radio"
                  name={selectedQuestion.id}
                  value={opt}
                  disabled={quizResults !== null}
                  checked={quizAnswers[selectedQuestion.id] === opt}
                  onChange={() => handleQuizChange(selectedQuestion.id, opt)}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}

            <button
              onClick={handleSubmitQuiz}
              className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              Submit Quiz
            </button>

            {quizResults && (
              <p className="mt-4 text-lg">
                You got {quizResults.correct}/{quizResults.total} correct!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
