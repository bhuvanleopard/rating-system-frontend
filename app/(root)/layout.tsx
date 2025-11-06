import Link from "next/link";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <div>
            {/* Navigation Bar */}
        <nav className="bg-white shadow-md w-full">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            
            {/* Logo or App Name */}
            <Link href="/" className="text-2xl font-bold text-blue-600">
              upvote
            </Link>

            {/* Navigation Links */}
            <ul className="flex items-center space-x-6">

              <li>
                <Link href="/search" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Create
                </Link>
              </li>
              <li>
                <Link href="/my-ratings" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  My Ratings
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Page Content */}
        <main className="container mx-auto p-6">
          {children}
        </main>

    </div>
  );
}