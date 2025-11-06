"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://personal-project-backend-server.onrender.com/login/rating-system", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      
      // Always try to parse the JSON, even for errors
      const data = await response.json();

      if (!response.ok) {
        // Use the error message from the API response
        throw new Error(data.message || "Invalid credentials");
      }

      // --- START: NEW CHANGES ---

      // 1. Check if the token exists in the response
      if (!data.token) {
        throw new Error("Login successful, but no token was provided.");
      }

      // 2. Store the token in localStorage
      //    localStorage is a browser-only storage
      localStorage.setItem("authToken", data.token);

      // --- END: NEW CHANGES ---


      // On successful login, redirect to homepage
      router.push("/"); 

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white shadow-md rounded-lg p-8 border border-gray-200"
      >
        {/* ... rest of the JSX is the same ... */}
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}