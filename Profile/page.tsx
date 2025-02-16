"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function Profile() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [userType, setUserType] = useState<string | null>(null);
  const [userData, setUserData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    profilePicture: string;
    userType: string;
  } | null>(null);
  
  const [error, setError] = useState("");
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
    const userTypeParam = searchParams.get("userType");
    const email = localStorage.getItem("email");
    if (userTypeParam && email) {
      setUserType(userTypeParam);
      fetchUserData(email, userTypeParam);
    } else {
      setError("Login First to Enter Profile Dashboard");
    }
  }, [searchParams]);

  const fetchUserData = async (email: string, userType: string) => {
    try {
      const response = await fetch("/api/profile", {
        headers: { email, userType },
      });
      const data = await response.json();
      data.message ? setError(data.message) : setUserData(data);
    } catch (err) {
      setError("Failed to fetch user details");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("email");
    router.push("/Components/Login");
  };

  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!userData) return <div className="text-center mt-10 text-xl">Loading...</div>;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar Navigation */}
      {/* Sidebar Navigation */}
{isMenuVisible && (
  <nav className="fixed inset-y-0 left-0 w-64 bg-white text-[#0F6466] shadow-xl flex flex-col justify-between">
    <div>
      <div className="py-6 text-center font-bold text-2xl border-b border-[#0F6466]">
        Dashboard
      </div>
      <div className="flex flex-col space-y-5 p-6">
        <button
          className="py-3 px-5 rounded-lg bg-[#0F6466] text-white font-medium hover:bg-[#0D4B4C] transition duration-200 shadow-md"
          onClick={() => router.push("/Components/Admins")}
        >
          Admins
        </button>
        <button
          className="py-3 px-5 rounded-lg bg-[#0F6466] text-white font-medium hover:bg-[#0D4B4C] transition duration-200 shadow-md"
          onClick={() => router.push("/Components/Teachers")}
        >
          Teachers
        </button>
        <button
          className="py-3 px-5 rounded-lg bg-[#0F6466] text-white font-medium hover:bg-[#0D4B4C] transition duration-200 shadow-md"
          onClick={() => router.push("/Components/Students")}
        >
          Students
        </button>
        <button
          className="py-3 px-5 rounded-lg bg-[#0F6466] text-white font-medium hover:bg-[#0D4B4C] transition duration-200 shadow-md"
          onClick={() => router.push("/Components/Parents")}
        >
          Parents
        </button>
      </div>
    </div>
    <div className="p-6">
      <button
        className="w-full py-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition duration-200 shadow-md"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  </nav>
)}

      {/* Main Content */}
      <main className={`flex-grow p-8 transition-all duration-300 ${isMenuVisible ? "ml-64" : "ml-0"}`}>
        <section className="mb-12 p-8 rounded-xl shadow-lg bg-white border border-[#0F6466]">
          <div className="flex justify-between items-center mb-6">
            <button
              className="flex items-center justify-center w-10 h-10 bg-[#0F6466] text-white rounded-full shadow-lg transition duration-200 hover:bg-[#0D4B4C]"
              onClick={() => setIsMenuVisible(!isMenuVisible)}
            >
              {isMenuVisible ? "✕" : "☰"}
            </button>
            <button 
              className="py-3 px-6 rounded-lg bg-[#0F6466] text-white font-medium hover:bg-[#0D4B4C] transition duration-200 shadow-md"
              onClick={() => router.push("/Editprofile")}
            >
              Edit Profile
            </button>
          </div>

          {/* Profile Details */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <img
                src={userData.profilePicture}
                alt="Profile"
                className="w-40 h-40 rounded-full border-4 border-[#0F6466] shadow-xl"
              />
            </div>
            <div className="flex flex-col space-y-4 w-full">
              <h2 className="text-3xl font-bold text-[#0F6466]">
                {userData.firstName} {userData.lastName}
              </h2>
              <p className="text-lg text-gray-700">{userData.email}</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-100 rounded-lg">
                  <p className="text-lg">
                    <span className="font-semibold text-[#0F6466]">Contact:</span> {userData.contactNumber}
                  </p>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg">
                  <p className="text-lg">
                    <span className="font-semibold text-[#0F6466]">Role:</span> {userData.userType}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <h2 className="text-center text-5xl font-bold text-[#0F6466] mt-10">
          School Management Dashboard
        </h2>
      </main>
    </div>
  );
}