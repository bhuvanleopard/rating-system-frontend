/**
 * A custom wrapper for the native `fetch` function.
 * It automatically gets the 'authToken' from localStorage
 * and adds it to the request headers as 'Authorization: Bearer ${token}'.
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  let token: string | null = null;

  // Check if we are in the browser environment before accessing localStorage
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('authToken');
  }

  // Prepare the headers
  const defaultHeaders = {
    'Content-Type': 'application/json', // Default to JSON
    ...options.headers, // Allow overriding with custom headers
    Authorization: `Bearer ${token}`
  };

  // If a token exists, add the Authorization header
  if (token) {
    defaultHeaders.Authorization= `Bearer ${token}` as string;
  }

  // Merge the new headers with the provided options
  const mergedOptions: RequestInit = {
    ...options,
    headers: defaultHeaders,
  };

  // Make the fetch call
  const response = await fetch(url, mergedOptions);

  // You could add global error handling here if you wanted
  // For example, if response.status === 401 (Unauthorized),
  // you could clear localStorage and redirect to /login.

  return response;
}