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
	console.log(chrome.runtime.lastError.message);
	port = null;
}