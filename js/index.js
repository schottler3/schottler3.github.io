var snowAmount = 30;
let currentSnow = 'snowing';
var snows = [];

window.onload = function() {
  for(let i = 0; i < snowAmount; i++) {
    spawnSnow();
  }

  let snowDiv = document.getElementById('snows');
  snowDiv.addEventListener('mouseover', function() {
    let snowButtons = document.getElementsByClassName('snowButton');
    for(let i = 0; i < snowButtons.length; i++) {
      snowButtons[i].style.visibility = 'visible';
    }
  });

  snowDiv.addEventListener('mouseout', function() {
    let snowButtons = document.getElementsByClassName('snowButton');
    for(let i = 0; i < snowButtons.length; i++) {
      snowButtons[i].style.visibility = 'hidden';
    }
  });

  let snowButtons = document.getElementsByClassName('snowButton');
  for(let i = 0; i < snowButtons.length; i++) {
    snowButtons[i].addEventListener('mouseover', function(event) {
      if(event.target.id == currentSnow){
        event.target.style.backgroundColor = 'rgb(158, 239, 229)';
      }
      else{
        event.target.style.backgroundColor = 'rgb(192, 224, 222)';
      }
    });
    snowButtons[i].addEventListener('mouseout', function(event) {
      if(event.target.id == currentSnow){
        event.target.style.backgroundColor = 'rgb(158, 239, 229)';
      }
      else{
        event.target.style.backgroundColor = 'rgb(60, 71, 75)';
      }
    });
    snowButtons[i].addEventListener('click', function() {
      snowButtonClick(snowButtons[i]);
    });
  }
  snows = document.getElementsByClassName('snow');
  update();
}

function spawnSnow(){
  let snow = document.createElement('img');
  snow.className = 'snow';
  snow.id = 'snow' + snows.length;

  snow.style.position = 'absolute';

  snow.addEventListener('click', function() {
    clickSnow(snow);
  });
  rollSnow(snow);

  document.getElementById('snowSec').appendChild(snow);
}

function rollSnow(snow) {
  snow.src = 'img/snowflake.png';
  snow.style.width = Math.random() * 8 + 15 + 'px';
  snow.style.height = snow.style.width;
  let newX = Math.random() * window.innerWidth;
  snow.dataset.speedX = Math.random()/6 + .1;
  snow.dataset.speedY = Math.random()/8 + .05;
  snow.style.opacity = 1;
  snow.dataset.rotation = 0;
  snow.dataset.rain = false;
  snow.style.transform = `translate(${newX}px, -${snow.width}px)`;
}

function clickSnow(snow) {
  snow.dataset.speedX = .5;
  snow.dataset.speedY *= 20;
  snow.dataset.rotation = 10;
  snow.dataset.rain = 'true';
  snow.src = 'img/rain.png';

  let water = document.getElementsByClassName('water')[0];
  if (!water.dataset.height) {
    water.dataset.height = 5;
  }
  water.dataset.height = parseFloat(water.dataset.height) + 0.5;
  water.style.height = water.dataset.height + '%';
}

function snowButtonClick(snowButton) {
  let id = snowButton.id;
  if(currentSnow == id){
    return;
  }
  document.getElementById(currentSnow).style.backgroundColor = 'rgb(60, 71, 75)';
  if(id == 'clear'){
    currentSnow = 'clear';
    for(let i = snows.length - 1; i >= 0; i--) {
      snows[i].style.display = 'none';
    }
    snowAmount = 0;
  }
  else if(id == 'flurry'){
    currentSnow = 'flurry';
    if(snowAmount < 15){
      for(let i = snowAmount; i < 15; i++) {
        spawnSnow();
      }
    }
    else{
      for(let i = snows.length - 1; i >= 15; i--) {
        snows[i].style.display = 'none';
      }
    }
    snowAmount = 15;
  }
  else if (id == 'snowing'){
    currentSnow = 'snowing';
    if(snowAmount < 50){
      for(let i = snowAmount; i < 50; i++) {
        spawnSnow();
      }   
    }
    else{
      for(let i = snows.length - 1; i >= 50; i--) {
        snows[i].style.display = 'none';
      }
    }
    snowAmount = 50;
  }
  else if (id == 'blizzard'){
    currentSnow = 'blizzard';
    if(snowAmount < 100){
      for(let i = snowAmount; i < 100; i++) {
        spawnSnow();
      }
      snowAmount = 100;
      snows.length = 100;
    }
  }
  document.getElementById(currentSnow).style.backgroundColor = 'rgb(158, 239, 229)';
  snows = document.getElementsByClassName('snow');
  console.log(snows.length);
}

function update() {
  for(let i = 0; i < snows.length; i++) {
    let snowFlake = snows[i];
    if(snowFlake.style.display == 'none'){
      snowFlake.remove();
      continue;
    }
    else if(snowFlake.getBoundingClientRect().bottom > document.getElementById('snows').getBoundingClientRect().height){
      snowFlake.style.opacity = (parseFloat(snowFlake.style.opacity) - .001).toString();
      if(parseFloat(snowFlake.style.opacity) <= 0){
        rollSnow(snowFlake);
        continue;
      }
    }

    let transformValues = getComputedStyle(snowFlake).getPropertyValue('transform');
    let matrix = new DOMMatrix(transformValues);
    let currentTop = matrix.m42;
    let currentLeft = matrix.m41;
    let speedX = parseFloat(snowFlake.dataset.speedX);
    let speedY = parseFloat(snowFlake.dataset.speedY);

    if(snowFlake.dataset.rain === 'true'){
      snowFlake.style.transform = `translate(${currentLeft - speedX}px, ${currentTop + speedY}px) rotate(${parseFloat(snowFlake.dataset.rotation) + speedX}deg)`;
    }
    else{
      let currentRotation = parseFloat(snowFlake.dataset.rotation);
      snowFlake.style.transform = `translate(${currentLeft - speedX}px, ${currentTop + speedY}px) rotate(${currentRotation}deg)`;
      snowFlake.dataset.rotation = currentRotation + speedX;
    }
  }
  requestAnimationFrame(update);
}