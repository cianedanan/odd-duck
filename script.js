
//Selects all images
let image1 = document.querySelector('div img:first-child');
let image2 = document.querySelector('div img:nth-child(2)');
let image3 = document.querySelector('div img:nth-child(3)');

let viewResult = document.getElementById('button-box');

//Declares global variables
let totalClicks = 0;
let maxClicksAllowed = 25;
let itemNames = [];
let itemLikes =[];
let itemViews = [];
let lastImg = [];

//Creates a contructor
function Item(name, img) {
  this.name = name;
  this.img = img;
  this.imgCount = 0;
  this.clicks = 0;
  this.totalLikes = 0;
  Item.allItems.push(this);
}

Item.allItems = [];

//Returns a random number for the lenth of Item.allItems array
function getRandomNumber() {
  return Math.floor(Math.random() * Item.allItems.length);
}

//Takes a string and capitalizes the first letter
function capitalize(str){
  let cap = str.split('');
  cap[0] = cap[0].toUpperCase();
  cap = cap.join('');
  return cap;
}

//Renders three random images that aren't identical to eachother or the last rendered images while tracking the amount of times an image was viewed
function renderItems() {

  let item1 = getRandomNumber();
  let item2 = getRandomNumber();
  let item3 = getRandomNumber();

  while(item1 === lastImg[0] || item1 === lastImg[1] || item1 === lastImg[2]){
    item1 = getRandomNumber();
  }
  while (item1 === item2 || item2 === lastImg[0] || item2 === lastImg[1] || item2 === lastImg[2] ) {
    item2 = getRandomNumber();
  }
  while (item1 === item3 || item2 === item3 || item3 === lastImg[0] || item3 === lastImg[1] || item3 === lastImg[2] ) {
    item3 = getRandomNumber();
  }

  lastImg[0] = item1;
  lastImg[1] = item2;
  lastImg[2] = item3;

  image1.src = Item.allItems[item1].img;
  image2.src = Item.allItems[item2].img;
  image3.src = Item.allItems[item3].img;
  image1.alt = Item.allItems[item1].name;
  image2.alt = Item.allItems[item2].name;
  image3.alt = Item.allItems[item3].name;

  Item.allItems[item1].imgCount++;
  Item.allItems[item2].imgCount++;
  Item.allItems[item3].imgCount++;
}

//Keeps track of total amount of clicks and amount of clicks per image.
//If the max amount of clicks are reached, the 3 images will no longer be clickable, a button for loading the chart is rendered, the data is stored into local storage and the arrays for the chart data are filled.
//If the max amount of clicks aren't reached renderItems is ran again.
function itemClick(event) {
  totalClicks++;
  let clickItem = event.target.alt;
  for (let i = 0; i < Item.allItems.length; i++) {
    if (clickItem === Item.allItems[i].name) {
      Item.allItems[i].clicks++;
      break;
    }
  }
  if (totalClicks === maxClicksAllowed) {
    image1.removeEventListener('click', itemClick);
    image2.removeEventListener('click', itemClick);
    image3.removeEventListener('click', itemClick);
    createButton();
    renderChart();
    let toStore = Item.allItems;
    localStorage.setItem('toStore', JSON.stringify(toStore));
  } else {
    renderItems();
  }
}

//Pushes the names, likes and views into seperate global arrays
function renderChart() {
  for(let i = 0; i < Item.allItems.length; i++){
    itemNames.push(capitalize(Item.allItems[i].name));
    itemLikes.push(Item.allItems[i].clicks);
    itemViews.push(Item.allItems[i].imgCount);
  }
}

//Creates a button using DOM that when pushed displays the chart
function createButton(){
  let but = document.createElement('button');
  let butText = document.createTextNode('View results');
  but.appendChild(butText);
  viewResult.appendChild(but);
  const att = document.createAttribute('onclick');
  att.value = 'displayChart()';
  document.getElementsByTagName('button')[0].setAttributeNode(att);
}

//Displays the chart when called
function displayChart(){
  const myChart = new Chart(canvasChart, config);
}

//Loads the chart with data from the global arrays
const data = {
  labels: itemNames,
  datasets: [{
    label: 'Likes',
    data: itemLikes,
    backgroundColor: ['rgba(0, 0, 255, 0.2)'],
    borderColor: ['rgb(0, 0, 255)'],
    borderWidth: 3
  },
  {
    label: 'Views',
    data: itemViews,
    backgroundColor: ['rgba(255, 165, 0, 0.2)'],
    borderColor: ['rgb(255, 165, 0)'],
    borderWidth: 3
  }]
};

const config = {
  type: 'bar',
  data: data,
  options: {
    maintainAspectRatio: false,
  },
};
let canvasChart = document.getElementById('myChart');

//Creates new objects using the Item contructor function
new Item('bag', 'img/bag.jpg');
new Item('banana', 'img/banana.jpg');
new Item('bathroom', 'img/bathroom.jpg');
new Item('boots', 'img/boots.jpg');
new Item('breakfast', 'img/breakfast.jpg');
new Item('bubblegum','img/bubblegum.jpg');
new Item('chair','img/chair.jpg');
new Item('cthulhu','img/cthulhu.jpg');
new Item('dog-duck', 'img/dog-duck.jpg');
new Item('dragon', 'img/dragon.jpg');
new Item('pen', 'img/pen.jpg');
new Item('pet-sweep', 'img/pet-sweep.jpg');
new Item('sissors','img/scissors.jpg');
new Item('shark','img/shark.jpg');
new Item('sweep','img/sweep.png');
new Item('tauntaun','img/tauntaun.jpg');
new Item('unicorn','img/unicorn.jpg');
new Item('water-can','img/water-can.jpg');
new Item('wine-glass','img/wine-glass.jpg');

renderItems();

//Runs itemClick whenever image 1, 2, or 3 are clicked
image1.addEventListener('click', itemClick);
image2.addEventListener('click', itemClick);
image3.addEventListener('click', itemClick);

//Gets the data from local storage
let maybeStored = localStorage.getItem('toStore');
if (maybeStored) {
  console.log(maybeStored);
  Item.allItems = JSON.parse(maybeStored);
}
