import { CategoryName, House } from "../types";

export function generateContrastingColors(numColors:number) {
    const colors = [];
    const saturation = 70; // High saturation for bright colors
    const lightness = 50;  // Middle lightness for good contrast
  
    for (let i = 0; i < numColors; i++) {
      // Distribute the hues evenly across the color wheel
      const hue = Math.floor((i * 360) / numColors);
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      colors.push(color);
    }
  
    return colors;
  }
  
  // add image according to category
export const getImage = (category: string) => {
  switch (category) {
    case CategoryName.Grocery:
      return "/grocery.png"
    case CategoryName.Restaurant:
      return "/restaurant.png"
    case CategoryName.Clothing:
      return "/clothing.png"
    case CategoryName.Entertainment:
      return "/entertainment.png"
    case CategoryName.Butcher:
      return "/butcher.png"
    case CategoryName.Travel:
      return "/travel.png"
    case CategoryName.Electronics:
      return "/electronics.png"
    case CategoryName.Utilities:
      return "/utilities.png"
    case CategoryName.Health:
      return "/health.png"
    case CategoryName.Furniture:
      return "/furniture.png"
    default:
      return "/others.png"
  }
}
const currencies =  [
  { value: "USD", label: "USD", symbol: "$" },
  { value: "EUR", label: "EUR", symbol: "€" },
  { value: "GBP", label: "GBP", symbol: "£" },
  { value: "BDT", label: "BDT", symbol: "৳" },
  { value: "AUD", label: "AUD", symbol: "A$" },
  { value: "CAD", label: "CAD", symbol: "C$" },
  { value: "CNY", label: "CNY", symbol: "¥" },
  { value: "INR", label: "INR", symbol: "₹" },
  { value: "JPY", label: "JPY", symbol: "¥" },
]

export const getCurrencySymbol = (house:House) => {
  const currency = currencies.find((currency) => currency.value === house.currency)
  return currency?.symbol || currencies[0].symbol
}

export const getCurrencySymbolByValue = (currencyValue:string) => {
  const currency = currencies.find((currency) => currency.value === currencyValue)
  return currency?.symbol || currencies[0].symbol
}
