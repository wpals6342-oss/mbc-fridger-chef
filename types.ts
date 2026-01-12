
export enum MealTime {
  BREAKFAST = '아침',
  LUNCH = '점심',
  DINNER = '저녁'
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  estimatedTime: string;
  difficulty: '쉬움' | '보통' | '어려움';
}

export interface GenerationState {
  loading: boolean;
  recipes: Recipe[];
  error: string | null;
}
