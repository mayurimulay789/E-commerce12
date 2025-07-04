"use client"

import { useState } from "react"
import { useSelector } from "react-redux"

const ReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [hoveredRating, setHoveredRating] = useState(0)

  const { user } = useSelector((state) => state.auth)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (rating === 0) {
      alert("Please select a rating")
      return
    }
    if (!comment.trim()) {
      alert("Please write a review")
      return
    }

    onSubmit({ rating, comment })
    setRating(0)
    setComment("")
  }

  if (!user) {
    return (
      <div className="p-6 text-center rounded-lg bg-gray-50">
        <p className="text-gray-600">Please login to write a review</p>
      </div>
    )
  }

  return (
    <div className="p-6 rounded-lg bg-gray-50">
      <h4 className="mb-4 font-semibold text-gray-900">Write a Review</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Rating</label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                <svg
                  className={`w-6 h-6 ${star <= (hoveredRating || rating) ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block mb-2 text-sm font-medium text-gray-700">
            Your Review
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this product..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800"
        >
          Submit Review
        </button>
      </form>
    </div>
  )
}

export default ReviewForm
