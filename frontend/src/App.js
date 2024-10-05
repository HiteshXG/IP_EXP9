import React, { useState, useEffect } from "react";
import "./App.css";

const ReviewApp = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: "", content: "" });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/reviews");
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });
      if (response.ok) {
        setNewReview({ name: "", content: "" });
        fetchReviews();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="review-page">
      <h1>Review Application</h1>
      <div className="card-container">
        <div className="review-form-card card">
          <h2>Submit a Review</h2>
          <form onSubmit={handleSubmit} className="review-form">
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                name="name"
                value={newReview.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Your Review</label>
              <textarea
                name="content"
                value={newReview.content}
                onChange={handleInputChange}
                placeholder="Write your review here"
                required
              />
            </div>
            <button type="submit" className="submit-button">Submit Review</button>
          </form>
        </div>
        <div className="reviews card">
          <h3>Reviews</h3>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="review-entry">
                <p><strong>{review.name}</strong></p>
                <p>{review.content}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to submit a review!</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default ReviewApp;