"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "./domain/useDebounce"
import { authFetch } from "@/lib/authFetch";

// Define the shape of the API response
// Assuming the API returns an array of strings (poll names)
type PollResults = string[];

export default function SearchPolls() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<PollResults>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Get the debounced search term (will update 1s after user stops typing)
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  useEffect(() => {
    // Use AbortController for race condition-free fetching
    const controller = new AbortController();
    // const { signal } = controller;

    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      setResults([]);

      try {
        const response = await authFetch(
          `https://personal-project-backend-server.onrender.com/rating-system/search?name=${debouncedSearchTerm}`, // Your API endpoint
          // { signal } // Pass the signal to fetch
        );

        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }

        const data: PollResults = await response.json();
        setResults(data);

      } catch (err: any) {
        if (err.name === 'AbortError') {
          // Fetch was aborted, which is expected. Do nothing.
          console.log('Fetch aborted');
        } else {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if the debounced term is not empty
    if (debouncedSearchTerm) {
      fetchResults();
    } else {
      // Clear results if search term is empty
      setResults([]);
      setError(null);
    }

    // Cleanup function: Abort the fetch if component unmounts
    // or if debouncedSearchTerm changes again
    return () => {
      controller.abort();
    };
  }, [debouncedSearchTerm]); // Re-run effect only when debounced term changes

  const handleResultClick = (name: string) => {
    // URL-encode the name in case it has spaces or special characters
    router.push(`/vote/${encodeURIComponent(name)}`);
  };

  return (
    <div className="relative max-w-lg mx-auto">
      {/* Search Input */}
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for polls..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Results Dropdown */}
      {(isLoading || error || results.length > 0 || (debouncedSearchTerm && !isLoading)) && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isLoading && (
            <li className="px-4 py-2 text-gray-500 italic">Loading...</li>
          )}

          {error && (
            <li className="px-4 py-2 text-red-600">{error}</li>
          )}

          {!isLoading && !error && results.length > 0 && (
            results.map((name) => (
              <li
                key={name}
                onClick={() => handleResultClick(name)}
                className="px-4 py-2 text-gray-800 cursor-pointer hover:bg-blue-50"
              >
                {name}
              </li>
            ))
          )}

          {!isLoading && !error && results.length === 0 && debouncedSearchTerm && (
             <li className="px-4 py-2 text-gray-500 italic">No results found.</li>
          )}
        </ul>
      )}
    </div>
  );
}