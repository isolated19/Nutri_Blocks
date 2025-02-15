    // Get elements from the DOM
    let tile = document.getElementById('tile');
    let container = document.querySelector('.container');
    let scoreDisplay = document.getElementById('score');
    let timerDisplay = document.getElementById('timer');
    let pauseBtn = document.getElementById('pause-btn');
    let gameOverPopup = document.getElementById('game-over-popup');
    let gameOverMessage = document.getElementById('game-over-message');
    let restartBtn = document.getElementById('restart-btn');
    let leadershipBtn = document.getElementById('leadership-btn');
    let positiveColor="rgb(207, 149, 33)"
    let negativeColor="rgb(207, 149, 33)"
    
    // Get the username passed from Flask
    let username = "{{ username }}";
    let score = 0;
    let gamePaused = false;
    let speed = 5; // Initial falling speed
    let timeLeft = 10; // Set to 10 seconds for testing (adjust as needed)
    let gameInterval;
    let timerInterval;
    
    // Center the tile initially
    let tilePos = (container.clientWidth - tile.clientWidth) / 2;
    tile.style.left = tilePos + 'px';
    
    // Move the tile with arrow keys
    document.addEventListener('keydown', function (e) {
      if (gamePaused) return;
      let containerWidth = container.clientWidth;
      let tileWidth = tile.clientWidth;
      if (e.key === 'ArrowRight') tilePos += containerWidth * 0.05;
      if (e.key === 'ArrowLeft') tilePos -= containerWidth * 0.05;
      tilePos = Math.max(0, Math.min(tilePos, containerWidth - tileWidth));
      tile.style.left = tilePos + 'px';
    });
    
    // Create a falling item (fruit or junk food)
    function createFallingItem() {
      if (gamePaused) return;
      let item = document.createElement('img');
      item.classList.add('falling-item');
      let isFruit = Math.random() < 0.7;
      item.src = isFruit
        ? 'https://icons.iconarchive.com/icons/martin-berube/food/128/strawberry-icon.png'
        : 'https://icons.iconarchive.com/icons/himacchi/sweetbox/128/strawberry-cake-icon.png';
      item.dataset.type = isFruit ? 'fruit' : 'junk';
      item.style.left = Math.floor(Math.random() * (container.clientWidth - 30)) + 'px';
      container.appendChild(item);
      moveItem(item);
    }
    
    // Move the falling item downwards
    function moveItem(item) {
      let fallInterval = setInterval(() => {
        if (gamePaused) return;
        let top = parseInt(item.style.top) || 0;
        item.style.top = (top + speed) + 'px';
        if (top > container.clientHeight - 30) {
          if (container.contains(item)) container.removeChild(item);
          clearInterval(fallInterval);
        }
        checkCollision(item, fallInterval);
      }, 50);
    }
    
    // Check for collision with the tile
    function checkCollision(item, fallInterval) {
      if (item.collisionHandled) return;
      let tileRect = tile.getBoundingClientRect();
      let itemRect = item.getBoundingClientRect();
      if (tileRect.left < itemRect.right &&
          tileRect.right > itemRect.left &&
          tileRect.bottom > itemRect.top &&
          tileRect.top < itemRect.bottom) {
        item.collisionHandled = true;
        let points = document.createElement("div");
        points.classList.add("floating-points");
        if (item.dataset.type === 'fruit') {
          score += 1;
          points.textContent = "+1";
          points.style.color = positiveColor;  // Apply the positive color

        } else {
          score -= 1;
          points.textContent = "-1";
          points.style.color = negativeColor;  // Apply the positive color
          
        }
        points.style.left = tile.style.left;
        points.style.top = (tile.offsetTop - 20) + "px";
        container.appendChild(points);
        setTimeout(() => {
          points.style.opacity = "0";
          points.style.transform = "translateY(-30px)";
        }, 50);
        setTimeout(() => {
          container.removeChild(points);
        }, 800);
        scoreDisplay.textContent = score;
        item.classList.add('burst');
        setTimeout(() => {
          if (container.contains(item)) container.removeChild(item);
          clearInterval(fallInterval);
        }, 300);
      }
    }
    
    // Increase falling speed every 30 seconds
    setInterval(() => { if (!gamePaused) speed += 1; }, 30000);
    
    // Countdown Timer
    function startTimer() {
      timerInterval = setInterval(() => {
        if (gamePaused) return;
        if (timeLeft <= 0) {
          endGame("Time's up! " + username + ", Your final score is " + score);
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
    
    // End Game: Stop timers, show popup, and send data to the backend
    function endGame(message) {
      clearInterval(gameInterval);
      clearInterval(timerInterval);
      gameOverPopup.style.display = "block";
      gameOverMessage.textContent = message;
      
      // Use the global score value and the current timer display
      let timeStr = timerDisplay.textContent;
      
      // Send the data to the backend via fetch
      fetch("/save_score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, score: score, time: timeStr })
      })
      .then(response => response.json())
      .then(data => console.log("Success:", data))
      .catch(error => console.error("Error:", error));
    }
    
    // Restart the game when the restart button is clicked
    restartBtn.addEventListener('click', function () {
      resetGame();
    });
    
    function resetGame() {
      clearInterval(gameInterval);
      clearInterval(timerInterval);
      score = 0;
      timeLeft = 180;
      gamePaused = false;
      speed = 5;
      scoreDisplay.textContent = score;
      timerDisplay.textContent = "03:00";
      gameOverPopup.style.display = "none";
      tile.style.left = (container.clientWidth - tile.clientWidth) / 2 + 'px';
      gameInterval = setInterval(createFallingItem, 1000);
      startTimer();
    }
    
    // Redirect to the leaderboard page
    leadershipBtn.addEventListener('click', function () {
      window.location.href = "/leaderboard";
    });
    
    // Pause and resume the game using the pause button
    pauseBtn.addEventListener('click', function () {
      if (gamePaused) {
        gamePaused = false;
        pauseBtn.src = 'https://icons.iconarchive.com/icons/icons-land/play-stop-pause/128/Pause-Hot-icon.png';
        gameInterval = setInterval(createFallingItem, 1000);
        startTimer();
      } else {
        gamePaused = true;
        pauseBtn.src = 'https://icons.iconarchive.com/icons/icons-land/vista-multimedia/128/Play-1-Hot-icon.png';
        clearInterval(gameInterval);
        clearInterval(timerInterval);
      }
    });
    
    // Start the game loop and timer
    gameInterval = setInterval(createFallingItem, 1000);
    startTimer();