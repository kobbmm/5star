"use client";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";

interface Review {
  id: number;
  rating: number;
  comment: string;
  userName: string;
  date: string;
}

// ข้อมูลตัวอย่างสำหรับการสรุปรีวิว
const reviewSummary = [
  { rating: 5, percentage: 86 },
  { rating: 4, percentage: 25 },
  { rating: 3, percentage: 10 },
  { rating: 2, percentage: 3 },
  { rating: 1, percentage: 2 },
];

const ReviewComment = () => {
  const [comment, setComment] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [reviewList, setReviewList] = useState<Review[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ดึงข้อมูลรีวิว
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        if (!response.ok) throw new Error("โหลดข้อมูลล้มเหลว");
        
        const data = await response.json();
        setReviewList(data.data || []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("ไม่สามารถโหลดข้อมูลรีวิวได้");
      }
    };

    fetchReviews();
  }, []);

  // ส่งรีวิวใหม่
  const handleSubmit = async () => {
    if (!selectedRating) {
      setError("กรุณาให้คะแนน");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: selectedRating,
          comment,
          userName: "Anonymous"
        }),
      });

      if (!response.ok) throw new Error("ส่งรีวิวไม่สำเร็จ");
      
      const data = await response.json();
      setReviewList((prev) => [data.data, ...prev]);

      // รีเซ็ตฟอร์ม
      setComment("");
      setSelectedRating(null);
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("ไม่สามารถส่งรีวิวได้");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-6">
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
            {reviewSummary.map((review) => (
              <div key={review.rating} className="flex items-center space-x-2 mb-2">
                <span className="w-6 text-sm font-medium">{review.rating}</span>
                <Star className="text-black" size={16} />
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-red-700" style={{ width: `${review.percentage}%` }}></div>
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
                  className={`cursor-pointer ${i < (selectedRating ?? 0) ? "text-yellow-400" : "text-gray-400"}`}
                  size={24}
                  fill={i < (selectedRating ?? 0) ? "currentColor" : "none"}
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
            <button 
              className="mt-3 w-full bg-red-700 text-white py-2 rounded-lg font-semibold"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "กำลังส่ง..." : "Submit"}
            </button>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>
        </div>

        {/* Right Side - Customer Comments */}
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl">
          <h3 className="text-lg font-semibold mb-4">Customer Comments</h3>
          <div className="max-h-80 overflow-y-auto space-y-3">
            {reviewList.map((review) => (
              <div key={review.id} className="border-b pb-2">
                <p className="font-medium flex items-center">
                  {review.userName} {" "}
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 ml-1" size={16} fill="currentColor" />
                  ))}
                </p>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewComment;
