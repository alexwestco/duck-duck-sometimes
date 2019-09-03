chrome.runtime.onInstalled.addListener(function(details){
    
    if(details.reason == "install"){	
    	// Set default percentage to 20%
        chrome.storage.sync.set({ percentage: 0.2 });
    }

});