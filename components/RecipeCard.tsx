
import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800">{recipe.name}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            recipe.difficulty === '쉬움' ? 'bg-green-100 text-green-700' :
            recipe.difficulty === '보통' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
          }`}>
            {recipe.difficulty}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{recipe.description}</p>
        
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
          <span className="flex items-center gap-1">
            <i className="fa-regular fa-clock"></i> {recipe.estimatedTime}
          </span>
          <span className="flex items-center gap-1">
            <i className="fa-solid fa-utensils"></i> {recipe.ingredients.length}개 재료
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm text-gray-800 mb-2">필요한 재료</h4>
            <div className="flex flex-wrap gap-2">
              {recipe.ingredients.map((ing, idx) => (
                <span key={idx} className="bg-gray-50 text-gray-600 px-2 py-1 rounded text-xs border border-gray-200">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-800 mb-2">조리 순서</h4>
            <ol className="space-y-2">
              {recipe.instructions.map((step, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-gray-600">
                  <span className="font-bold text-orange-500 shrink-0">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
