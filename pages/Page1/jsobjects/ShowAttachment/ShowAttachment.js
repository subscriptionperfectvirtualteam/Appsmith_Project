export default {
  showAttachment: async function(imageUrl) {
    try {
      // Step 1: Fetch the JSON data from the provided image URL
      const response = await fetch(imageUrl);
      const jsonData = await response.json();  // Parse the JSON response

      // Step 2: Extract the Base64 image data from the JSON response
      const base64ImageData = jsonData.fileData;

      // Step 3: Ensure the Base64 data is available
      if (base64ImageData) {
        // Step 4: Set the Base64 data to the Image widget inside the Popup
        ImagePopup.setUrl(base64ImageData);  // Set the image source to the Base64 data

        // Step 5: Open the Popup to display the image
        ImagePopup.open();  // Open the popup when the button is clicked
      } else {
        console.error("No Base64 image data found in response.");
      }
    } catch (error) {
      // Log any errors during fetching or parsing the image data
      console.error("Error fetching or parsing the image data:", error);
    }
  },

  downloadImage: function() {
    // Step 1: Get the URL of the image from the Image widget
    const imageUrl = ImagePopup.url;  // Get the URL from the Image widget inside the Popup

    // Step 2: Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'image.png';  // Specify the download file name
    link.click();  // Trigger the download
  }
};
