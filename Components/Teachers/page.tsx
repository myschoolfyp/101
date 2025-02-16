"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Teacher = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
};

export default function Teachers() {
  const router = useRouter();
  const [teachersData, setTeachersData] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch("/api/Component/Teachers");
      const data = await response.json();
      setTeachersData(data);
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    }
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/Component/Teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeacher),
      });
      if (response.ok) {
        await fetchTeachers();
        setIsFormVisible(false);
        setNewTeacher({
          firstName: "",
          lastName: "",
          email: "",
          contactNumber: "",
        });
      }
    } catch (err) {
      console.error("Error adding teacher:", err);
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    try {
      const response = await fetch(`/api/Component/Teachers`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        await fetchTeachers();
      }
    } catch (err) {
      console.error("Error deleting teacher:", err);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#0F6466]">Teachers Management</h1>
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
          placeholder="Search teachers..."
          className="border p-3 rounded-lg w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-[#0F6466] text-white px-6 py-3 rounded-lg hover:bg-[#0D4B4C]"
          onClick={() => setIsFormVisible(true)}
        >
          Add Teacher
        </button>
      </div>

      <table className="w-full border-collapse shadow-lg">
        <thead className="bg-[#0F6466] text-white">
          <tr>
            <th className="p-4">First Name</th>
            <th className="p-4">Last Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Contact</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachersData
            .filter((teacher) =>
              teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((teacher) => (
              <tr key={teacher._id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-center">{teacher.firstName}</td>
                <td className="p-4 text-center">{teacher.lastName}</td>
                <td className="p-4 text-center">{teacher.email}</td>
                <td className="p-4 text-center">{teacher.contactNumber}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleDeleteTeacher(teacher._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {isFormVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">New Teacher</h2>
            <form onSubmit={handleAddTeacher} className="space-y-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full p-2 border rounded"
                value={newTeacher.firstName}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, firstName: e.target.value })
                }
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full p-2 border rounded"
                value={newTeacher.lastName}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, lastName: e.target.value })
                }
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-2 border rounded"
                value={newTeacher.email}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, email: e.target.value })
                }
                required
              />
              <input
                type="text"
                name="contactNumber"
                placeholder="Contact Number"
                className="w-full p-2 border rounded"
                value={newTeacher.contactNumber}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, contactNumber: e.target.value })
                }
                required
              />
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setIsFormVisible(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0F6466] text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}