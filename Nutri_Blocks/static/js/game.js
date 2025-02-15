/***** Global Variables & Setup *****/
// Use the game container for positioning falling items
let container = document.querySelector('.game-container');

// Define positive and negative colors for score feedback
let positiveColor = "rgb(207, 149, 33)";
let negativeColor = "rgb(207, 149, 33)";

// Arrays for different fruit and junk images
const fruitImages = [
  "/static/img/fruits/fruit1.png",
  "/static/img/fruits/fruit2.png",
  "/static/img/fruits/fruit3.png",
  "/static/img/fruits/fruit4.png",
  "/static/img/fruits/fruit1.png",
  "/static/img/fruits/fruit2.png",
  "/static/img/fruits/fruit3.png",
  "/static/img/fruits/fruit4.png"
 
  
];
const junkImages = [
  "/static/img/junks/junk1.png",
  "/static/img/junks/junk2.png",
  "/static/img/junks/junk3.png",
  "/static/img/junks/junk1.png",
  "/static/img/junks/junk2.png",
  "/static/img/junks/junk3.png",
  "/static/img/junks/junk1.png",
  "/static/img/junks/junk2.png",
  "/static/img/junks/junk3.png"
];

// Get username from Flask (if provided)
let username = "{{ username}}";
console.log(username);
let score = 0;
let gamePaused = false;
let speed = 10;       // Initial falling speed
let timeLeft = 180;  // 180 seconds = 03:00 minutes
let gameInterval;
let timerInterval;
const totalTime =180;
let tile = document.getElementById("tile");
tile.style.width = "15vw"; // 20% of viewport width (adjust as needed)



// Drag basket with mouse
tile.addEventListener("mousedown", (e) => {
  isDragging = true;
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
      let newX = e.clientX - tile.clientWidth / 2;
      
      if (newX >= 0 && newX <= window.innerWidth - tile.clientWidth) {
          tile.style.left = `${newX}px`;
          console.log('mousemove');
      }
  }
});








tile.addEventListener("touchstart",(event)=>{
  isDragging=true;
  document.addEventListener("touchmove",onTouchmove);
  document.addEventListener("mouseup",()=>{
    isDragging=false;
    document.removeEventListener("touchmove",onTouchmove);
  });
});
function onTouchmove(event) {
  if (!isDragging) return;
  let touch=event.touches[0]; //Get the first touch point
  let containerWidth = window.innerWidth;
  let tileWidth = tile.clientWidth;
  tilePos = touch.clientX - tileWidth / 2;
  tilePos = Math.max(0, Math.min(tilePos, containerWidth - tileWidth));
  tile.style.left = tilePos + "px";
}

/***** Falling Items *****/
// function createFallingItem() {
//   if (gamePaused) return;
//   let item = document.createElement("img");
//   item.classList.add("falling-item");
//   let isFruit = Math.random() < 0.7;
//   if (isFruit) {
//     item.src = fruitImages[Math.floor(Math.random() * fruitImages.length)];
//     item.dataset.type = "fruit";
//   } else {
//     item.src = junkImages[Math.floor(Math.random() * junkImages.length)];
//     item.dataset.type = "junk";
//   }
  // Randomize horizontal position and initialize vertical position
//   item.style.left = Math.floor(Math.random() * (window.innerWidth - 30)) + "px";
//   item.style.top = "0px";
//   container.appendChild(item);
//   moveItem(item);
// }



// Store positions of falling items to prevent overlap
// let activeItemPositions = [];

// function createFallingItem() {
//   if (gamePaused) return;

//   let item = document.createElement("img");
//   item.classList.add("falling-item");

//   let isFruit = Math.random() < 0.7;
//   if (isFruit) {
//     item.src = fruitImages[Math.floor(Math.random() * fruitImages.length)];
//     item.dataset.type = "fruit";
//   } else {
//     item.src = junkImages[Math.floor(Math.random() * junkImages.length)];
//     item.dataset.type = "junk";
//   }

  // Ensure items don’t overlap by checking existing positions
//   let leftPos;
//   let maxAttempts = 10; // Prevent infinite loops
//   let attempt = 0;
//   do {
//     leftPos = Math.floor(Math.random() * (window.innerWidth - 50)); // Adjusted width
//     attempt++;
//   } while (isOverlapping(leftPos) && attempt < maxAttempts);

//   item.style.left = leftPos + "px";
//   item.style.top = "0px";

