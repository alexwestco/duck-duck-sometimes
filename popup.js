document.addEventListener('DOMContentLoaded', function() {
	chrome.storage.sync.get('verified', function(data) {
	    if(data.verified == 'true'){
	        document.getElementById('verified').style.display = 'block'
	        document.getElementById('not_verified').style.display = 'none'

            // If there is no value for 'flash_sensitivity', initialize it to high
            chrome.storage.sync.get('flash_sensitivity', function(data) {
                //chrome.extension.getBackgroundPage().console.log(data.flash_sensitivity)

                var flash_detection_sensitivity_slider = document.getElementById('flash-detection-slider-input');
                if(data.flash_sensitivity == undefined){
                    chrome.storage.sync.set({ flash_sensitivity: 3 });
                    flash_detection_sensitivity_slider.value = data.flash_sensitivity
                }else{
                    flash_detection_sensitivity_slider.value = data.flash_sensitivity
                }

            });

            // If there is no value for 'blue_light_filter_intensity', initialize it to low
            chrome.storage.sync.get('blue_light_filter_intensity', function(data) {
                //chrome.extension.getBackgroundPage().console.log(data.blue_light_filter_intensity)

                var blue_light_filter_intensity_slider = document.getElementById('blue-filter-slider-input');
                if(data.blue_light_filter_intensity == undefined){
                    chrome.storage.sync.set({ blue_light_filter_intensity: 0 });
                    blue_light_filter_intensity_slider.value = data.blue_light_filter_intensity
                }else{
                    blue_light_filter_intensity_slider.value = data.blue_light_filter_intensity
                }

            });

            // If there is no value for 'reminders_cycle', initialize it to low
            chrome.storage.sync.get('reminders_period', function(data) {
                //chrome.extension.getBackgroundPage().console.log(data.reminders-slider-input)

                var reminders_period_slider = document.getElementById('reminders-slider-input');
                if(data.reminders_period == undefined){
                    chrome.storage.sync.set({ reminders_period: 0 });
                    reminders_period_slider.value = 0
                }else{
                    reminders_period_slider.value = data.reminders_period
                }

            });

            // Show the correct enable or disable text link
            chrome.tabs.query({active : true, currentWindow: true}, function (tabs) {
                
                var tab = (tabs.length === 0 ? tabs : tabs[0]);
                var activeTabUrl = tab.url;

                // Check if domain is already banned, if it is, unban it
                domain = tab.url.toString().replace('http://','').replace('https://','').split(/[/?#]/)[0];

                // If website is banned, show 'Enable filter for this website'
                chrome.storage.sync.get(domain, function(data) {
                    if(data[domain] == 1){
                        document.getElementById('enable-link').style.display = 'block'
                        document.getElementById('disable-link').style.display = 'none'
                    }else{
                        document.getElementById('enable-link').style.display = 'none'
                        document.getElementById('disable-link').style.display = 'block'
                    }
                    document.getElementById('enable-link').domain = domain
                    document.getElementById('disable-link').domain = domain
                });

            });

	    }else{
	    	document.getElementById('verified').style.display = 'none'
	        document.getElementById('not_verified').style.display = 'block'
	    }
	});

    // Update Safe GIFs on popup.html
    chrome.storage.sync.get('safe_gifs', function(data) {
        document.getElementById('safe_gifs').innerHTML = '<b>✅Safe GIFs: '+ data.safe_gifs + '</b>'
    });

    // Update Dangerous GIFs on popup.html
    chrome.storage.sync.get('dangerous_gifs', function(data) {
        document.getElementById('dangerous_gifs').innerHTML = '<b>⛔️Dangerous GIFs: '+ data.dangerous_gifs + '</b>'
    });

    // Update Total GIFs on popup.html
    chrome.storage.sync.get('total_gifs', function(data) {
        document.getElementById('total_gifs').innerHTML = '<b>💥Total GIFs analyzed: '+ data.total_gifs + '</b>'
    });

    // Set onClick for the code submit button
    var btn = document.getElementById('btn');
    btn.addEventListener('click', function() {
    	code = document.getElementById('code')
    	ctx = this
    	
        // Send a get request to our server to check if the code is valid
        var xhr = new XMLHttpRequest()
        xhr.open("GET", 'https://www.epilepsyblocker.com/verify_user_by_api_key?api_key='+code.value, true);
        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    json = JSON.parse(xhr.responseText)
                    //chrome.extension.getBackgroundPage().console.log(json)

                    if(json == true){
                        // Set verified value to true
                        chrome.storage.sync.set({ verified: 'true' });

                        // Set the api key
                        chrome.storage.sync.set({ api_key: code.value });

                        // Set GIF counters to zero
                        chrome.storage.sync.set({ safe_gifs: 0 });
                        chrome.storage.sync.set({ dangerous_gifs: 0 });
                        chrome.storage.sync.set({ total_gifs: 0 });

                        // Set flash sensitivity to high
                        chrome.storage.sync.set({ flash_sensitivity: 3 });

                        // Set blue light filter intensity to low
                        chrome.storage.sync.set({ blue_light_filter_intensity: 0 });

                        // Set reminder to off
                        chrome.storage.sync.set({ reminders_period: 0 });

                        window.close();
                    }else{
                    	window.close();
                    }
                } else {
                    //chrome.extension.getBackgroundPage().console.log(xhr.statusText);
                }
            }
        };
        xhr.onerror = function (e) {
            //chrome.extension.getBackgroundPage().console.log(xhr.statusText);
        };
        xhr.send();
        
    });

    // Set onChange for the blue filter slider
    var blue_light_filter_intensity_slider = document.getElementById('blue-filter-slider-input');
    blue_light_filter_intensity_slider.addEventListener('change', function() {
        
        // Update intensity value
        chrome.storage.sync.set({ blue_light_filter_intensity: blue_light_filter_intensity_slider.value });

    });

    /*
    // Set onChange for the flash detection slider
    var flash_detection_sensitivity_slider = document.getElementById('flash-detection-slider-input');
    flash_detection_sensitivity_slider.addEventListener('change', function() {

        // Update sensitivity value
        chrome.storage.sync.set({ flash_sensitivity: flash_detection_sensitivity_slider.value });

    });
    */

    // Set onChange for the reminder slider
    var reminder_slider = document.getElementById('reminders-slider-input');
    reminder_slider.addEventListener('change', function() {

        // Update reminders value
        chrome.storage.sync.set({ reminders_period: reminder_slider.value });

        // Send message to background script to create the alarm, we can't create it here
        chrome.runtime.sendMessage({
            msg: "alarm", 
            data: {
                interval: reminder_slider.value,
            }
        });

    });

    // Set onClick for enable button
    var enable_link = document.getElementById('enable-link');
    enable_link.addEventListener('click', function() {

        // Ban current website
        //chrome.extension.getBackgroundPage().console.log('Enable ' + enable_link.domain.toString())
        str = '{ "' + enable_link.domain.toString() + '": 0 }'
        s = JSON.parse(str)
        chrome.storage.sync.set(s);
        window.close();

    });

    // Set onClick for disable button
    var disable_link = document.getElementById('disable-link');
    disable_link.addEventListener('click', function() {

        // Ban current website
        //chrome.extension.getBackgroundPage().console.log('Disable ' + disable_link.domain.toString())
        str = '{ "' + enable_link.domain.toString() + '": 1 }'
        s = JSON.parse(str)
        chrome.storage.sync.set(s);
        window.close();

    });

});