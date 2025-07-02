export function generateSKU(product: {
  name: string;
  color?: string;
  size?: string;
}): string {
  const prefix = product.name.substring(0, 3).toUpperCase();
  const colorCode = product.color?.substring(0, 2).toUpperCase() || "XX";
  const sizeCode = product.size?.toUpperCase() || "NA";
  return `${prefix}-${colorCode}-${sizeCode}-${Math.floor(1000 + Math.random() * 9000)}`;
}

// Example usage:
// generateSKU({ name: "T-Shirt", color: "Red", size: "M" })
// → "TSH-RE-M-4265"
