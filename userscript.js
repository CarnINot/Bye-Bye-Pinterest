// ==UserScript==
// @name        Bye Bye Pinterest
// @match       *://www.google.com/*
// @match       *://www.ecosia.org/*
// @match       *://duckduckgo.com/*
// @match       *://html.duckduckgo.com/*
// @match       *://yandex.com/*
// @match       *://search.yahoo.com/*

// @grant       none
// @version     0.1
// @author      Carn
// @description Hides Pinterest from search and Image results
// @downloadURL https://bye-bye-pinterest.cool-website.xyz/userscript.js
// @homepageURL https://bye-bye-pinterest.cool-website.xyz
// ==/UserScript==




/* This is some of the ugliest code I have ever written. I feel sorry anyone who has to read this.
 */
// if you add a string to the array here, it blocks it if the hostnames are exact matches, otherwises it tests the host name against the regex to see if it should block it
const hiddenWebsites = [/.*\.pinterest\..*/,/pinterest\..*/];


const domain = unsafeWindow.location.hostname;

function isBannedHostname(hostname){
    return hiddenWebsites.some(hiddenWebsite => {
  	console.log(hiddenWebsite);
// if you put a string here, it blocks it if the hostnames are exact matches, otherwises it tests the host name against the regex
	return (typeof(hiddenWebsite) == "string" ? hostname == hiddenWebsite : hiddenWebsite.test(hostname))});
}


// takes in the class name of an element containing a URL, a function to extract the URL string from that element, and the
// class name of the element next
function genericRemove(urlTextEl,  urlgetter, containerName){
        Array.from(document.getElementsByClassName(urlTextEl)).forEach((el)=>
	    {
		//exctract url from element

	    	let url = urlgetter(el);
		console.log(url);

		hidden = isBannedHostname((new URL(url)).hostname);
	    if (hidden){
		let ancestorElement = el.parentNode;
		while (ancestorElement) {
		    console.log(ancestorElement);

		    if (ancestorElement.classList.contains(containerName)){
			console.log(ancestorElement);

			ancestorElement.style.display = "none";
			console.log("removed: " + url);
			break;
		    }

		    ancestorElement = ancestorElement.parentNode;
		}
	    }
	else{
	    console.log("didn't remove: " + url);

	}
	});
}

switch (domain){
case 'html.duckduckgo.com':
    genericRemove('result__url', (a) => {return 'http://' + a.textContent.trim()},'web-result');
    genericRemove('results__url', (a) => {return 'http://' + a.textContent.trim()},'web-results');

    break;
case 'duckduckgo.com':
    // I hate react and the terrible way it names classes
    // Select the target node
var targetNode = document.querySelector('#links');
// Create a new instance of the MutationObserver with a callback function
var observer = new MutationObserver(function(mutationsList, observer) {
    genericRemove('Wo6ZAEmESLNUuWBkbMxx', (a) => {return (a.textContent.startsWith('https://') ? a.textContent.trim() : "https://" + a.textContent.trim());}, 'nrn-react-div');
    genericRemove('tile--img__domain',(a) => {return a.title} ,'tile');
    console.log('Content of the div changed');
});

    // Start observing the target node for configured mutations
    observer.observe( document.body, { subtree: true,childList: true });
    break;
case 'www.google.com':
    console.log("google detected");

    genericRemove('VFACy', (a) => {return a.href}, 'isv-r');

    //no js version
    genericRemove('UPmit', (a) => {return 'http://' + (a.innerText.split('›')[0]).trim()}, 'Gx5Zad');
        // Select the target node
// Create a new instance of the MutationObserver with a callback function
    var observer = new MutationObserver(function(mutationsList, observer) {
	    genericRemove('VFACy', (a) => {return a.href}, 'isv-r');

    genericRemove('tjvcx', (a) => {return a.firstChild.data.trim()}, 'g');
    console.log('Content of the div changed');
});

    // Start observing the target node for configured mutations
	observer.observe(document.body, { subtree: true,childList: true });
    break;
//images don't work for yahoo
case "search.yahoo.com":
    genericRemove('p-abs',(el) => {return "https://" + el.innerText.split("›")[0].trim();},'dd');
    break;
// Baidu is explicitly not supported
//case "www.baidu.com":
    //    genericRemove
//Neither is bing
    //case "bing.com":


//images don't work for yandex
case "yandex.com":
case "yandex.eu":
// for the next two, I'm just assuming it works
case "ya.ru":
case "yandex.ru":
    genericRemove('Path-Item',(el) => {return "https://" + el.innerText.split("›")[0].trim();},'serp-item');

    var observer = new MutationObserver(function(mutationsList, observer) {
	genericRemove('Path-Item',(el) => {return "https://" + el.innerText.split("›")[0].trim();},'serp-item');

    });

    if (document.querySelector('main__center'))
	observer.observe(document.querySelector('.main__center'), {subtree: true,childList: true});

    break;
case "www.ecosia.org":
    genericRemove('source__content--domain', (el) => {return  el.innerText.trim()},'result__body');
    genericRemove('image-result__details-source',(el) => {return "https://" + + el.innerText.trim();},'image-result');

    var observer = new MutationObserver(function(mutationsList, observer) {
	genericRemove('image-result__details-source',(el) => { return "https://" + el.innerText.trim();},'image-result');
    });

    if (document.querySelector('.image-feed'))
	observer.observe(document.querySelector('.image-feed'), {subtree: true,childList: true});
    break;




default:
    break;
}


