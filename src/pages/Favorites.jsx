import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function Favorites() {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser) return;

      try {
        const favoritesQuery = query(
          collection(db, 'favorites'),
          where('userId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(favoritesQuery);
        const favoritesData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        setFavorites(favoritesData);
      } catch (err) {
        setError('Failed to fetch favorites. Please try again.');
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [currentUser]);

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await deleteDoc(doc(db, 'favorites', favoriteId));
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
    } catch (err) {
      setError('Failed to remove favorite. Please try again.');
      console.error('Error removing favorite:', err);
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your favorites</h2>
        <Link to="/login" className="text-blue-600 hover:text-blue-800">
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Favorite Recipes</h1>

      {favorites.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">You haven't added any recipes to your favorites yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => {
            const recipe = favorite.recipe;
            const isCustomRecipe = recipe.isCustom;
            const recipeTitle = isCustomRecipe ? recipe.title : recipe.strMeal;
            const recipeImage = isCustomRecipe ? recipe.image : recipe.strMealThumb;
            const recipeCategory = isCustomRecipe ? recipe.category : recipe.strCategory;
            const recipeArea = isCustomRecipe ? recipe.area : recipe.strArea;

            return (
              <div
                key={favorite.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={recipeImage}
                  alt={recipeTitle}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {recipeTitle}
                  </h2>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="mr-2">{recipeCategory}</span>
                    <span>•</span>
                    <span className="ml-2">{recipeArea}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/recipe/${isCustomRecipe ? recipe.id : recipe.idMeal}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Recipe
                    </Link>
                    <button
                      onClick={() => handleRemoveFavorite(favorite.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 