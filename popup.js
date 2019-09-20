document.addEventListener('DOMContentLoaded', function() {

	var percentage_dropdown = document.getElementById('percentage_dropdown');

    // Get the percentage
    chrome.storage.sync.get('percentage', function(data) {
        percentage_dropdown.value = data.percentage;
    });

    // Set onChange for the dropdown with the percentages
    percentage_dropdown.addEventListener('change', function() {

        // Update intensity value
        chrome.storage.sync.set({ percentage: percentage_dropdown.value });

    });


    var ddg_keywords_elm = document.getElementById('ddg_keywords');

      // Get the keywords
      chrome.storage.sync.get('keywords', function(data) {
          ddg_keywords_elm.value = data.keywords || '';
      });

      // Update stored keywords on change event
      ddg_keywords_elm.addEventListener('change', function() {

          // Update keywords value
          chrome.storage.sync.set({ keywords: ddg_keywords_elm.value });

      });

});
