// This will only run when we are on a google search page

// Check if the page is the first results page, which means that the user just searched for something
current_results_page = document.getElementsByClassName('cur')[0].innerHTML.split('</span>')[1]
console.log(current_results_page)

if(current_results_page == '1'){
    // Get the query
    query = document.getElementsByClassName('gLFyf gsfi')[0].value
    console.log(query)

    // Redirect the user to Duck Duck Go
    var d = Math.random();
    console.log(d)
    if(d < 0.5){
        window.location = 'https://www.duckduckgo.com?q='+query
    }
}