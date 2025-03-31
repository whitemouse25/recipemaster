import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function CreateRecipe() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    category: '',
    area: '',
    image: '',
    ingredients: [{ ingredient: '', measure: '' }],
    instructions: '',
    source: '',
    createdBy: currentUser?.uid,
    createdAt: new Date().toISOString(),
    isCustom: true
  });

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index][field] = value;
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { ingredient: '', measure: '' }]
    });
  };

  const removeIngredient = (index) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to create a recipe');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Add recipe to Firestore
      const docRef = await addDoc(collection(db, 'recipes'), recipe);
      navigate(`/recipe/${docRef.id}`);
    } catch (err) {
      setError('Failed to create recipe. Please try again.');
      console.error('Error creating recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Recipe</h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={recipe.title}
            onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={recipe.description}
            onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
            className="input-field"
            rows="3"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              value={recipe.category}
              onChange={(e) => setRecipe({ ...recipe, category: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cuisine Area</label>
            <input
              type="text"
              value={recipe.area}
              onChange={(e) => setRecipe({ ...recipe, area: e.target.value })}
              className="input-field"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="url"
            value={recipe.image}
            onChange={(e) => setRecipe({ ...recipe, image: e.target.value })}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
          {recipe.ingredients.map((ing, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <input
                type="text"
                placeholder="Amount"
                value={ing.measure}
                onChange={(e) => handleIngredientChange(index, 'measure', e.target.value)}
                className="input-field flex-1"
                required
              />
              <input
                type="text"
                placeholder="Ingredient"
                value={ing.ingredient}
                onChange={(e) => handleIngredientChange(index, 'ingredient', e.target.value)}
                className="input-field flex-2"
                required
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="btn-secondary"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="btn-secondary mt-2"
          >
            Add Ingredient
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Instructions</label>
          <textarea
            value={recipe.instructions}
            onChange={(e) => setRecipe({ ...recipe, instructions: e.target.value })}
            className="input-field"
            rows="6"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Source (Optional)</label>
          <input
            type="url"
            value={recipe.source}
            onChange={(e) => setRecipe({ ...recipe, source: e.target.value })}
            className="input-field"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Creating...' : 'Create Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
} 