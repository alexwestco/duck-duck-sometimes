document.addEventListener('DOMContentLoaded', function() {
    
	var percentage_dropdown = document.getElementById('percentage_dropdown');

    // Get the percentage
    chrome.storage.sync.get('percentage', function(data) {
        percentage_dropdown.value = data.percentage
    });

    // Set onChange for the dropdown with the percentages
    percentage_dropdown.addEventListener('change', function() {
        
        // Update intensity value
        chrome.storage.sync.set({ percentage: percentage_dropdown.value });

    });

});