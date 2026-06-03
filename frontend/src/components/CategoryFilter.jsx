import { categories } from "../data/foodData";

const categoryEmojis = {
  All: "🍽",
  Pizza: "🍕",
  Burger: "🍔",
  Biryani: "🥘",
  Pasta: "🍝",
  Dessert: "🍰",
  Drinks: "🥤",
  "South Indian": "🥥",
  "North Indian": "🍛",
  Chinese: "🍜",
  Snacks: "🍟"
};

const CategoryFilter = ({ selected, onSelect }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border transition-all ${
            selected === cat
              ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200"
              : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500"
          }`}
        >
          <span>{categoryEmojis[cat]}</span>
          <span>{cat}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
