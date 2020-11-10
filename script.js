const resultsNav = document.getElementById('resultsNav');
const favouritesNav = document.getElementById('favouritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

//NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;


let resultsArray = [];
let favourites = {};

function showContent(page) {
    window.scrollTo({ top:0, behavior: 'instant'});
    console.log(page);
    if(page === 'results') {
        resultsNav.classList.remove('hidden');
        favouritesNav.classList.add('hidden');
    } else {
        resultsNav.classList.add('hidden');
        favouritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}

function createDOMNodes(page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favourites);
    console.log(page);
    currentArray.forEach(result => {
        //Card Container 
        const card = document.createElement('div');
        card.classList.add('card');
        // Link 
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        //Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        //Card Body 
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        //Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.innerText = result.title;
        // Save text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if(page === 'results') {
            saveText.innerText = 'Add to Favourites';
            saveText.setAttribute('onclick',  `saveFavourite('${result.url}')`);
        }else {
            saveText.innerText = 'Remove Favourites';
            saveText.setAttribute('onclick',  `removeFavourite('${result.url}')`) ;
        }
        //Card Text
        const cardText = document.createElement('p');
        cardText.innerText = result.explanation;
        //Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // Date 
        const date = document.createElement('strong');
        date.textContent = result.date;
        // Copyright 
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`; 
        //Append
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    });
}

function updateDOM(page) {
    //Get Favurites from Local Storage
    if(localStorage.getItem('nasaFavourites')) {
        favourites = JSON.parse(localStorage.getItem('nasaFavourites'));
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent(page);
}   

// get 10 images from NASA api
async function getNASAPictures() {
    //Show Loader
    loader.classList.remove('hidden');
    try {
        const respponse = await fetch(apiURL);
        resultsArray = await respponse.json();
        updateDOM('results');
    } catch (error) {
        //Catch error here
    }
}

// Add result to Favourite
function saveFavourite(itemUrl) {
   //Loop through resultsArray to fnnd Favourite
   resultsArray.forEach(item => {
    if(item.url.includes(itemUrl) && !favourites[itemUrl]) {
        favourites[itemUrl] = item;
        // Show save confirmation for 2 seconds
        saveConfirmed.hidden = false;
        setTimeout(() => {
            saveConfirmed.hidden = true;
        }, 2000);
        //Set Favourites in local storage
        localStorage.setItem('nasaFavourites', JSON.stringify(favourites));
    }

   });
}

// Remove items from favourties
function removeFavourite(itemUrl) {
    if(favourites[itemUrl]){
        delete favourites[itemUrl];
        //Set Favourites in local storage
        localStorage.setItem('nasaFavourites', JSON.stringify(favourites));
        updateDOM('favourites');
    }
}

getNASAPictures();