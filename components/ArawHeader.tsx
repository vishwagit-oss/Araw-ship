import { useRouter } from 'next/router'

export default function ArawHeader() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/logout')
    router.push('/login')
  }

  return (
    <header className="bg-white border-b shadow-md mb-8 dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Company Title with Gradient */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-900 to-indigo-900 select-none dark:from-blue-400 dark:via-indigo-400 dark:to-purple-500">
          SYS OIL AND PETROLEUMS CORP
        </h1>

        {/* Logout Button - Solid red background with white text */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 transition duration-300 px-5 py-3 rounded-lg font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
          aria-label="Logout"
          title="Logout"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </header>
  )
}
