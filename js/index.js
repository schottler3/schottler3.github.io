var snowAmount = 30;
let currentSnow = 'snowing';
var snows = [];

const snowflakeSpawnInterval = 60;
const snowOpacityChangeRate = .001;
const opacityVariance = .5;
var currentSnowFlakeSpawnIntervalTimer = 0;

window.onload = function ()
{
	let snowDiv = document.getElementById('snows');
	snowDiv.addEventListener('mouseover', function () 
	{
		let snowButtons = document.getElementsByClassName('snowButton');
		for (let i = 0; i < snowButtons.length; i++) 
			{
			snowButtons[i].style.visibility = 'visible';
		}
	});

	snowDiv.addEventListener('mouseout', function () 
	{
		let snowButtons = document.getElementsByClassName('snowButton');
		for (let i = 0; i < snowButtons.length; i++) 
			{
			snowButtons[i].style.visibility = 'hidden';
		}
	});

	let snowButtons = document.getElementsByClassName('snowButton');
	for (let i = 0; i < snowButtons.length; i++) 
		{
		snowButtons[i].addEventListener('mouseover', function (event) 
		{
			if (event.target.id == currentSnow) 
				{
				event.target.style.backgroundColor = 'rgb(158, 239, 229)';
			}
			else {
				event.target.style.backgroundColor = 'rgb(192, 224, 222)';
			}
		});
		snowButtons[i].addEventListener('mouseout', function (event) 
		{
			if (event.target.id == currentSnow) {
				event.target.style.backgroundColor = 'rgb(158, 239, 229)';
			}
			else {
				event.target.style.backgroundColor = 'rgb(60, 71, 75)';
			}
		});
		snowButtons[i].addEventListener('click', function () {
			snowButtonClick(snowButtons[i]);
		});
	}

	window.addEventListener('resize', onWindowResize, false);

    onWindowResize();

	snows = document.getElementsByClassName('snow');

	let water = document.getElementById('water');
	let footer = document.getElementById('footer');
	let footerTop = footer.getBoundingClientRect().top;
	water.style.top = `calc(${footerTop}px - 5%)`;

	update();
}

function onWindowResize() {
    let water = document.getElementById('water');
    let footer = document.getElementById('footer');
    let newHeight = footer.getBoundingClientRect().top - water.getBoundingClientRect().top;

    water.style.height = `${newHeight}px`;
}

function spawnSnow()
{
	if(Math.random() < .01)
	{
		let snow = document.createElement('img');
		snow.className = 'snow';
		snow.style.position = 'absolute';
	
		snow.addEventListener('click', function ()
		{
			clickSnow(snow);
		});
		rollSnow(snow);
	}
}

function rollSnow(snow)
{
	if (snows.length > snowAmount)
	{
		snow.remove();
		return;
	}

	snow.src = 'img/snowflake.png';
	snow.style.width = Math.random() * 8 + 15 + 'px';
	snow.style.height = snow.style.width;

	snow.style.opacity = 1;
	snow.opacityMultiplier = Math.random() * opacityVariance;

	snow.dataset.speedX = Math.random() / 6 + .1;
	snow.dataset.speedY = Math.random() / 8 + .05;
	
	snow.dataset.rotation = 0;
	snow.dataset.rain = false;

	document.getElementById('snows').appendChild(snow);

    let newX = Math.random() * window.innerWidth;
    let newY = document.getElementById('snows').getBoundingClientRect().top - snow.offsetHeight;

    snow.style.transform = `translate(${newX}px, -${newY}px)`;
}

function animeWater(snow) {
    let size = parseFloat(snow.style.width);
    let water = document.getElementById('water');

    let currentHeight = parseFloat(window.getComputedStyle(water).height);

    water.style.height = `${currentHeight + size}px`;

    let currentTop = parseFloat(window.getComputedStyle(water).top);
    water.style.top = `${currentTop - size}px`;
}

function checkWin() {
	let top = document.getElementById('top');
	let topBottom = top.getBoundingClientRect().bottom;

	let water = document.getElementById('water');
	let waterTop = water.getBoundingClientRect().top;

	return waterTop < topBottom;
}

function clickSnow(snow)
{
	snow.dataset.speedX = .5;
	snow.dataset.speedY *= 20;
	snow.dataset.rotation = 10;
	snow.dataset.rain = 'true';
	snow.src = 'img/rain.png';

	if(checkWin())
    	alert('Flooded!');
	else
		animeWater(snow);
}

function snowButtonClick(snowButton)
{
	let id = snowButton.id;
	if (currentSnow == id)
	{
		return;
	}
	document.getElementById(currentSnow).style.backgroundColor = 'rgb(60, 71, 75)';
	if (id == 'clear')
	{
		currentSnow = 'clear';
		snowAmount = 0;
	}
	else if (id == 'flurry')
	{
		currentSnow = 'flurry';
		snowAmount = 15;
	}
	else if (id == 'snowing')
	{
		currentSnow = 'snowing';
		snowAmount = 50;
	}
	else if (id == 'blizzard')
	{
		currentSnow = 'blizzard';
		snowAmount = 100;
	}
	document.getElementById(currentSnow).style.backgroundColor = 'rgb(158, 239, 229)';
}

function update()
{
	if(snows.length < snowAmount)
		spawnSnow();

	for(i = 0; i < snows.length; i++)
	{
		let snowflake = snows[i];
        if (isSnowflakeInView(snowflake)) {
            let newOpacity = parseFloat(snowflake.style.opacity) - (snowOpacityChangeRate * snowflake.opacityMultiplier);
            snowflake.style.opacity = newOpacity;

            if (newOpacity <= 0)
                rollSnow(snowflake);
			else 
                transformSnowflake(snowflake);
        }
		else
        	rollSnow(snowflake);
    }
	requestAnimationFrame(update);
}

const isSnowflakeInView = (snowflake) =>
{
	return snowflake.getBoundingClientRect().right > 0;
}

const transformSnowflake = (snowflake) =>
{
	let transformValues = getComputedStyle(snowflake).getPropertyValue('transform');
	let matrix = new DOMMatrix(transformValues);
	let currentTop = matrix.m42;
	let currentLeft = matrix.m41;
	let speedX = parseFloat(snowflake.dataset.speedX);
	let speedY = parseFloat(snowflake.dataset.speedY);

	if (snowflake.dataset.rain === 'true')
	{
		snowflake.style.transform = `translate(${currentLeft - speedX}px, ${currentTop + speedY}px) rotate(${parseFloat(snowflake.dataset.rotation) + speedX}deg)`;
	}
	else
	{
		let currentRotation = parseFloat(snowflake.dataset.rotation);
		snowflake.style.transform = `translate(${currentLeft - speedX}px, ${currentTop + speedY}px) rotate(${currentRotation}deg)`;
		snowflake.dataset.rotation = currentRotation + speedX;
	}
}