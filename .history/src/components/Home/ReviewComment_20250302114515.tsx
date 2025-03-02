"use client";
import { useState, useEffect, KeyboardEvent, useRef } from "react";
import { Star } from "lucide-react";
import { headers } from "next/headers";

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
  const [reviewStats, setReviewStats] = useState({
    averageRating: 4.5,
    totalReviews: 120,
  });
  
  // สร้าง ref สำหรับ container ของดาว เพื่อให้สามารถ focus ได้
  const starsContainerRef = useRef<HTMLDivElement>(null);

  // ดึงข้อมูลรีวิว
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        if (!response.ok) throw new Error("โหลดข้อมูลล้มเหลว");
        
        const data = await response.json();
        setReviewList(data.data || []);
        
        // คำนวณค่าเฉลี่ยการให้คะแนนและจำนวนรีวิวทั้งหมด
        if (data.data && data.data.length > 0) {
          const total = data.data.length;
          const sum = data.data.reduce((acc: number, review: Review) => acc + review.rating, 0);
          setReviewStats({
            averageRating: parseFloat((sum / total).toFixed(1)),
            totalReviews: total,
          });
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("ไม่สามารถโหลดข้อมูลรีวิวได้");
      }
    };

    fetchReviews();

    // เซ็ต interval สำหรับการเช็คข้อมูลใหม่ทุกๆ 5 วินาที (real-time polling)
    const intervalId = setInterval(fetchReviews, 5000);
    
    // Cleanup interval เมื่อ component unmount
    return () => clearInterval(intervalId);
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
      const limiter = rateLimit({
        interval: 60 * 1000,
        uniqueTokenPerInterval: 500,
      });

      const headersList = await headers();
      const ip = headersList.get('x-forwarded-for') || 'anonymous';
      
      await limiter.check(10, ip);

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
      
      // อัพเดตรายการรีวิวแบบเรียลไทม์
      const newReview = data.data;
      setReviewList((prev) => [newReview, ...prev]);
      
      // อัพเดตสถิติการรีวิว
      const newTotal = reviewStats.totalReviews + 1;
      const newSum = reviewStats.averageRating * reviewStats.totalReviews + selectedRating;
      setReviewStats({
        averageRating: parseFloat((newSum / newTotal).toFixed(1)),
        totalReviews: newTotal,
      });

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

  // จัดการเมื่อกดปุ่ม Enter ในช่อง textarea
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // ตรวจสอบว่ากดปุ่ม Enter โดยไม่ได้กด Shift (เพื่อให้สามารถขึ้นบรรทัดใหม่ด้วย Shift+Enter ได้)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // ป้องกันการขึ้นบรรทัดใหม่
      
      // ตรวจสอบว่ามีการให้คะแนนดาวหรือไม่
      if (selectedRating) {
        handleSubmit(); // ถ้ามีการให้คะแนนแล้ว ให้ทำการส่งฟอร์ม
      } else {
        setError("กรุณาให้คะแนน");
      }
    }
  };

  // จัดการการกด Enter ทั่วทั้งฟอร์ม
  const handleFormKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && 
        (e.target as HTMLElement).tagName.toLowerCase() !== 'textarea') {
      e.preventDefault();
      
      if (selectedRating) {
        handleSubmit();
      } else {
        setError("กรุณาให้คะแนน");
      }
    }
  };

  // ปรับปรุงการจัดการเมื่อคลิกที่ดาว
  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    // ทำให้ starsContainer ได้รับ focus หลังจากคลิกดาว
    if (starsContainerRef.current) {
      starsContainerRef.current.focus();
    }
  };

  // จัดการการกด Enter ในส่วนของดาว
  const handleStarKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && selectedRating) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // คำนวณเปอร์เซ็นต์สำหรับแต่ละระดับคะแนน
  const calculateRatingPercentages = () => {
    const ratingCounts = [0, 0, 0, 0, 0]; // สำหรับคะแนน 1-5
    
    reviewList.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingCounts[review.rating - 1]++;
      }
    });
    
    const total = reviewList.length || 1; // ป้องกันการหารด้วย 0
    
    return [5, 4, 3, 2, 1].map((rating, index) => ({
      rating,
      percentage: Math.round((ratingCounts[rating - 1] / total) * 100) || 0
    }));
  };
  
  // ใช้ข้อมูลจริงถ้ามีรีวิว หรือใช้ข้อมูลตัวอย่างถ้าไม่มี
  const displayedReviewSummary = reviewList.length > 0 ? calculateRatingPercentages() : reviewSummary;

  return (
    <div className="flex flex-col items-center justify-center w-full p-6" onKeyDown={handleFormKeyPress}>
      <h2 className="font-[Lancelot] text-[40px] text-black text-center mb-6">Reviews and Ratings</h2>

      <div className="flex flex-col lg:flex-row items-center justify-center w-full space-y-6 lg:space-y-0 lg:space-x-6">
        {/* Left Side - Review Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md lg:max-w-3xl">
          {/* Rating Overview */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="text-4xl font-bold">{reviewStats.averageRating}</div>
            <div className="flex space-x-1 text-black">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  fill={i < Math.floor(reviewStats.averageRating) ? "currentColor" : "none"}
                  strokeWidth={i < Math.floor(reviewStats.averageRating) ? 0 : 1.5}
                />
              ))}
            </div>
            <p className="text-gray-500">({reviewStats.totalReviews} Reviews)</p>
          </div>

          {/* Review Progress */}
          <div>
            {displayedReviewSummary.map((review) => (
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
            <div 
              className="flex space-x-1" 
              ref={starsContainerRef} 
              tabIndex={0} 
              onKeyDown={handleStarKeyPress}
              style={{ outline: 'none' }}
            >
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`cursor-pointer ${i < (selectedRating ?? 0) ? "text-yellow-400" : "text-gray-400"}`}
                  size={24}
                  fill={i < (selectedRating ?? 0) ? "currentColor" : "none"}
                  onClick={() => handleStarClick(i + 1)}
                />
              ))}
            </div>
          </div>

          {/* Comment Textarea */}
          <div className="mt-4">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
              rows={4}
              placeholder="Share your experience with us..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={handleKeyPress}
            ></textarea>
            {error && <p className="text-red-500 mt-1">{error}</p>}
            <button
              className="mt-2 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 w-full"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>

        {/* Right Side - Review List */}
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md lg:max-w-3xl h-[600px] overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4">Latest Reviews</h3>
          
          {reviewList.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p>No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviewList.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{review.userName}</span>
                    <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="text-yellow-400"
                        size={16}
                        fill={i < review.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewComment;
