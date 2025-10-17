export interface Prize {
  id: string;
  name: string;
  nameCN: string;
  emoji: string;
  initialQuantity: number;
  chanceWeight: number;
  color: string;
}

export const PRIZES: Prize[] = [
  {
    id: "fruit-notes",
    name: "Fruit Sticky Notes",
    nameCN: "水果便签",
    emoji: "🍊",
    initialQuantity: 9,
    chanceWeight: 25,
    color: "hsl(30, 100%, 60%)",
  },
  {
    id: "flower-blocks",
    name: "Flower Building Blocks",
    nameCN: "鲜花积木",
    emoji: "🌸",
    initialQuantity: 5,
    chanceWeight: 10,
    color: "hsl(330, 80%, 70%)",
  },
  {
    id: "cartoon-blocks",
    name: "Cartoon Building Blocks",
    nameCN: "卡通公仔积木",
    emoji: "🧸",
    initialQuantity: 5,
    chanceWeight: 10,
    color: "hsl(280, 70%, 65%)",
  },
  {
    id: "chocolate-notebook",
    name: "Chocolate Notebook",
    nameCN: "巧克力本子",
    emoji: "🍫",
    initialQuantity: 8,
    chanceWeight: 20,
    color: "hsl(25, 75%, 55%)",
  },
  {
    id: "toast-eraser",
    name: "Toast Eraser",
    nameCN: "吐司橡皮擦",
    emoji: "🍞",
    initialQuantity: 6,
    chanceWeight: 22,
    color: "hsl(40, 90%, 70%)",
  },
  {
    id: "cat-stickers",
    name: "Cat Stickers",
    nameCN: "猫咪贴纸",
    emoji: "🐱",
    initialQuantity: 15,
    chanceWeight: 35,
    color: "hsl(200, 80%, 65%)",
  },
  {
    id: "blind-box-stickers",
    name: "Blind Box Stickers",
    nameCN: "盲盒贴纸",
    emoji: "📦",
    initialQuantity: 12,
    chanceWeight: 30,
    color: "hsl(270, 70%, 70%)",
  },
];

const STORAGE_KEY = "slime-wheel-prizes";

export const getPrizeQuantities = (): Record<string, number> => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  const initial: Record<string, number> = {};
  PRIZES.forEach(prize => {
    initial[prize.id] = prize.initialQuantity;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

export const updatePrizeQuantity = (prizeId: string, newQuantity: number) => {
  const quantities = getPrizeQuantities();
  quantities[prizeId] = newQuantity;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quantities));
};

export const resetPrizeQuantities = () => {
  const initial: Record<string, number> = {};
  PRIZES.forEach(prize => {
    initial[prize.id] = prize.initialQuantity;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
};
