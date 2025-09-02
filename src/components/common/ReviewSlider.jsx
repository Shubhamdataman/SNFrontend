import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { FaStar } from "react-icons/fa";
import { apiConnector } from "../../services/apiconnector";
import { ratingsEndpoints } from "../../services/apis";

function ReviewSlider() {
  const [reviews, setReviews] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const truncateWords = 20;

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        );
        if (data?.success) setReviews(data?.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    })();
  }, []);

  if (reviews.length === 0)
    return <p className="text-white text-center mt-12">No reviews available</p>;

  // Determine how many cards to show at a time
  const cardsToShow = Math.min(reviews.length, 3);

  // Get visible reviews without repeating if fewer than 3
  const visibleReviews = [];
  for (let i = 0; i < cardsToShow; i++) {
    visibleReviews.push(reviews[(startIndex + i) % reviews.length]);
  }

  const nextSlide = () => {
    // Only advance if there are more reviews than visible cards
    if (reviews.length > cardsToShow) {
      setStartIndex((prev) => (prev + 1) % reviews.length);
    }
  };

  const prevSlide = () => {
    if (reviews.length > cardsToShow) {
      setStartIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-16 relative">
      <div className="flex gap-6 overflow-hidden">
        {visibleReviews.map((review, idx) => (
          <div
            key={idx}
            className="bg-richblack-900 p-6 rounded-xl shadow-xl flex-1 flex flex-col gap-4 transition-transform duration-700 transform hover:scale-105"
          >
            <div className="flex items-center gap-4">
              <img
                src={
                  review?.user?.image
                    ? review.user.image
                    : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                }
                alt="user"
                className="h-16 w-16 rounded-full object-cover border-2 border-yellow-100"
              />
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold text-richblack-5">
                  {review?.user?.firstName} {review?.user?.lastName}
                </h1>
                <h2 className="text-sm text-richblack-400">
                  {review?.course?.courseName}
                </h2>
              </div>
            </div>

            <p className="text-richblack-200 text-sm">
              {review?.review.split(" ").length > truncateWords
                ? `${review.review
                    .split(" ")
                    .slice(0, truncateWords)
                    .join(" ")} ...`
                : review.review}
            </p>

            <div className="flex items-center gap-2 mt-auto">
              <span className="font-semibold text-yellow-100">
                {review.rating.toFixed(1)}
              </span>
              <ReactStars
                count={5}
                value={review.rating}
                size={18}
                edit={false}
                activeColor="#ffd700"
                emptyIcon={<FaStar />}
                fullIcon={<FaStar />}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Only show navigation if more reviews than visible cards */}
      {reviews.length > cardsToShow && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-richblack-700 p-4 rounded-full hover:bg-richblack-600 transition-all"
          >
            ◀
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-richblack-700 p-4 rounded-full hover:bg-richblack-600 transition-all"
          >
            ▶
          </button>
        </>
      )}
    </div>
  );
}

export default ReviewSlider;
