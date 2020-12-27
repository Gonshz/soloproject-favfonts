//start value state
const resetState = {
    searchFont: "",
    TypeSomething: "Hello World",
    fontSize: "24px",
    listType: "list",
    loadIndex: 0,
    mode: "white",
    searching: false
}
var loadingState = resetState;

function loadingStateReset() {
    loadingState = resetState;
}

// get all fonts data from google fonts api and store in variable fontsData
const fontsData = [];
// const APIKey = "AIzaSyA8j6SJmPPFHXEXswmlu9aoD6LYJA3z70s";
const APIKey = "AIzaSyA8j6SJmPPFHXEXswmlu9aoD6LYJA3z70s";
// const apiUrl = "https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=" + APIKey;
const apiUrl = "//www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=" + APIKey;

fetch(apiUrl)
    .then(res => {
        return res.json();
    })
    .then(data => {
        for (let i=0; i<data.items.length; i++){
            var font = data.items[i];
            var url = font.files.regular;
            if(!url) continue; //if url is 404
            var newFont = new FontFace(font.family, "url(" + url + ")");
            document.fonts.add(newFont);
            fontsData.push(font.family);
            if(i==20) {
                loadMore(fontsData.slice(loadingState.loadIndex));
                loadingState.loadIndex += 20;
            }
        }
    })
    .catch(error => {
        console.log("error");
    })


//font display method. every load has 20 fonts.
function loadMore(data) {
    for (let i=0; i<20; i++) {
        displayFont(data[i]);
    }
}

const fontArea = document.querySelector(".fonts");
function displayFont(name) {
    let codeBlock = 
            `<div class='font-holder ${loadingState.listType == "full" ? "font-holder-change" : ""}'>
                <div class='font-header'>
                    <div class='title-area'>
                        <h3 class='title' style='font-family: ${name};'>${name}</h3>
                    </div>
                    <div class='plus-btn'><img src='./images/plus.svg' alt='plus button' /></div>
                </div>
                <p class='sample-text' style='font-size: ${loadingState.fontSize}; font-family: ${name};'>${loadingState.TypeSomething}</p>
            </div>`;
    fontArea.insertAdjacentHTML("beforeend", codeBlock);
}


//scroll check and load
window.addEventListener("scroll", scrollLoading, {passive: true});
const scrollDetection = function() {
    const mainContainer = document.querySelector("#main-container");
    return window.pageYOffset + window.innerHeight >= mainContainer.offsetHeight;
}
function scrollLoading() {
    if(scrollDetection()) {
        const loadingFonts = loadingState.searching ? searchingFonts : fontsData;
        loadMore(loadingFonts.slice(loadingState.loadIndex));
        loadingState.loadIndex += 20;
    }
};


//search font action
const searchFontBar = document.querySelector("#search-font");
let searchingFonts;
searchFontBar.addEventListener("keyup", searchFonts);
function searchFonts() {
    const inputText = searchFontBar.value.toLowerCase();
    loadingState.loadIndex = 0; //initialize loadIndex 
    loadingState.searching = inputText.length > 0 ? true : false;
    displaySearchedFonts(inputText);
}  
function displaySearchedFonts(inputText) {
    fontArea.innerHTML = "";
    searchingFonts = searchFontFromData(inputText);
    for (let i=0; i<=20; i++) {
        if(searchingFonts[i]==undefined) {
            break;
        } else {
            displayFont(searchingFonts[i]);
        }
    }
}
const searchFontFromData = function(text) {
    const result = [];
    fontsData.forEach(data => {
        if(data.toLowerCase().includes(text)) result.push(data);
    });
    return result;
}

//change pixel action
//show up pixels
const pixel = document.querySelector(".pixel-area");
const dropdown = document.querySelector(".dropdown");
pixel.addEventListener("click", showPixelSizes);
function showPixelSizes() {
    const isShowing = dropdown.style.display == "block";
    dropdown.style.display = isShowing ? "none" : "block";
}
//choose pixel size
const fontBtn = document.querySelector(".pixel-btn");
const fontSizes = document.querySelectorAll(".font-size");
const checkmarks = document.querySelectorAll(".checked");
fontSizes.forEach(fontSize => {
    if (fontSize.querySelector(".choose-size").innerHTML == loadingState.fontSize) {
        fontSize.querySelector(".checked").style.visibility = "visible";
    }
    fontSize.addEventListener("click", resizeFont);
});
function resizeFont() {
    const fontSize = this.querySelector("p").textContent;
    fontBtn.textContent = fontSize;
    //change checkmark
    checkmarks.forEach(checkmark => checkmark.style.visibility = "hidden");
    this.querySelector(".checked").style.visibility = "visible";
    //change text font sizes
    const sampleTexts = document.querySelectorAll(".sample-text");
    sampleTexts.forEach(sampleText => sampleText.style.fontSize = fontSize);
    loadingState.fontSize = fontSize;
}

//type something action
const typedSentence = document.querySelector("#typed-sentence");
typedSentence.addEventListener("keyup", sentenceChange);
function sentenceChange() {
    const sampleTexts = document.querySelectorAll(".sample-text");
    loadingState.TypeSomething = typedSentence.value.length > 0 ? typedSentence.value : "Hello World";
    sampleTexts.forEach(sampleText => sampleText.innerHTML = loadingState.TypeSomething);
}

//dark mode action
const body = document.querySelector("body");
const blackBtn = document.querySelector(".color-black");
const whiteBtn = document.querySelector(".color-white");
const resetIcon = document.querySelector("#reset-icon img");
const listIcon = document.querySelector("#list-icon img");
const backToTopIcon = document.querySelector("#back-to-top img");

blackBtn.addEventListener("click", darkMode);
whiteBtn.addEventListener("click", whiteMode);

function darkMode() {
    body.classList.add("dark-mode-body");
    resetIcon.classList.add("invert-color");
    listIcon.classList.add("invert-color");
    backToTopIcon.classList.add("invert-color");
    loadingState.mode = "dark";
}
function whiteMode() {
    body.classList.remove("dark-mode-body");
    resetIcon.classList.remove("invert-color");
    listIcon.classList.remove("invert-color");
    loadingState.mode = "white";
}

//list function
listIcon.addEventListener("click", listAction);
function listAction() {
    const fontHolders = document.querySelectorAll(".font-holder");
    if(loadingState.listType == "list"){
        listIcon.src = "./images/list2.svg";
        fontHolders.forEach(f => f.classList.add("font-holder-change"));
        loadingState.listType = "full";
    } else {
        listIcon.src = "./images/list1.svg";
        fontHolders.forEach(f => f.classList.remove("font-holder-change"));
        loadingState.listType = "list";
    }
}

//reset function
resetIcon.addEventListener("click", resetAction);
function resetAction() {
    loadingStateReset();
    loadMore(fontsData);
    loadingState.loadIndex += 20;
    whiteMode();
    searchFontBar.value = "";
    typedSentence.value = "";
    sentenceChange();
    displaySearchedFonts("");
    resizeFont.call(fontSizes[1]);
    loadingState.listType = "full";
    listAction();
}

//back to top action
backToTopIcon.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});
window.addEventListener("scroll", () => {
    backToTopIcon.style.display = window.scrollY > 1000 ? "block" : "none";
}, {passive: true});