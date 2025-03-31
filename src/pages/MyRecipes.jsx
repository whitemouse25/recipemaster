import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function MyRecipes() {
  const { currentUser } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!currentUser) return;

      try {
        const recipesQuery = query(
          collection(db, 'recipes'),
          where('createdBy', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(recipesQuery);
        const recipesData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        setRecipes(recipesData);
      } catch (err) {
        setError('Failed to fetch your recipes. Please try again.');
        console.error('Error fetching recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [currentUser]);

  const handleDelete = async (recipeId) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;

    try {
      await deleteDoc(doc(db, 'recipes', recipeId));
      setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
    } catch (err) {
      setError('Failed to delete recipe. Please try again.');
      console.error('Error deleting recipe:', err);
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your recipes</h2>
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
        <Link
          to="/create-recipe"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create New Recipe
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">You haven't created any recipes yet.</p>
          <Link
            to="/create-recipe"
            className="text-blue-600 hover:text-blue-800"
          >
            Create your first recipe
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {recipe.title}
                </h2>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="mr-2">{recipe.category}</span>
                  <span>•</span>
                  <span className="ml-2">{recipe.area}</span>
                </div>
                <div className="flex justify-between items-center">
                  <Link
                    to={`/recipe/${recipe.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Recipe
                  </Link>
                  {recipe.createdBy === currentUser.uid && (
                    <Link
                      to={`/edit-recipe/${recipe.id}`}
                      className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md hover:bg-indigo-200 transition-colors"
                    >
                      Edit
                    </Link>
                  )}
                  <button
                    onClick={() => handleDelete(recipe.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 