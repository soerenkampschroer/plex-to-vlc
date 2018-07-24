if (location.hash.indexOf('/details')) {
    checkLoaded();
}

function checkLoaded() {
    var interval = setInterval(function() {
        if (document.querySelector('.pageHeaderToolbar-toolbar-1lW-M')) {
            addVlcLink();
            clearInterval(interval);
        }
    }, 500);
}

window.addEventListener('hashchange', function(e) {
    if (location.hash.indexOf('/details') > 0) {
        checkLoaded();
    }
});

function addVlcLink() {
    var el = document.createElement('button')
    el.classList = "ptvlc-launch ToolbarButton-toolbarButton-3xzHJ Link-link-2n0yJ Link-default-2XA2b";
    el.innerHTML = "VLC";
    document.querySelector('.pageHeaderToolbar-toolbar-1lW-M').appendChild(el)

    document.querySelector(".ptvlc-launch").addEventListener("mousedown", function () {
        handleTriggerClicked();
    });
}

function handleTriggerClicked() {
    
    // hide edit popup and backdrop
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.modal-backdrop, .edit-metadata-modal { opacity: 0 !important; } html { pointer-events: none; }';
    document.getElementsByTagName('head')[0].appendChild(style);


    // open edit popup
    var event = new Event('mousedown', {
        view: window,
        bubbles: true,
        cancelable: true
    });
    document.querySelector('.pageHeaderToolbar-toolbar-1lW-M button[data-qa-id="toolbarEdit"]').dispatchEvent(event);

    var event = new Event('mouseup', {
        view: window,
        bubbles: true,
        cancelable: true
    });
    document.querySelector('.pageHeaderToolbar-toolbar-1lW-M button[data-qa-id="toolbarEdit"]').dispatchEvent(event);

    // open file path option
    setTimeout(() => {
        var event = new Event('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        document.querySelector('a.info-btn').dispatchEvent(event);

        setTimeout(() => {
            
            // get file paths
            var filePathNodeList = document.querySelectorAll('ul.media-info-file-list li');

            var filePaths = [];

            for(var i = 0; i < filePathNodeList.length; i++) {
                filePaths.push(filePathNodeList[i].innerHTML);
            }

            // close edit popup
            var event = new Event('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            document.querySelector('.modal-header button.close').dispatchEvent(event);

            sendFilePath(filePaths);

            style.remove();
        }, 0);

    }, 600);
}

function sendFilePath(filePaths) {
    console.log(filePaths);
    var filePath = filePaths[0];
    chrome.runtime.sendMessage({filePath: filePath}, function(response) {});
}