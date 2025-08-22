import axios from 'axios';

const API_KEY = process.env.GOOGLE_API_KEY; // Your Google Places API key
const PLACE_ID = process.env.GOOGLE_PLACE_ID; // The place you want reviews from
const MAX_REVIEWS = 5;

export default async function () {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json`;
    const response = await axios.get(url, {
      params: {
        place_id: PLACE_ID,
        fields: 'reviews',
        key: API_KEY,
      },
    });

    const reviews = response.data.result.reviews?.slice(0, MAX_REVIEWS) || [];

    return reviews.map((review) => ({
      author_name: review.author_name,
      rating: review.rating,
      text: review.text,
      relative_time_description: review.relative_time_description,
      profile_photo_url: review.profile_photo_url,
    }));
  } catch (err) {
    console.error('Error fetching Google reviews:', err.message);
    return [];
  }
}
