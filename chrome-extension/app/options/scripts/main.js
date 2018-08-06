/* global $ */

window.addEventListener("load", function() {
    var bgPage = chrome.extension.getBackgroundPage();
    
    
    var settings = bgPage.settings.get();
    
    document.getElementById("mark-played").checked = settings.markItemsPlayed;
    document.getElementById("player-select").value = settings.player;
    //$("#player-select").dropdown("set selected", settings.player);
    
    $("#player-select").dropdown();

    document.getElementById("mark-played").addEventListener("change", function () {
        bgPage.settings.markItemsPlayed = this.checked;
        bgPage.settings.save();
    });

    document.getElementById("player-select").addEventListener("change", function () {
        bgPage.settings.player = this.value;
        bgPage.settings.save();
    });

});