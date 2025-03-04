export default {
  showAttachment: async function(imageUrl) {
    // Fetch the JSON data from the provided image URL
    const response = await fetch(imageUrl);
    const jsonData = await response.json();

    // Extract the Base64 image data from the JSON
    const base64ImageData = jsonData.fileData;

    // Set the image URL with Base64 data in the Image widget inside the Popup
    ImagePopup.setUrl(`data:image/png;base64,${base64ImageData}`); // Assuming the Popup widget is named imagePopup

    // Open the Popup
    ImagePopup.open(); // Open the popup when the button is clicked
  },

  downloadImage: function() {
    // Trigger the download of the image from the Image widget
    const imageUrl = ImagePopup.url;  // Get the URL from the Image widget
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'image.png'; // The name of the downloaded file
    link.click(); // Trigger the download
  }
};
