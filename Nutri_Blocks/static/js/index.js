document.getElementById("gamenavigation").onclick = function () {
    window.location.href = "/game";

};

document.getElementById("username-form").addEventListener("submit", function(e) {
// Let the form submit naturally. The server's redirect will navigate to /game.
// If you need to do any additional processing, do it here.
});