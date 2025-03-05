import React from 'react'
import { Link } from 'react-router-dom'

const NotFound: React.FC = () => {
  return (
    <div>
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="text-red-700 text-lg ">
        Go to Dashboard
      </Link>
    </div>
  )
}

export default NotFound
