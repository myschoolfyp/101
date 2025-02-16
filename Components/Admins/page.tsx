"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Admin = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
};

export default function Admins() {
  const router = useRouter();
  const [adminsData, setAdminsData] = useState<Admin[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch("/api/Component/Admins");
      const data = await response.json();
      setAdminsData(data);
    } catch (err) {
      console.error("Failed to fetch admins:", err);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/Component/Admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmin),
      });
      if (response.ok) {
        await fetchAdmins();
        setIsFormVisible(false);
        setNewAdmin({
          firstName: "",
          lastName: "",
          email: "",
          contactNumber: "",
        });
      }
    } catch (err) {
      console.error("Error adding admin:", err);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    try {
      const response = await fetch(`/api/Component/Admins`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        await fetchAdmins();
      }
    } catch (err) {
      console.error("Error deleting admin:", err);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#0F6466]">Admins Management</h1>
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
          placeholder="Search admins..."
          className="border p-3 rounded-lg w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-[#0F6466] text-white px-6 py-3 rounded-lg hover:bg-[#0D4B4C]"
          onClick={() => setIsFormVisible(true)}
        >
          Add Admin
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
          {adminsData
            .filter((admin) =>
              admin.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              admin.lastName.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((admin) => (
              <tr key={admin._id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-center">{admin.firstName}</td>
                <td className="p-4 text-center">{admin.lastName}</td>
                <td className="p-4 text-center">{admin.email}</td>
                <td className="p-4 text-center">{admin.contactNumber}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleDeleteAdmin(admin._id)}
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
            <h2 className="text-xl font-bold mb-4">New Admin</h2>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full p-2 border rounded"
                value={newAdmin.firstName}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, firstName: e.target.value })
                }
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full p-2 border rounded"
                value={newAdmin.lastName}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, lastName: e.target.value })
                }
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-2 border rounded"
                value={newAdmin.email}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, email: e.target.value })
                }
                required
              />
              <input
                type="text"
                name="contactNumber"
                placeholder="Contact Number"
                className="w-full p-2 border rounded"
                value={newAdmin.contactNumber}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, contactNumber: e.target.value })
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