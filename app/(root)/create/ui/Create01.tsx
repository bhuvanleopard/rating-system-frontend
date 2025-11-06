"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { authFetch } from "@/lib/authFetch";

export default function CreatePollForm() {
  const router = useRouter();
  
  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]); // Start with 2 options
  
  // UI State
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- Dynamic Option Handlers ---

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    // Prevent removing below 2 options
    if (options.length <= 2) return;
    
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  // --- Form Validation & Submission ---

  const validateForm = (): string | null => {
    // 1. Check required fields
    if (!name || !description || !startTime || !endTime) {
      return "All fields (Name, Description, Start, End) are required.";
    }

    // 2. Check options (at least 2 non-empty, all unique)
    const filledOptions = options.filter(opt => opt.trim() !== "");
    if (filledOptions.length < 2) {
      return "Please provide at least two valid poll options.";
    }
    
    const uniqueOptions = new Set(filledOptions);
    if (uniqueOptions.size !== filledOptions.length) {
      return "Options must be unique.";
    }

    // 3. Check Date/Time
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    // Add 10 seconds of grace period for "past" check
    const gracePeriod = 10 * 1000; 
    if (start.getTime() < now.getTime() - gracePeriod) {
      return "Start time cannot be in the past.";
    }

    const fiveMinFromNow = new Date(now.getTime() + 5 * 60000);
    if (end < fiveMinFromNow) {
      return "End time must be at least 5 minutes from the current time.";
    }

    if (end <= start) {
      return "End time must be after the start time.";
    }

    return null; // All valid
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Run Validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    
    // 2. Send API Request
    try {
      const response = await authFetch("https://personal-project-backend-server.onrender.com/rating-system/create-poll", { // Your API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          startTime,
          endTime,
          options: options.filter(opt => opt.trim() !== ""), // Send only filled options
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      // 3. Redirect on Success
      router.push("/");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white shadow-lg rounded-lg p-8 border border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create a New Poll
        </h2>

        {/* Error Message Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Poll Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Start & End Times */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="datetime-local"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="datetime-local"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Dynamic Options */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Options
          </label>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  disabled={options.length <= 2}
                  className="p-2 text-red-600 hover:text-red-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Option</span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Poll..." : "Create Poll"}
          </button>
        </div>
      </form>
    </div>
  );
}