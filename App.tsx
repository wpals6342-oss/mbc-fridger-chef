
import React, { useState, useCallback } from 'react';
import { MealTime, Recipe, GenerationState } from './types';
import { generateRecipes } from './services/geminiService';
import RecipeCard from './components/RecipeCard';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string>('');
  const [mealTime, setMealTime] = useState<MealTime>(MealTime.BREAKFAST);
  const [state, setState] = useState<GenerationState>({
    loading: false,
    recipes: [],
    error: null,
  });

  const handleGenerate = async () => {
    if (!ingredients.trim()) {
      alert('냉장고 속 재료를 입력해주세요!');
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const ingredientList = ingredients.split(',').map(i => i.trim()).filter(i => i !== '');
      const data = await generateRecipes(ingredientList, mealTime);
      setState({ loading: false, recipes: data, error: null });
    } catch (err: any) {
      setState({ 
        loading: false, 
        recipes: [], 
        error: '레시피를 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white">
              <i className="fa-solid fa-refrigerator text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none">Gemini 쉐프</h1>
              <p className="text-xs text-gray-500 mt-1">냉장고 파먹기 AI 레시피</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar: Inputs */}
          <div className="lg:col-span-1 space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-basket-shopping text-orange-500"></i>
                재료 입력
              </h2>
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="예: 달걀, 대파, 두부, 양파 (쉼표로 구분)"
                className="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm transition-all"
              />
              <p className="text-xs text-gray-400 mt-2">입력한 재료를 중심으로 최적의 레시피를 제안합니다.</p>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-clock text-orange-500"></i>
                식사 시간
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(MealTime).map((time) => (
                  <button
                    key={time}
                    onClick={() => setMealTime(time)}
                    className={`py-2 rounded-xl text-sm font-medium transition-all ${
                      mealTime === time 
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-100' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </section>

            <button
              onClick={handleGenerate}
              disabled={state.loading}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                state.loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-orange-500 hover:bg-orange-600 active:scale-95'
              }`}
            >
              {state.loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  AI 요리사 생각 중...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  레시피 추천받기
                </>
              )}
            </button>
          </div>

          {/* Content: Results */}
          <div className="lg:col-span-2">
            {state.error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
                <i className="fa-solid fa-circle-exclamation"></i>
                <p className="text-sm">{state.error}</p>
              </div>
            )}

            {!state.loading && state.recipes.length === 0 && !state.error && (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                  <i className="fa-solid fa-utensils text-4xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800">어떤 요리를 만들어볼까요?</h3>
                <p className="text-gray-500 max-w-xs mt-2">
                  왼쪽 입력창에 있는 재료를 입력하고 버튼을 눌러보세요. Gemini AI가 맛있는 레시피를 제안해 드립니다.
                </p>
              </div>
            )}

            {state.loading && (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm animate-pulse space-y-4">
                    <div className="h-6 bg-gray-100 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                    <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                    <div className="flex gap-4">
                      <div className="h-4 bg-gray-100 rounded w-20"></div>
                      <div className="h-4 bg-gray-100 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!state.loading && state.recipes.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 px-2">
                  <span className="text-orange-500">3가지</span> 맞춤 레시피
                </h2>
                {state.recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-12 py-8 bg-white border-t border-gray-100 text-center">
        <p className="text-sm text-gray-400">Powered by Gemini 3.0 • Happy Cooking!</p>
      </footer>
    </div>
  );
};

export default App;
