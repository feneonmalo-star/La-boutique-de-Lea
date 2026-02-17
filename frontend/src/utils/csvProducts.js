// Utility to fetch and parse products from Google Sheets CSV
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTCngYZIM0JKHX3GItiN3N8Xo9-K7jBPsg9Z8udpyBLSdzkShRpz-df6Q8lHKFZBtJsVZhQn6F0jBBy/pub?gid=0&single=true&output=csv';

// Parse CSV text to array of objects
function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const products = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    // Handle CSV with quoted fields
    const values = [];
    let currentValue = '';
    let inQuotes = false;
    
    for (let char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());
    
    if (values.length >= headers.length) {
      const product = {};
      headers.forEach((header, index) => {
        product[header] = values[index] ? values[index].replace(/^"|"$/g, '') : '';
      });
      products.push(product);
    }
  }
  
  return products;
}

// Convert CSV product to app format
function convertProduct(csvProduct) {
  // Parse price: "4,30€" -> 4.30
  let price = 0;
  if (csvProduct.Prix || csvProduct['Prix ']) {
    const priceStr = (csvProduct.Prix || csvProduct['Prix ']).replace('€', '').replace(',', '.').trim();
    price = parseFloat(priceStr) || 0;
  }
  
  // Parse stock
  const stock = parseInt(csvProduct.Stock || csvProduct['Stock ']) || 0;
  
  // Get payment link
  const paymentLink = (csvProduct.LienPaiement || '').trim();
  
  return {
    id: csvProduct.ID || '',
    name: csvProduct.Nom || '',
    description: (csvProduct.Description || csvProduct['Description ']).trim(),
    price: price,
    image_url: csvProduct.ImageURL || '',
    category: (csvProduct.Catégorie || csvProduct['Catégorie ']).trim(),
    stock: stock,
    payment_link: paymentLink,
    created_at: new Date().toISOString()
  };
}

// Fetch products from CSV
export async function fetchProductsFromCSV() {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch CSV');
    }
    
    const csvText = await response.text();
    const csvProducts = parseCSV(csvText);
    
    // Convert to app format
    const products = csvProducts.map(convertProduct);
    
    return products;
  } catch (error) {
    console.error('Error fetching products from CSV:', error);
    return [];
  }
}

// Get unique categories from products
export function getCategories(products) {
  const categories = new Set();
  products.forEach(product => {
    if (product.category) {
      categories.add(product.category);
    }
  });
  return ['all', ...Array.from(categories)];
}
