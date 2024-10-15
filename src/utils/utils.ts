import { CategoryName } from "../types";

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