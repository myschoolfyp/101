"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Student = {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  classLevel: number;
  classType: string;
};

export default function Students() {
  const router = useRouter();
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/Component/Students");
      const data = await response.json();
      setStudentsData(data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      const response = await fetch(`/api/component/students`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        await fetchStudents();
      }
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  const getFilterOptions = () => {
    const options = [];
    // Classes 1-7
    for (let i = 1; i <= 7; i++) {
      options.push({ value: `${i}-00`, label: `Class ${i}` });
    }
    // Classes 8-10 with types
    for (let level of [8, 9, 10]) {
      for (let type of ["Science", "Arts", "Computer"]) {
        options.push({
          value: `${level}-${type}`,
          label: `Class ${level} - ${type}`,
        });
      }
    }
    return options;
  };

  const filteredStudents = studentsData
    .filter((student) => {
      const matchesSearch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (selectedFilter === "all") return matchesSearch;
      
      const [filterLevel, filterType] = selectedFilter.split("-");
      const isBasicClass = parseInt(filterLevel) <= 7;
      const typeMatches = isBasicClass ? "00" : 
        filterType === "Science" ? "11" :
        filterType === "Arts" ? "22" : "33";

      return matchesSearch &&
        student.classLevel === parseInt(filterLevel) &&
        (isBasicClass ? student.classType === "00" : student.classType === typeMatches);
    });

  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#0F6466]">Students Management</h1>
        <button
          className="bg-[#0F6466] text-white px-6 py-3 rounded-lg hover:bg-[#0D4B4C]"
          onClick={() => router.back()}
        >
          Back to Dashboard
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search students..."
          className="border p-3 rounded-lg w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-3 rounded-lg w-64"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="all">All Students</option>
          {getFilterOptions().map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full border-collapse shadow-lg">
        <thead className="bg-[#0F6466] text-white">
          <tr>
            <th className="p-4">Roll No</th>
            <th className="p-4">First Name</th>
            <th className="p-4">Last Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Contact</th>
            <th className="p-4">Class Level</th>
            <th className="p-4">Class Type</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student._id} className="border-b hover:bg-gray-50">
              <td className="p-4 text-center font-semibold">{student.id}</td>
              <td className="p-4 text-center">{student.firstName}</td>
              <td className="p-4 text-center">{student.lastName}</td>
              <td className="p-4 text-center">{student.email}</td>
              <td className="p-4 text-center">{student.contactNumber}</td>
              <td className="p-4 text-center">{student.classLevel}</td>
              <td className="p-4 text-center">
                {student.classLevel <= 7 ? "General" : student.classType}
              </td>
              <td className="p-4 text-center">
                <button
                  onClick={() => handleDeleteStudent(student._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}