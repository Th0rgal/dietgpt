type Macro = {
  carbs: number;
  proteins: number;
  fats: number;
};

type Ingredient = Macro & {
  name: string;
  amount: string;
};

type Meal = Macro & {
  name: string;
  type: string;
  timestamp: number;
  favorite: boolean;
};

type ApiResponse = {
  type: string;
  name: string;
  ingredients: Ingredient[];
};
