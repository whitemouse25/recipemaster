import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { MEALDB_API_URL } from '../config/api';

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        // First try to fetch from Firestore (custom recipes)
        const recipeRef = doc(db, 'recipes', id);
        const recipeDoc = await getDoc(recipeRef);

        if (recipeDoc.exists()) {
          setRecipe(recipeDoc.data());
          setLoading(false);
          return;
        }

        // If not found in Firestore, fetch from API
        const response = await axios.get(
          `${MEALDB_API_URL}/lookup.php?i=${id}`
        );
        
        if (response.data.meals && response.data.meals[0]) {
          setRecipe(response.data.meals[0]);
        } else {
          setError('Recipe not found');
        }
      } catch (err) {
        setError('Failed to fetch recipe details. Please try again.');
        console.error('Error fetching recipe:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (currentUser && recipe) {
        const favoriteRef = doc(db, 'favorites', `${currentUser.uid}_${recipe.idMeal || recipe.id}`);
        const favoriteDoc = await getDoc(favoriteRef);
        setIsFavorite(favoriteDoc.exists());
      }
    };

    checkFavorite();
  }, [currentUser, recipe]);

  const toggleFavorite = async () => {
    if (!currentUser) return;

    const favoriteRef = doc(db, 'favorites', `${currentUser.uid}_${recipe.idMeal || recipe.id}`);
    
    if (isFavorite) {
      await deleteDoc(favoriteRef);
    } else {
      await setDoc(favoriteRef, {
        userId: currentUser.uid,
        recipeId: recipe.idMeal || recipe.id,
        recipe: recipe,
        addedAt: new Date().toISOString(),
      });
    }
    
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center">
        <p className="text-gray-600">Recipe not found</p>
      </div>
    );
  }

  // Handle both API and custom recipes
  const isCustomRecipe = recipe.isCustom;
  const recipeTitle = isCustomRecipe ? recipe.title : recipe.strMeal;
  const recipeImage = isCustomRecipe ? recipe.image : recipe.strMealThumb;
  const recipeCategory = isCustomRecipe ? recipe.category : recipe.strCategory;
  const recipeArea = isCustomRecipe ? recipe.area : recipe.strArea;
  const recipeSource = isCustomRecipe ? recipe.source : recipe.strSource;
  const recipeIngredients = isCustomRecipe 
    ? recipe.ingredients.map(ing => `${ing.measure} ${ing.ingredient}`)
    : Array.from({ length: 20 }, (_, i) => {
        const ingredient = recipe[`strIngredient${i + 1}`];
        const measure = recipe[`strMeasure${i + 1}`];
        return ingredient && ingredient.trim() ? `${measure} ${ingredient}` : null;
      }).filter(Boolean);
  const recipeInstructions = isCustomRecipe
    ? recipe.instructions.split('.').filter(step => step.trim()).map(step => step.trim() + '.')
    : recipe.strInstructions.split('.').filter(step => step.trim()).map(step => step.trim() + '.');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={recipeImage}
          alt={recipeTitle}
          className="w-full h-96 object-cover"
        />
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{recipeTitle}</h1>
            {currentUser && (
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-full ${
                  isFavorite
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-400 hover:text-gray-500'
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill={isFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Category</p>
              <p className="text-lg font-semibold">{recipeCategory}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Area</p>
              <p className="text-lg font-semibold">{recipeArea}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Tags</p>
              <p className="text-lg font-semibold">{recipe.strTags || 'N/A'}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Source</p>
              <a
                href={recipeSource}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-blue-600 hover:text-blue-800"
              >
                {isCustomRecipe ? 'View Source' : 'Original Recipe'}
              </a>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
            <ul className="list-disc list-inside space-y-1">
              {recipeIngredients.map((ingredient, index) => (
                <li key={index} className="text-gray-700">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Instructions</h2>
            <ol className="list-decimal list-inside space-y-2">
              {recipeInstructions.map((instruction, index) => (
                <li key={index} className="text-gray-700">
                  {instruction}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 