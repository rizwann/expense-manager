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
  