//   container.appendChild(item);
//   activeItemPositions.push(leftPos); // Store the position
//   moveItem(item);
// }

// Function to check if a new item is too close to existing ones
// function isOverlapping(newX) {
//   return activeItemPositions.some(existingX => Math.abs(existingX - newX) < 50); // Minimum distance
// }








function moveItem(item) {
  let fallInterval = setInterval(() => {
    if (gamePaused) return;
    let top = parseInt(item.style.top) || 0;
    item.style.top = top + speed + "px";
    if (top > window.innerHeight - 30) {
      if (container.contains(item)) container.removeChild(item);
      clearInterval(fallInterval);
    }
    checkCollision(item, fallInterval);
  }, 50);
}

/***** Collision Detection *****/
function checkCollision(item, fallInterval) {
  if (item.collisionHandled) return;
  let tileRect = tile.getBoundingClientRect();
  let itemRect = item.getBoundingClientRect();
  if (
    tileRect.left < itemRect.right &&
    tileRect.right > itemRect.left &&
    tileRect.bottom > itemRect.top &&
    tileRect.top < itemRect.bottom
  ) {
    item.collisionHandled = true;
    let points = document.createElement("div");
    points.classList.add("floating-points");
    if (item.dataset.type === "fruit") {
      score += 1;
      increaseHealth();
      points.textContent = "+1";
      points.style.color = positiveColor;
    } else {
      score -= 1;
      decreaseHealth();
      points.textContent = "-1";
      points.style.color = negativeColor;
    }
    // Position the floating feedback near the tile
    points.style.left = tile.style.left;
    points.style.top = (tile.offsetTop - 20) + "px";
    container.appendChild(points);
    setTimeout(() => {
      points.style.opacity = "0";
      points.style.transform = "translateY(-30px)";
    }, 50);
    setTimeout(() => {
      if (container.contains(points)) container.removeChild(points);
    }, 300);
    // Update the score display (the span with id="score")
    document.getElementById("score").textContent = score;
    item.classList.add("burst");
    setTimeout(() => {
      if (container.contains(item)) container.removeChild(item);
      clearInterval(fallInterval);
    }, 200);
  }
}

/***** Health Functions *****/

function updateHealthBarColor() {
  let healthBar = document.getElementById("progress");
  if (health >= 100) {
    pausegame();
    endGame(); // Call the end game function
 
} else if (health <= 20) {
    healthBar.style.backgroundColor = "red"; // Low health
    // popup.style.display = "block"; // Show popup
    // popup.classList.add("pop-effect"); // Add animation class

    // setTimeout(() => {
    //     popup.style.display = "none"; // Hide popup after 1.5s
    // }, 1500);
} else if (health > 80) {
    healthBar.style.backgroundColor = "green"; // High health
} else {
    healthBar.style.backgroundColor = "orange"; // Medium health
}

}


let health = 0 // health as percentage
function decreaseHealth() {
  health -= 1;
  document.getElementById("progress").style.width = health + "%";
  updateHealthBarColor();

  // if (health < 0) {
  //   endGame();
  //   pausegame();
  // }

}
function increaseHealth() {
  if (health < 100) {
    health += 1;
    document.getElementById("progress").style.width = health + "%";
    updateHealthBarColor();

   
  }

  
}

/***** Timer & Speed *****/
// Increase falling speed every 30 seconds
// setInterval(() => {
//   if (!gamePaused) speed += 1;
// }, 30000);
// Countdown Timer
function startTimer() {
  timerInterval = setInterval(() => {
    if (gamePaused) return;
    if (timeLeft <= 0) {
      endGame();
      pausegame();
      return;
    }
    timeLeft--;
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById("timer").textContent =
      (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }, 1000);
}


/***** Game Over & Reset *****/
function endGame() {
// Ensure gameInterval and timerInterval are declared globally
if (typeof gameInterval !== "undefined") {
    clearInterval(gameInterval);
}
if (typeof timerInterval !== "undefined") {
    clearInterval(timerInterval);
}

// Show the game-over box
document.getElementById("game-over-box").style.display = "block";

// Ensure `timer` element exists before accessing textContent
let timerElement = document.getElementById("timer");

let timeStr = timerElement ? timerElement.textContent : "00:00";

// Ensure `totalTime` and `timeLeft` are defined
let timeTaken = (typeof totalTime !== "undefined" && typeof timeLeft !== "undefined") 
                ? totalTime - timeLeft 
                : 0;

// Ensure `score` is defined
if (typeof score === "undefined") {
    console.error("Score is not defined!");
    return;
}

// C

document.getElementById("timer-leader").textContent = timeStr ;


// Ensure `username` is defined
if (typeof username === "undefined" || !username) {
    console.error("Username is not defined!");
    return;
}

// Send data to the server
fetch("/save_score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        username: username,
        score: score,
        time: timeStr,
    }),
})
.then(response => response.json())
.then(data => console.log("Success:", data))
.catch(error => console.error("Error:", error));
}






function resetGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  score = 0;
  timeLeft = 180;// insert the time
  gamePaused = false;
  speed = 20;
  health = 0;
  document.getElementById("progress").style.width = health + "%";

  document.getElementById("score").textContent = score;
  document.getElementById("timer").textContent = "03:00";
  document.getElementById("game-over-box").style.display = "none";
  tile.style.left = (window.innerWidth - tile.clientWidth) / 2 + "px";
  tilePos = (window.innerWidth - tile.clientWidth) / 2;
  gameInterval = setInterval(createFallingItem, 500);
  startTimer();
}
function pausegame() {
  gamePaused = true;
  clearInterval(gameInterval);
  clearInterval(timerInterval);
}

/***** Button Event Listeners *****/
document.getElementById("leadership-btn").addEventListener("click", function () {
  window.location.href = "/leaderboard";
});
document.getElementById("restart-btn").addEventListener("click", function () {
  resetGame();
});

/***** Start the Game *****/
gameInterval = setInterval(createFallingItem, 500);
startTimer();









function centerTile() {
  let tileWidth = tile.clientWidth;
  let windowWidth = window.innerWidth;
  tile.style.left = (windowWidth - tileWidth) / 2 + "px";
}

// Call function on load and resize
window.addEventListener("load", centerTile);
window.addEventListener("resize", centerTile);


// function onMouseMove(event) {
//   let containerWidth = window.innerWidth;
//   let tileWidth = tile.clientWidth;
//   tilePos = (event.clientX - tileWidth / 2) / containerWidth * 100;
//   tilePos = Math.max(0, Math.min(tilePos, 100 - (tileWidth / containerWidth) * 100));
//   tile.style.left = tilePos + "vw";
// }


function createFallingItem() {
  if (gamePaused) return;
  
  let item = document.createElement("img");
  item.classList.add("falling-item");

  let isFruit = Math.random() < 0.7;
  item.src = isFruit ? 
      fruitImages[Math.floor(Math.random() * fruitImages.length)] : 
      junkImages[Math.floor(Math.random() * junkImages.length)];
  item.dataset.type = isFruit ? "fruit" : "junk";

  // Set width dynamically
  item.style.width = "10vw";  // Adjust based on screen size
  item.style.maxWidth = "80px";  // Prevent it from being too large
  
  // Randomized position with responsiveness
  let leftPos = Math.random() * (100 - 8) + "vw"; // Ensure it stays within bounds
  item.style.left = leftPos;
  item.style.top = "0px";

  container.appendChild(item);
  moveItem(item);
}



// function moveItem(item) {
//   function step() {
//       if (gamePaused) return;
//       let top = parseFloat(item.style.top) || 0;
//       item.style.top = top + (speed / window.innerHeight) * 100 + "vh"; // Responsive fall speed
//       if (top > 100) { // When it falls below the screen
//           if (container.contains(item)) container.removeChild(item);
//           return;
//       }
//       checkCollision(item);
//       requestAnimationFrame(step);
//   }
//   requestAnimationFrame(step);
// }


// window.addEventListener("resize", () => {
//   centerTile();  // Adjust tile position
// });


function moveItem(item) {
  const staticSpeed = speed; // Set a static speed value (you can adjust this value)

  function step() {
    if (gamePaused) return;

    let top = parseFloat(item.style.top) || 0;
    item.style.top = top + staticSpeed + "px"; // Use static speed instead of responsive speed

    // Check if the item has fallen off the screen
    if (top > window.innerHeight) { // When it falls below the screen
      if (container.contains(item)) container.removeChild(item);
      return;
    }

    checkCollision(item); // Check for collisions
    requestAnimationFrame(step); // Continue the animation
  }

  requestAnimationFrame(step); // Start the animation
}

window.addEventListener("resize", () => {
  centerTile();  // Adjust tile position if necessary
});