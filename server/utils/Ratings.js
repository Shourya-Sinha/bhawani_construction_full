// utils/rating.js
export const addRating = async (doc, newRating, userId) => {
  // Prevent duplicate ratings by same user
  const existingRating = doc.ratings.find(r => r.by.toString() === userId.toString());
  if (existingRating) {
    throw new Error("You have already rated this.");
  }

  // Add the new rating
  doc.ratings.push(newRating);

  // Recalculate average rating
  const total = doc.ratings.reduce((sum, r) => sum + r.stars, 0);
  doc.averageRating = total / doc.ratings.length;

  await doc.save();
};
