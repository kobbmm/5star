"use client";
import { useState } from "react";
import { Star } from "lucide-react";

const reviews = [
  { rating: 5, percentage: 86 },
  { rating: 4, percentage: 25 },
  { rating: 3, percentage: 10 },
  { rating: 2, percentage: 3 },
  { rating: 1, percentage: 2 },
];

const comments = [
  { user: "Alice", text: "Great service! Highly recommended.", rating: 5 },
  { user: "Bob", text: "The food was delicious and fresh!", rating: 4 },
  { user: "Charlie", text: "Nice ambiance and friendly staff.", rating: 5 },
  { user: "Daisy", text: "Loved the desserts, will come back for more!", rating: 4 },
  { user: "Eve", text: "Fast delivery and tasty dishes!", rating: 5 },
  { user: "Ai", text: "I like food!", rating: 5 },
  { user: "Butter", text: "The service staff are very lovely.", rating: 5 },
  { user: "Liam Anderson", text: "The menu is a bit too creative. I'd like to have a seasonal menu. Enjoy", rating: 3 },
];

const ReviewComment = () => {
  const [comment, setComment] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center w-full p-6">
      {/* Main Title */}
      <h2 className="font-[Lancelot] text-[40px] text-black text-center mb-6">Reviews and Ratings</h2>
      
      <div className="flex flex-col lg:flex-row items-center justify-center w-full space-y-6 lg:space-y-0 lg:space-x-6">
        {/* Left Side - Review Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl">
          {/* Rating Overview */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="text-4xl font-bold">4.5</div>
            <div className="flex space-x-1 text-black">
              {[...Array(5)].map((_, i) => (
                <Star key={i} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p className="text-gray-500">(120 Reviews)</p>
          </div>

          {/* Review Progress */}
          <div>
            {reviews.map((review) => (
              <div key={review.rating} className="flex items-center space-x-2 mb-2">
                <span className="w-6 text-sm font-medium">{review.rating}</span>
                <Star className="text-black" size={16} />
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-red-700"
                    style={{ width: `${review.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">{review.percentage}%</span>
              </div>
            ))}
          </div>

          {/* Rating Selection */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Rate your experience</h3>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`cursor-pointer ${i < selectedRating ? "text-yellow-400" : "text-gray-400"}`}
                  size={24}
                  fill={i < selectedRating ? "currentColor" : "none"}
                  onClick={() => setSelectedRating(i + 1)}
                />
              ))}
            </div>
          </div>

          {/* How are you feeling? */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">How are you feeling?</h3>
            <textarea
              className="w-full p-3 border rounded-lg"
              placeholder="Your input is valuable in helping us improve..."
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <button className="mt-3 w-full bg-red-700 text-white py-2 rounded-lg font-semibold">
              Submit
            </button>
          </div>
        </div>

        {/* Right Side - Customer Comments */}
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl">
          <h3 className="text-lg font-semibold mb-4">Customer Comments</h3>
          <div className="max-h-80 overflow-y-auto space-y-3">
            {comments.map((c, index) => (
              <div key={index} className="border-b pb-2">
                <p className="font-medium flex items-center">
                  {c.user} {" "}
                  {[...Array(c.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 ml-1" size={16} fill="currentColor" />
                  ))}
                </p>
                <p className="text-gray-600">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewComment;