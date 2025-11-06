"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// For better error handling, we can type the error state
interface PollErrors {
  name?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  options?: string;
  api?: string; // For general errors from the server
}

export default function CreatePollForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  
  // State for dynamic options
  const [options, setOptions] = useState<string[]>([]);
  const [currentOption, setCurrentOption] = useState("");

  const [errors, setErrors] = useState<PollErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  /**
   * Handles adding a new option to the list
   */
  const handleAddOption = () => {
    if (!currentOption) {
      setErrors(prev => ({ ...prev, options: "Option cannot be empty." }));
      return;
    }
    if (options.includes(currentOption)) {
      setErrors(prev => ({ ...prev, options: "Options must be unique." }));
      return;
    }

    setOptions([...options, currentOption]);
    setCurrentOption("");
    setErrors(prev => ({ ...prev, options: undefined })); // Clear option error
  };

  /**
   * Handles removing an option by its index
   */
  const handleRemoveOption = (indexToRemove: number) => {
    setOptions(options.filter((_, index) => index !== indexToRemove));
  };

  /**
   * Validates the entire form based on the requirements
   */
  const validateForm = (): boolean => {
    const newErrors: PollErrors = {};
    const now = new Date();
    const fiveMinFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    // 1. Required fields
    if (!name) newErrors.name = "Poll name is required.";
    if (!description) newErrors.description = "Description is required.";
    if (!startTime) newErrors.startTime = "Start time is required.";
    if (!endTime) newErrors.endTime = "End time is required.";
    if (options.length < 2) newErrors.options = "At least two options are required.";

    // 2. Time validation
    if (startTime) {
      const startDate = new Date(startTime);
      if (startDate < now) {
        newErrors.startTime = "Start time cannot be in the past.";
      }

      if (endTime) {
        const endDate = new Date(endTime);
        if (endDate < fiveMinFromNow) {
          newErrors.endTime = "End time must be at least 5 minutes from now.";
        }
        if (endDate <= startDate) {
          newErrors.endTime = "End time must be after the start time.";
        }
      }
    }

    setErrors(newErrors);
    // Return true if the newErrors object is empty
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles the final form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({}); // Clear all previous errors

    // 1. Run validation
    if (!validateForm()) {
      setIsLoading(false);
      return; // Stop submission if validation fails
    }

    // 2. Send data to API
    try {
      const response = await fetch("/api/polls", { // Your API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          startTime,
          endTime,
          options,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create poll");
      }

      // 3. Redirect on success
      router.push("/");

    } catch (err: any) {
      setErrors({ api: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <form 
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 border border-gray-200 space-y-6"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Create New Poll
        </h2>

        {/* --- API Error --- */}
        {errors.api && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
            {errors.api}
          </div>
        )}
        
        {/* --- Name --- */}
        <div>
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
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* --- Description --- */}
        <div>
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
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* --- Time Fields (Start & End) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            {errors.startTime && <p className="text-red-600 text-sm mt-1">{errors.startTime}</p>}
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
            {errors.endTime && <p className="text-red-600 text-sm mt-1">{errors.endTime}</p>}
          </div>
        </div>
        
        {/* --- Dynamic Options --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poll Options
          </label>
          
          {/* List of added options */}
          <ul className="space-y-2 mb-3">
            {options.map((option, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-md border">
                <span className="text-gray-800">{option}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="text-red-600 hover:text-red-800 font-medium text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          {/* Input to add new option */}
          <div className="flex gap-2">
            <input
              type="text"
              value={currentOption}
              onChange={(e) => setCurrentOption(e.target.value)}
              placeholder="Add an option"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddOption}
              className="px-4 py-2 bg-blue-100 text-blue-800 font-medium rounded-md hover:bg-blue-200 transition-colors"
            >
              Add
            </button>
          </div>
          {errors.options && <p className="text-red-600 text-sm mt-1">{errors.options}</p>}
        </div>

        {/* --- Submit Button --- */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Poll..." : "Create Poll"}
          </button>
        </div>
      </form>
    </div>
  );
}