/* global $ */

window.addEventListener("load", function() {
    chrome.runtime.sendMessage({"type": "getSettings"}, function(settings) {
    
        document.getElementById("mark-played").checked = settings.markItemsPlayed;
        document.getElementById("player-select").value = settings.player;
        
        $("#player-select").dropdown("set selected", settings.player);
        
    });

    $("#player-select").dropdown();

    document.getElementById("mark-played").addEventListener("change", function () {
        saveSettings();
    });

    document.getElementById("player-select").addEventListener("change", function () {
        saveSettings();
    });

    function saveSettings() {
        let settings = {};
        settings.markItemsPlayed = document.getElementById("mark-played").checked;
        settings.player = document.getElementById("player-select").value;
        chrome.runtime.sendMessage({"type": "saveSettings", "settings": settings});
    }
    
});