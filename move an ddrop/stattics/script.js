<!-- <script>
    let tile = document.getElementById('tile');
    let container = document.querySelector('.container');
    let scoreDisplay = document.getElementById('score');
    let timerDisplay = document.getElementById('timer');
    let pauseBtn = document.getElementById('pause-btn');
    let gameOverPopup = document.getElementById('game-over-popup');
    let gameOverMessage = document.getElementById('game-over-message');
    let restartBtn = document.getElementById('restart-btn');
    let leadershipBtn = document.getElementById('leadership-btn');
   
    let username = "{{ username }}"; // Get from Flask session
    let fscore = score;

    let score = 0;
    let gamePaused = false;
    let speed = 5; // Initial falling speed
    let timeLeft = 10; // 3 minutes countdown
    let gameInterval;
    let timerInterval;
    
     // Initialize tile position (centered horizontally)
    let tilePos = (container.clientWidth - tile.clientWidth) / 2;
    tile.style.left = tilePos + 'px';

    // Move the tile using arrow keys using the tilePos variable
    document.addEventListener('keydown', function (e) {
      if (gamePaused) return;
      
      let containerWidth = container.clientWidth;
      let tileWidth = tile.clientWidth;
      // Get current left position relative to the container
      // Update tilePos based on key pressed
      if (e.key === 'ArrowRight') {
        tilePos += containerWidth * 0.05;
      }
      if (e.key === 'ArrowLeft') {
        tilePos -= containerWidth * 0.05;
      }
      
      // Ensure the tile stays within the container bounds
      tilePos = Math.max(0, Math.min(tilePos, containerWidth - tileWidth));
      tile.style.left = tilePos + 'px';
    });

    // Create a falling item (fruit or junk food)
    function createFallingItem() {
      if (gamePaused) return;
      
      let item = document.createElement('img');
      item.classList.add('falling-item');
      
      // 70% chance for a fruit, 30% for junk food
      let isFruit = Math.random() < 0.7; 
      item.src = isFruit 
        ? 'https://icons.iconarchive.com/icons/martin-berube/food/128/strawberry-icon.png' 
        : 'https://icons.iconarchive.com/icons/himacchi/sweetbox/128/strawberry-cake-icon.png';
      item.dataset.type = isFruit ? 'fruit' : 'junk';
      
      // Set a random horizontal position within the container bounds
      item.style.left = Math.floor(Math.random() * (container.clientWidth - 30)) + 'px';
      container.appendChild(item);
      
      moveItem(item);
    }
    
    // Move the falling item
    function moveItem(item) {
      let fallInterval = setInterval(() => {
        if (gamePaused) return;
        
        let top = parseInt(item.style.top) || 0;
        item.style.top = (top + speed) + 'px';
        
        // Remove the item if it falls off the screen
        if (top > container.clientHeight - 30) {
          if (container.contains(item)) {
            container.removeChild(item);
          }
          clearInterval(fallInterval);
        }
        
        checkCollision(item, fallInterval);
      }, 50);
    }
    
    // Check collision with the tile
    function checkCollision(item, fallInterval) {
      if (item.collisionHandled) return; // Prevent duplicate handling
      
      let tileRect = tile.getBoundingClientRect();
      let itemRect = item.getBoundingClientRect();
      
      if (
        tileRect.left < itemRect.right &&
        tileRect.right > itemRect.left &&
        tileRect.bottom > itemRect.top &&
        tileRect.top < itemRect.bottom
      ) {
        // Mark this item as already processed
        item.collisionHandled = true;
        
        let points = document.createElement("div");
         points.classList.add("floating-points");
    
        if (item.dataset.type === 'fruit') {
          score += 1;
          // scoreDisplay.classList.add('score-up');
          points.textContent = "+1";
          points.style.color = "yellow"; // Green for positive points
        } else {
          score -= 1;
          // scoreDisplay.classList.add('score-down');  // Add the animation class
           points.textContent = "-1";
           points.style.color = "yellow"; // Red for negative points
        }
        
        
         // Position the floating text above the tile
          points.style.left = tile.style.left;
          points.style.top = (tile.offsetTop - 20) + "px";
          container.appendChild(points);
      
          // Animate the floating text
          setTimeout(() => {
            points.style.opacity = "0";
            points.style.transform = "translateY(-30px)";
          }, 50);
      
          // Remove floating text after animation
          setTimeout(() => {
            container.removeChild(points);
          }, 800);
    
         scoreDisplay.textContent = score;

         // Remove animation class after animation completes
        // setTimeout(() => {
        //   scoreDisplay.classList.remove('score-up', 'score-down');
        // }, 300);  // Matches the duration of the animation
        item.classList.add('burst');
    
        setTimeout(() => {
          if (container.contains(item)) {
            container.removeChild(item);
          }
          clearInterval(fallInterval);
        }, 300);
    
        // End game if score drops to 0 or below
        // if (score <= 0) {
        //   endGame("You lost! Your score is " + score + ".");
        // }
      }
    }
    
    // Increase falling speed every 30 seconds
    setInterval(() => {
      if (!gamePaused) {
        speed += 1;
      }
    }, 30000);
    
    // Countdown Timer
    function startTimer() {
      timerInterval = setInterval(() => {
        if (gamePaused) return;
    
        if (timeLeft <= 0) {
          endGame("Time's up!"+ username+" Your final score is " + score);
          return;
        }
    
        timeLeft--;
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerDisplay.textContent = 
          (minutes < 10 ? "0" : "") + minutes + ":" + 
          (seconds < 10 ? "0" : "") + seconds;
      }, 1000);
    }

    
    
    // End Game Function
    function endGame(message) {
      clearInterval(gameInterval);
      clearInterval(timerInterval);
      gameOverPopup.style.display = "block";
      gameOverMessage.textContent = message;

    //  saveScore(playername, score)
    
    let time = timerDisplay.textContent;

    fetch("/save_score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username:username, fscore:score, time: time }),
    })

    .then(response => response.json())
    .then(data => console.log("Success:", data))
    .catch(error => console.error("Error:", error));

    }
    
    function saveScore(playername,score){

    }
     //Game leadership Function
    leadershipBtn.addEventListener('click', function () {
      // Add your leadership/leaderboard logic here.
       window.location.href = "/leaderboard";
      // alert("Leadership functionality is not implemented yet.");
    });
        
        
    // Restart Game Function
    // Restart Game Function (when image button is clicked)
     // Restart Game Function
    
      restartBtn.addEventListener('click', function () {
       
        
          // alert('The Game will restart');
        // Reset the game state manually
          resetGame();
      });
      
      
      function resetGame() {
    // Clear any active intervals
      clearInterval(gameInterval);
      clearInterval(timerInterval);
      
      // Reset the variables
      score = 0;
      timeLeft = 180;
      gamePaused = false;
      speed = 5; // Reset falling speed
      
      // Reset the score and timer displays
      scoreDisplay.textContent = score;
      timerDisplay.textContent = "03:00";  // Reset timer to initial value
      
      // Hide the game over popup
      gameOverPopup.style.display = "none";
      
      // Reset the tile position
      tile.style.left = (container.clientWidth - tile.clientWidth) / 2 + 'px';
      
      // Restart the game loop and timer
      gameInterval = setInterval(createFallingItem, 1000);
      startTimer();
    }
 
  
    
    // Pause & Resume the game with the image button
    pauseBtn.addEventListener('click', function () {
      if (gamePaused) {
        // Start the game
        gamePaused = false;
        pauseBtn.src = 'https://icons.iconarchive.com/icons/icons-land/play-stop-pause/128/Pause-Hot-icon.png'; // Change image to Pause
        gameInterval = setInterval(createFallingItem, 1000); // Start falling items
        startTimer(); // Start the timer
      } else {
        // Pause the game
        gamePaused = true;
        pauseBtn.src = 'https://icons.iconarchive.com/icons/icons-land/vista-multimedia/128/Play-1-Hot-icon.png'; // Change image to Play
        clearInterval(gameInterval); // Stop falling items
        clearInterval(timerInterval); // Stop the timer
      }
    });

    
    // Start the game loop
    gameInterval = setInterval(createFallingItem, 1000);
    startTimer();
 