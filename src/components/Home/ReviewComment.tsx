"use client";
import { useState, useEffect, KeyboardEvent, useRef, useMemo } from "react";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";

interface Review {
  id: number;
  rating: number;
  comment: string;
  userName: string;
  date: string;
  createdAt: string;
}

// ข้อมูลตัวอย่างสำหรับการสรุปรีวิว
const reviewSummary = [
  { rating: 5, percentage: 0 },
  { rating: 4, percentage: 0 },
  { rating: 3, percentage: 0 },
  { rating: 2, percentage: 0 },
  { rating: 1, percentage: 0 },
];

// แยกคอมโพเนนต์สำหรับแสดงดาวให้คะแนน
const StarRating = ({ 
  selectedRating, 
  setSelectedRating,
  starsContainerRef
}: { 
  selectedRating: number | null;
  setSelectedRating: (rating: number) => void;
  starsContainerRef: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <div 
      className="flex space-x-1 my-2" 
      ref={starsContainerRef}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && selectedRating) {
          e.preventDefault();
          // กดปุ่ม Enter จะส่งฟอร์ม - การจัดการจะทำที่คอมโพเนนต์หลัก
        }
      }}
    >
      {[1, 2, 3, 4, 5].map((rating) => (
        <Star
          key={rating}
          onClick={() => setSelectedRating(rating)}
          className={`cursor-pointer transition-colors ${
            (selectedRating && rating <= selectedRating)
              ? "text-amber-500 fill-amber-500"
              : "text-gray-300"
          }`}
          size={24}
        />
      ))}
    </div>
  );
};

