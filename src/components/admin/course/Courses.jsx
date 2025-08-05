import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash, CheckCircle, XCircle, Plus } from "lucide-react";
export const Courses = () => {
     const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8000/courses");
      setCourses(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err.message);
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await axios.delete(`http://localhost:8000/courses`);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  const togglePublish = async (id, currentStatus) => {
    try {
      const res = await axios.patch(`http://localhost:8000/courses`, {
        isPublished: !currentStatus,
      });
      setCourses((prev) =>
        prev.map((c) => (c._id === id ? { ...c, isPublished: !currentStatus } : c))
      );
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  };
  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Courses</h2>
        <button className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-md hover:bg-green-700">
          <Plus size={16} />
          Add Course
        </button>
      </div>

      {courses.length === 0 ? (
        <p className="text-gray-400">No courses found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-3 text-left">Thumbnail</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Instructor</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr
                  key={course._id}
                  className="border-t border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="p-3">
                    <img
                      src={course.imageUrl}
                      alt="thumbnail"
                      className="w-14 h-14 object-cover rounded"
                    />
                  </td>
                  <td className="p-3">{course.title}</td>
                  <td className="p-3">{course.instructor}</td>
                  <td className="p-3">₹{course.price}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        course.isPublished ? "bg-green-600" : "bg-yellow-600"
                      }`}
                    >
                      {course.isPublished ? "Published" : "Unpublished"}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => togglePublish(course._id, course.isPublished)}
                      className={`p-2 rounded hover:scale-105 transition ${
                        course.isPublished ? "bg-yellow-500" : "bg-green-500"
                      }`}
                    >
                      {course.isPublished ? <XCircle size={18} /> : <CheckCircle size={18} />}
                    </button>
                    <button className="p-2 rounded bg-blue-500 hover:bg-blue-600">
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => deleteCourse(course._id)}
                      className="p-2 rounded bg-red-600 hover:bg-red-700"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
