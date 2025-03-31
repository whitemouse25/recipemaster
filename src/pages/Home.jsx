import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { MEALDB_API_URL } from '../config/api';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchRecipes = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Search in Firestore for custom recipes
      const customRecipesQuery = query(
        collection(db, 'recipes'),
        where('title', '>=', searchQuery),
        where('title', '<=', searchQuery + '\uf8ff')
      );
      const customRecipesSnapshot = await getDocs(customRecipesQuery);
      const customRecipes = customRecipesSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        isCustom: true
      }));

      // Search in API
      const response = await axios.get(
        `${MEALDB_API_URL}/search.php?s=${searchQuery}`
      );

      const apiRecipes = response.data.meals || [];
      const formattedApiRecipes = apiRecipes.map(recipe => ({
        ...recipe,
        isCustom: false
      }));

      // Combine and sort recipes
      const allRecipes = [...customRecipes, ...formattedApiRecipes];
      setRecipes(allRecipes);
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.');
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Recipe
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover delicious recipes from around the world
          </p>
          <form onSubmit={searchRecipes} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for recipes..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-colors duration-200"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center max-w-md mx-auto">
            {error}
          </div>
        )}

        {!loading && !error && recipes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <Link
                key={recipe.isCustom ? recipe.id : recipe.idMeal}
                to={`/recipe/${recipe.isCustom ? recipe.id : recipe.idMeal}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={recipe.isCustom ? recipe.image : recipe.strMealThumb}
                    alt={recipe.isCustom ? recipe.title : recipe.strMeal}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                  {recipe.isCustom && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Custom Recipe
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {recipe.isCustom ? recipe.title : recipe.strMeal}
                  </h2>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="mr-2">
                      {recipe.isCustom ? recipe.category : recipe.strCategory}
                    </span>
                    <span>•</span>
                    <span className="ml-2">
                      {recipe.isCustom ? recipe.area : recipe.strArea}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && !error && recipes.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <p className="text-gray-600 mb-4">No recipes found. Try a different search term.</p>
              <Link
                to="/create-recipe"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Create your own recipe
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 