// แยกคอมโพเนนต์ ReviewSummary
const ReviewSummary = ({ 
  averageRating, 
  totalReviews, 
  ratingPercentages 
}: { 
  averageRating: number;
  totalReviews: number;
  ratingPercentages: { rating: number; percentage: number; }[];
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full">
      {/* Rating Overview */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className="text-3xl sm:text-4xl font-bold">{totalReviews > 0 ? averageRating.toFixed(1) : '0.0'}</div>
        <div className="flex space-x-1 text-black">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              fill={i < Math.floor(averageRating) ? "currentColor" : "none"}
              strokeWidth={i < Math.floor(averageRating) ? 0 : 1.5}
              size={20}
            />
          ))}
        </div>
        <p className="text-sm sm:text-base text-gray-500">({totalReviews} รีวิว)</p>
      </div>

      {/* Review Progress */}
      <div>
        {ratingPercentages.map((review) => (
          <div key={review.rating} className="flex items-center space-x-2 mb-2">
            <span className="w-6 text-sm font-medium">{review.rating}</span>
            <Star className="text-black" size={16} />
            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-red-700 transition-all duration-500" 
                style={{ width: `${review.percentage}%` }}
              ></div>
            </div>
            <span className="w-8 text-xs text-right">{review.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// แยกส่วนแสดงรายการรีวิว
const ReviewList = ({ reviews }: { reviews: Review[] }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">ยังไม่มีรีวิวในขณะนี้</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-80 overflow-y-auto p-2">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{review.userName}</p>
              <div className="flex space-x-1 my-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString('th-TH')}
            </p>
          </div>
          <p className="text-gray-600 mt-2 text-sm">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

// คอมโพเนนต์หลัก
const ReviewComment = () => {
  const { data: session } = useSession();
  const [comment, setComment] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [reviewList, setReviewList] = useState<Review[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
  });
  const [ratingPercentages, setRatingPercentages] = useState(reviewSummary);
  
  // สร้าง ref สำหรับ container ของดาว เพื่อให้สามารถ focus ได้
  const starsContainerRef = useRef<HTMLDivElement>(null);

  // คำนวณเปอร์เซ็นต์สำหรับแต่ละระดับคะแนน - ใช้ useMemo เพื่อเพิ่มประสิทธิภาพ
  const calculateRatingPercentages = useMemo(() => (reviews: Review[]) => {
    const ratingCounts = [0, 0, 0, 0, 0]; // สำหรับคะแนน 1-5
    
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingCounts[review.rating - 1]++;
      }
    });
    
    const total = reviews.length || 1; // ป้องกันการหารด้วย 0
    
    return [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      percentage: Math.round((ratingCounts[rating - 1] / total) * 100) || 0
    }));
  }, []);

  // ดึงข้อมูลรีวิว
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        if (!response.ok) throw new Error("โหลดข้อมูลล้มเหลว");
        
        const data = await response.json();
        const reviews = data.data || [];
        setReviewList(reviews);
        
        // คำนวณค่าเฉลี่ยการให้คะแนนและจำนวนรีวิวทั้งหมด
        if (reviews.length > 0) {
          const total = reviews.length;
          const sum = reviews.reduce((acc: number, review: Review) => acc + review.rating, 0);
          
          // ตั้งค่าข้อมูลสถิติ
          setReviewStats({
            averageRating: parseFloat((sum / total).toFixed(1)),
            totalReviews: total,
          });
          
          // คำนวณและตั้งค่าเปอร์เซ็นต์ของแต่ละคะแนน
          setRatingPercentages(calculateRatingPercentages(reviews));
        } else {
          // กรณีไม่มีข้อมูล ให้ตั้งค่าเริ่มต้น
          setReviewStats({
            averageRating: 0,
            totalReviews: 0,
          });
          setRatingPercentages(reviewSummary);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("ไม่สามารถโหลดข้อมูลรีวิวได้");
      }
    };

    fetchReviews();

    // เซ็ต interval สำหรับการเช็คข้อมูลใหม่ทุกๆ 30 วินาที (real-time polling แบบเหมาะสม)
    const intervalId = setInterval(fetchReviews, 30000);
    
    // Cleanup interval เมื่อ component unmount
    return () => clearInterval(intervalId);
  }, [calculateRatingPercentages]);

  // ส่งรีวิวใหม่
  const handleSubmit = async () => {
    if (!selectedRating) {
      setError("กรุณาให้คะแนน");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // ใช้ชื่อผู้ใช้จริงหากล็อกอินแล้ว ถ้าไม่มีให้ใช้ "บุคคลทั่วไป"
      const userName = session?.user?.name || "บุคคลทั่วไป";
      
      // ส่งข้อมูลไปยัง API
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: selectedRating,
          comment,
          userName: userName
        }),
      });

      if (!response.ok) {
        // ตรวจสอบ HTTP status
        if (response.status === 429) {
          throw new Error("คุณส่งรีวิวเร็วเกินไป กรุณารอสักครู่");
        }
        throw new Error("ส่งรีวิวไม่สำเร็จ");
      }
      
      const data = await response.json();
      
      // เพิ่มรีวิวใหม่เข้าไปใน state
      const newReview = data.data;
      const updatedReviews = [newReview, ...reviewList];
      setReviewList(updatedReviews);
      
      // อัปเดตสถิติรีวิว
      const total = updatedReviews.length;
      const sum = updatedReviews.reduce((acc, review) => acc + review.rating, 0);
      
      setReviewStats({
        averageRating: parseFloat((sum / total).toFixed(1)),
        totalReviews: total,
      });
      
      // อัปเดตเปอร์เซ็นต์ของแต่ละคะแนน
      setRatingPercentages(calculateRatingPercentages(updatedReviews));
      
      // รีเซ็ตฟอร์ม
      setComment("");
      setSelectedRating(null);
      setError("");
      
      // แสดงข้อความสำเร็จแต่ไม่ใช้ alert ที่รบกวนผู้ใช้
      // แทนที่จะใช้ alert ซึ่งรบกวนผู้ใช้
      // ทำให้มีความนุ่มนวลกว่าโดยการใช้ Toast อยู่แล้ว
      // หรือเราสามารถเพิ่ม feedback ภายใน UI ได้
    } catch (error) {
      console.error("Error submitting review:", error);
      setError(error instanceof Error ? error.message : "เกิดข้อผิดพลาด กรุณาลองใหม่");
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

  return (
    <div className="flex flex-col items-center justify-center w-full py-10 px-4 sm:px-6 bg-gray-50">
      <h2 className="font-[Lancelot] text-3xl sm:text-4xl md:text-[40px] text-black text-center mb-6 sm:mb-10">Reviews and Ratings</h2>

      <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto gap-6 lg:gap-10">
        {/* Left Side - Review Summary */}
        <div className="w-full lg:w-1/2">
          <ReviewSummary 
            averageRating={reviewStats.averageRating}
            totalReviews={reviewStats.totalReviews}
            ratingPercentages={ratingPercentages}
          />
          
          {/* Review Form */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mt-6">
            <h3 className="text-lg font-medium mb-3">แสดงความคิดเห็น</h3>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-3 text-sm">
                {error}
              </div>
            )}
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">ให้คะแนน</label>
              <StarRating 
                selectedRating={selectedRating}
                setSelectedRating={setSelectedRating}
                starsContainerRef={starsContainerRef}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">ความคิดเห็น (ไม่บังคับ)</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent transition"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="เขียนความคิดเห็นของคุณที่นี่..."
              />
            </div>
            
            <button
              className="w-full py-2 px-4 bg-red-700 text-white rounded-lg hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedRating}
            >
              {isSubmitting ? "กำลังส่ง..." : "ส่งรีวิว"}
            </button>
          </div>
        </div>
        
        {/* Right Side - Review List */}
        <div className="w-full lg:w-1/2 bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <h3 className="text-lg font-medium mb-3">รีวิวล่าสุด</h3>
          <ReviewList reviews={reviewList} />
        </div>
      </div>
    </div>
  );
};

export default ReviewComment;
