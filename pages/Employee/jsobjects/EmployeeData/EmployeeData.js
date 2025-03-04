export default {
	currentPage: 1,
	pageSize: 10,
	selectedFilters: {
		department: ""
	},
	
	// Initialize the data when the page loads
	onPageLoad: function() {
		this.fetchEmployees();
		this.fetchDepartments();
	},
	
	// Function to reset filters
	resetFilters: function() {
		this.selectedFilters = {
			department: ""
		};
		this.fetchEmployees(); // Refetch data without filters
	},
	
	// Function to apply department filter
	applyDepartmentFilter: function(department) {
		this.selectedFilters.department = department;
		this.fetchEmployees(); // Refetch with filter applied
	},

	// Function to calculate the range for pagination
	getRange: function() {
		let start = (this.currentPage - 1) * this.pageSize;
		let end = start + this.pageSize - 1;
		return `${start}-${end}`;
	},

	// Fetch employees from Supabase with filters and pagination
	fetchEmployees: async function() {
		const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dHJvc21rY2lwZ2JndXV2cGNqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDM4MTE3OSwiZXhwIjoyMDU1OTU3MTc5fQ.4Dj0-EfrpOpu2Bp8Q7GXsT2dWMCop3l9pv48bqBfLuo";
		const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dHJvc21rY2lwZ2JndXV2cGNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODExNzksImV4cCI6MjA1NTk1NzE3OX0.oDXFbH016Vst-RXtt_uCs9KGtAITW4rQZHoICWWA9t4";

		const rangeHeader = this.getRange();
		
		// Start building the query URL
		let apiUrl = `https://mwtrosmkcipgbguuvpcj.supabase.co/rest/v1/employee?select=id,first_name,last_name,email,department,designation_role,employee_status`;
		
		// Add filters if they exist
		if (this.selectedFilters.department) {
			apiUrl += `&department=eq.${encodeURIComponent(this.selectedFilters.department)}`;
		}

		// Fetch data with the pagination range and filters
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

			// Set the total count of records
			const totalRecords = response.headers.get('X-Total-Count');
			if (totalRecords) {
				// Update table widget with total records for pagination
				EmployeeTable.setTotalRecords(totalRecords);
			}

			return data;
		} else {
			console.error("Error fetching employee data:", response.status);
			return [];
		}
	},
	
	// Handle status toggle change
	updateEmployeeStatus: async function(employeeId, newStatus) {
		const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dHJvc21rY2lwZ2JndXV2cGNqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDM4MTE3OSwiZXhwIjoyMDU1OTU3MTc5fQ.4Dj0-EfrpOpu2Bp8Q7GXsT2dWMCop3l9pv48bqBfLuo";
		const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dHJvc21rY2lwZ2JndXV2cGNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODExNzksImV4cCI6MjA1NTk1NzE3OX0.oDXFbH016Vst-RXtt_uCs9KGtAITW4rQZHoICWWA9t4";

		// Update employee status in Supabase
		const updateUrl = `https://mwtrosmkcipgbguuvpcj.supabase.co/rest/v1/employee?id=eq.${employeeId}`;
		
		const response = await fetch(updateUrl, {
			method: 'PATCH',
			headers: {
				'Authorization': token,
				'apikey': key,
				'Content-Type': 'application/json',
				'Prefer': 'return=minimal'
			},
			body: JSON.stringify({
				employee_status: newStatus
			})
		});

		if (response.ok) {
			// Refresh the data after update
			this.fetchEmployees();
			showAlert("Employee status updated successfully!", "success");
		} else {
			console.error("Error updating employee status:", response.status);
			showAlert("Failed to update employee status", "error");
		}
	},

	// Handle page change
	onPageChange: async function(pageNumber) {
		this.currentPage = pageNumber;
		
		// Clear previous data
		EmployeeTable.setData([]);
		
		// Fetch new data for the page
		const data = await this.fetchEmployees();
		EmployeeTable.setData(data);
	},

	// Handle page size change
	onPageSizeChange: async function(pageSize) {
		this.pageSize = pageSize;
		
		// Clear previous data
		EmployeeTable.setData([]);
		
		// Fetch new data with updated page size
		const data = await this.fetchEmployees();
		EmployeeTable.setData(data);
	},
	
	// Get unique departments for filter dropdown
	fetchDepartments: async function() {
		const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dHJvc21rY2lwZ2JndXV2cGNqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDM4MTE3OSwiZXhwIjoyMDU1OTU3MTc5fQ.4Dj0-EfrpOpu2Bp8Q7GXsT2dWMCop3l9pv48bqBfLuo";
		const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dHJvc21rY2lwZ2JndXV2cGNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODExNzksImV4cCI6MjA1NTk1NzE3OX0.oDXFbH016Vst-RXtt_uCs9KGtAITW4rQZHoICWWA9t4";

		// Query to get distinct departments
		const apiUrl = `https://mwtrosmkcipgbguuvpcj.supabase.co/rest/v1/employee?select=department&not.department=is.null`;
		
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'Authorization': token,
				'apikey': key,
				'Content-Type': 'application/json',
			}
		});

		if (response.ok) {
			const data = await response.json();
			
			// Extract unique departments and format for dropdown
			const departments = [...new Set(data.map(item => item.department))];
			return departments.map(dept => ({
				label: dept,
				value: dept
			}));
		} else {
			console.error("Error fetching departments:", response.status);
			return [];
		}
	}
};