// Variables
var selectedSection = 0;
var scrollTimeout;
var previousScroll = new Date();

// Animations
var next = {
    height: '100%'
}

var previous = {
    height:'0%'
}

function elementInViewport (el) {

    // Special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    );
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

function onExchangeRates(rawResponse) {
    var response = JSON.parse(rawResponse);

    var currencyCodes = Object.keys(response.rates);
    var exchangeRates = Object.values(response.rates);

    var htmlList = `<tr>
                        <th>Currecy Code</th>
                        <th>Exchange Rate (ZAR)</th>
                    </tr>`;
    for( var i = 30; i > 20; i--) {
        htmlList += `<tr>
                        <td>${currencyCodes[i]}</td>
                        <td>R ${(exchangeRates[i]).toFixed(2)}</td>
                    </tr>`;
    } 

    $('#myDIVexchangerate').html(htmlList);
}

function onWeather(rawResponse) {
    var response = JSON.parse(rawResponse);

    var weatherCodes = Object.keys(response.main);
    var weatherValues = Object.values(response.main);

    var htmlList = `<tr>
                        <th>Weather</th>
                        <th>Conditions</th>
                    </tr>`;
    for( var i = 0; i < weatherCodes.length; i++) {
        htmlList += `<tr>
                        <td>${weatherCodes[i]}</td>
                        <td>${(weatherValues[i]).toFixed(2)}</td>
                    </tr>`;
    } 

    $('#myDIVweather').html(htmlList);
}

function onSpaceX(rawResponse) {
    var response = JSON.parse(rawResponse);
    //var SpaceXValues = Object.values(response.details);

    var htmlList = `<tr>
                        <th>Latest Details of spaceX expeditions</th>
                    </tr>`;
        htmlList += `<tr>
                        <td>${response.details}</td>
                    </tr>`;
    
    console.log(rawResponse);
    $('#myDIVspaceX').html(htmlList);
}
//make hidden container
function myHiddenCurrency() {
    var y = document.getElementById("myDIVexchangerate");
    if (y.style.display === "none") {
      y.style.display = "block";
    } else {
      y.style.display = "none";
    }
  }

  function myHiddenWeather() {
    var y = document.getElementById("myDIVweather");
    if (y.style.display === "none") {
      y.style.display = "block";
    } else {
      y.style.display = "none";
    }
  }

  function myHiddenSpaceX() {
    var y = document.getElementById("myDIVspaceX");
    if (y.style.display === "none") {
      y.style.display = "block";
    } else {
      y.style.display = "none";
    }
  }

  //set scroll delay for nav-bar
function onScroll() {
    var currentScroll = new Date();

    if(currentScroll - previousScroll > 1000)
    {
        previousScroll = currentScroll;
        handleScroll();
    }
}

//check scroll element in in screen

function handleScroll() {
    if (elementInViewport($('#welcome')))
    {
        console.debug('Welcome? ', elementInViewport($('#welcome')));
        //$('.welcome-background').css({'opacity' : 1});
        handleAnimation(0);
        return;
    }

    if (elementInViewport($('#projects')))
    {
        console.debug('Projects? ', elementInViewport($('#projects')));
        handleAnimation(1);
        return;
    }

    if (elementInViewport($('#about')))
    {
        console.debug('About? ', elementInViewport($('#about')));
        handleAnimation(2);
        return;
    }
}

// Button Click Events
function onHideMinimap() {
    console.log('hide');
    $('#minimap').hide();
    $('#hide-button').hide();
    $('#show-button').show();
}

function onShowMinimap() {
    console.log('show');
    $('#minimap').show();
    $('#show-button').hide();
    $('#hide-button').show();
    
}

function handleAnimation(selection) {
    selectedSection = selection;
    switch(selectedSection) {
        case 0: // Welcome
        {
            $('#welcome-project-bar').animate(previous);
            $('#project-about-bar').animate(previous);
            break;
        }
        case 1: // Projects
        {
            $('#welcome-project-bar').animate(next);
            $('#project-about-bar').animate(previous);
            break;
        }
        case 2: // About
        {
            $('#welcome-project-bar').animate(next);
            $('#project-about-bar').animate(next);
            break;
        }
    }
}

function onWelcome() {
    handleAnimation(0);

    document.getElementById('welcome').scrollIntoView();
}

function onProjects() {
    handleAnimation(1);

    document.getElementById('projects').scrollIntoView();
}

function onAbout() {
    handleAnimation(2);

    $('#project-about-bar').animate(next);

    document.getElementById('about').scrollIntoView();
}

function onInit() {
    // Start async API calls
    httpGetAsync('https://api.exchangeratesapi.io/latest?base=ZAR', onExchangeRates);
    httpGetAsync('https://api.spacexdata.com/v4/launches/latest', onSpaceX);
    httpGetAsync('http://api.openweathermap.org/data/2.5/weather?q=johannesburg&appid=a0db0b7bf6b049dd55b5cc50ab2a1994&units=metric', onWeather);
}

onInit();