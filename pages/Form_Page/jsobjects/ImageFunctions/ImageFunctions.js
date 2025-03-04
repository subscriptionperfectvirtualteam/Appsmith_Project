export default {
  fetchImageData: async (url) => {  // Accept the URL as a parameter
    try {
      // Fetch the JSON file from the provided URL
      const response = await fetch(url);
      const data = await response.json();  // Parse the JSON response

      // Store the fetched Base64 image data in the store
      storeValue('imageBase64Data', data.fileData);  // Store the image in a variable

    } catch (error) {
      console.error('Error fetching image data:', error);
      storeValue('imageBase64Data', null);  // Handle the error
    }
  }
	
}