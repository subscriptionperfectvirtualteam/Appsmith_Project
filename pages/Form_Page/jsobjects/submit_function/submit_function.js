export default {
  async generateFileName() {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 15);
    const uniqueFileName = `${timestamp}_${randomString}.json`;
    storeValue('uniqueFileName', uniqueFileName); // Store the unique file name
    return uniqueFileName;
  },

  async submit_function() {
    const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dHJvc21rY2lwZ2JndXV2cGNqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDM4MTE3OSwiZXhwIjoyMDU1OTU3MTc5fQ.4Dj0-EfrpOpu2Bp8Q7GXsT2dWMCop3l9pv48bqBfLuo";
    const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dHJvc21rY2lwZ2JndXV2cGNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODExNzksImV4cCI6MjA1NTk1NzE3OX0.oDXFbH016Vst-RXtt_uCs9KGtAITW4rQZHoICWWA9t4";

    let uniqueFileName = await this.generateFileName();

    // Check if the file is selected
    if (filepicker.files[0]) {
      const file = filepicker.files[0];
      console.log("Selected file:", file);

      // Prepare file metadata
      const fileMetadata = {
        fileName: file.name,
        fileType: file.type,
        fileData: file.data,
        fileDataType: file.dataFormat
      };

      // First API call to upload the file to Supabase Bucket
      const uploadUrl = `https://mwtrosmkcipgbguuvpcj.supabase.co/storage/v1/object/app_data/${uniqueFileName}`;
      const headers = {
        'Authorization': token,
        'apikey': key,
        'Content-Type': 'application/json',
      };

      const api_response = await fetch(uploadUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(fileMetadata),
      });

      if (!api_response.ok) {
        console.error("Error during file upload", api_response.status, await api_response.text());
        return; // Stop further execution if file upload fails
      }

      // Now use the generated file name (uniqueFileName) to construct the image URL
      const imageUrl = `https://mwtrosmkcipgbguuvpcj.supabase.co/storage/v1/object/app_data/${uniqueFileName}`;

      // Fetch the last inserted ID
      const fetchLastIdUrl = 'https://mwtrosmkcipgbguuvpcj.supabase.co/rest/v1/sample?select=id&order=id.desc&limit=1';
      const fetchHeaders = {
        'Authorization': token,
        'apikey': key,
        'Content-Type': 'application/json',
      };

      const lastIdResponse = await fetch(fetchLastIdUrl, {
        method: 'GET',
        headers: fetchHeaders,
      });

      if (!lastIdResponse.ok) {
        console.error("Error fetching last ID", lastIdResponse.status, await lastIdResponse.text());
        return;
      }

      const lastIdData = await lastIdResponse.json();
      const lastId = lastIdData[0] ? lastIdData[0].id : 28;  // Default to 28 if no previous records exist

      const newId = lastId + 1;

      // Now, store form data along with file name (image URL)
      const formData = {
        id: newId,  // Incremented ID
        sfname: firstNameInput.text,  // Replace with actual form input
        slname: lastNameInput.text,   // Replace with actual form input
        address: addressInput.text,   // Replace with actual form input
        image: imageUrl,  // Use the constructed image URL
      };

      // Send form data to your table via POST API
      const postUrl = 'https://mwtrosmkcipgbguuvpcj.supabase.co/rest/v1/sample';
      const postHeaders = {
        'apikey': key,
        'Authorization': token,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      };

      const postResponse = await fetch(postUrl, {
        method: 'POST',
        headers: postHeaders,
        body: JSON.stringify(formData),
      });

      if (!postResponse.ok) {
        console.error("Error during form data upload", postResponse.status, await postResponse.text());
        return;
      }

      const postData = await postResponse.json();

      console.log("Form data uploaded successfully", postData);
    } else {
      console.error("Error: File selection failed.");
    }
  }
};
