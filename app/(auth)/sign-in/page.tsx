"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Use 'next/navigation' for App Router

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://personal-project-backend-server.onrender.com/sign-up/rating-system", { // Example API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (!response.ok) {
        // Try to get error message from response body
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      // If response is successful (e.g., 201 Created)
      console.log("Sign-up successful!");
      router.push("/login"); // Redirect to the login page

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
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create Account
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Username Input */}
        <div className="mb-4">
          <label 
            htmlFor="username" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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

        {/* Password Input */}
        <div className="mb-6">
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
}