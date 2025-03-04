export default {
  currentPage: 1,
  pageSize: 10,

  // Function to calculate the range for pagination
  getRange: function() {
    let start = (this.currentPage - 1) * this.pageSize;
    let end = start + this.pageSize - 1;
    return `${start}-${end}`;
  },

  // Fetch data from the Supabase API with the calculated range
  fetchData: async function() {
    const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dHJvc21rY2lwZ2JndXV2cGNqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDM4MTE3OSwiZXhwIjoyMDU1OTU3MTc5fQ.4Dj0-EfrpOpu2Bp8Q7GXsT2dWMCop3l9pv48bqBfLuo";
    const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dHJvc21rY2lwZ2JndXV2cGNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODExNzksImV4cCI6MjA1NTk1NzE3OX0.oDXFbH016Vst-RXtt_uCs9KGtAITW4rQZHoICWWA9t4";

    const rangeHeader = this.getRange();
    const apiUrl = `https://mwtrosmkcipgbguuvpcj.supabase.co/rest/v1/sample?select=*`;

    // Fetch data with the pagination range
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'apikey': key,
        'Range': rangeHeader,
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();

      // Set the total number of records
      const totalRecords = response.headers.get('X-Total-Count'); // Correct way to access headers
      if (totalRecords) {
        // Ensure that `setTotalRecords` is available for the `Display_data` widget
        Display_data.setTotalRecords(totalRecords);  // Update total records in pagination
      }

      return data;
    } else {
      console.error("Error fetching data:", response.status);
      return [];
    }
  },

  // Handle page change event
  onPageChange: async function(pageNumber) {
    this.currentPage = pageNumber;
    
    // Clear the previous data before setting new data
    Display_data.setData([]);

    // Fetch new data and set it
    const data = await this.fetchData();
    Display_data.setData(data);
  },

  // Handle page size change event
  onPageSizeChange: async function(pageSize) {
    this.pageSize = pageSize;
    
    // Clear the previous data before setting new data
    Display_data.setData([]);

    // Fetch new data with the updated page size
    const data = await this.fetchData();
    Display_data.setData(data);
  }
};
