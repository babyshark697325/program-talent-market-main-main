import { Review } from "@/data/mockReviews";

/**
 * Calculates the average rating from a list of reviews.
 * If there are no reviews, returns 5 (initial rating).
 * 
 * @param reviews Array of reviews to calculate average from
 * @returns Average rating rounded to 1 decimal place, or 5 if no reviews
 */
export const calculateAverageRating = (reviews: Review[]): number => {
    if (!reviews || reviews.length === 0) {
        return 5;
    }

    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / reviews.length;

    // Round to 1 decimal place
    return Math.round(average * 10) / 10;
};
