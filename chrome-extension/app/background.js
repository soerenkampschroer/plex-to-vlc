chrome.browserAction.onClicked.addListener(function(activeTab) {});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	
	console.log(request);
	openVlc(request.filePath);

});

function openVlc(filePath) {
	var hostName = "com.soerenkampschroer.plextovlc";
	port = chrome.runtime.connectNative(hostName);
	port.onDisconnect.addListener(onDisconnected);

	setTimeout(() => {
		if (port) {
			port.postMessage({ filePath: filePath });
			console.log("Message sent!");
		}
	}, 1000);
}

function onDisconnected() {
	console.log(chrome.runtime.lastError);
	
	// if native host is not installed
	if (chrome.runtime.lastError.message == "Specified native messaging host not found.") {
		if (confirm("You need to install the native host application. Do you want to open the guide now?\n\nYou can also click on the extension icon to learn more.")) {
			window.open('https://github.com/soerenkampschroer/plex-to-vlc/releases/latest', '_blank');
		}
	}
	port = null;
}