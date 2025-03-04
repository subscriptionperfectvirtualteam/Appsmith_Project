export default {
    downloadImage: () => {
        try {
            const base64Data = appsmith.store.imageBase64Data;

            if (!base64Data) {
                showAlert("No image data found!", "error");
                return;
            }

            return base64Data; // Return Base64 so the button can use it
        } catch (error) {
            showAlert("Error downloading image: " + error.message, "error");
        }
    }
};
