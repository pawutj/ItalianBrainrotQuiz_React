'use client';

/**
 * Reads a JSON file from the file system or falls back to fetch
 * 
 * @param {string} path - Path to the JSON file
 * @returns {Promise<object>} Parsed JSON data
 */
export const readJsonFile = async (path) => {
  try {
    // First try using window.fs if available
    if (typeof window !== 'undefined' && window.fs && window.fs.readFile) {
      // Handle absolute paths starting with / for public directory
      const fsPath = path.startsWith('/') 
        ? `D:\\workspace\\quiz\\my-app\\public${path}`
        : path;
      
      const data = await window.fs.readFile(fsPath, { encoding: 'utf8' });
      return JSON.parse(data);
    }
    
    // Fallback to fetch if window.fs is not available
    // Path should already be relative to public directory
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${path}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error reading file at ${path}:`, error);
    throw error;
  }
};

/**
 * Filters images with even IDs from the image data
 * 
 * @param {object} imageData - The full image data object
 * @returns {Array} Filtered array of images with even IDs
 */
export const filterEvenIdImages = (imageData) => {
  if (!imageData || !imageData.images || !Array.isArray(imageData.images)) {
    return [];
  }
  
  return imageData.images.filter(img => img.src.startsWith('https://')
  );
};

/**
 * Finds the matching character for an image
 * Following the pattern: characterId = (imageId - 4) / 2
 * 
 * @param {object} image - The image object
 * @param {Array} characters - Array of character objects
 * @returns {object|null} The matching character or null if no match found
 */
export const findMatchingCharacter = (image, characters) => {
  if (!image || !characters || !Array.isArray(characters)) {
    return null;
  }
  
  // First try to match by the correct ID formula: characterId = (imageId - 4) / 2
  const characterId = (image.id - 4) / 2;
  const matchById = characters.find(char => char.id === characterId);
  if (matchById) {
    return matchById;
  }
  
  // If ID matching fails, try to match by name
  // Extract name from the image alt or character_name
  let imageName = '';
  if (image.character_name) {
    imageName = image.character_name.replace(/^File:/, '').replace(/\.\.\.$/g, '');
  } else if (image.alt) {
    imageName = image.alt.replace(/^File:/, '').replace(/\.\.\.$/g, '');
  }
  
  if (imageName) {
    // Look for characters with similar names
    imageName = imageName.toLowerCase();
    
    // Find a character whose name contains the image name or vice versa
    const matchByName = characters.find(char => {
      const charName = char.text.toLowerCase();
      return charName.includes(imageName) || imageName.includes(charName);
    });
    
    if (matchByName) {
      return matchByName;
    }
  }
  
  // If no match is found, return null
  return null;
};
