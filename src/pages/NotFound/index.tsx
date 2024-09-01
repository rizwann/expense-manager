// src/pages/NotFoundPage.tsx

import React from "react"
import { Link } from "react-router-dom"

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="mb-4 text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mb-8 text-lg">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="text-blue-500 underline">
        Go back to the homepage
      </Link>
    </div>
  )
}

export default NotFoundPage
