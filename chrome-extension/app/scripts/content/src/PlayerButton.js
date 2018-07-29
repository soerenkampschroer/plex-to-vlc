/**
 * This class handles adding the external player button.
 */
export default class PlayerButton {
    constructor(clickCallback) {
        this.callback = clickCallback;
        this.interval = null;
        this.setupEvents();
        this.handleButtonAdd();
    }

    setupEvents() {
        window.addEventListener('hashchange', this.handleButtonAdd.bind(this));
    }

    handleButtonAdd() {
        if (location.hash.indexOf('/server') > -1 && location.hash.indexOf('/details') > -1) {
            this.checkLoaded();
        }
    }

    checkLoaded() {
        this.interval = setInterval(() => {
            if (document.querySelector('.pageHeaderToolbar-toolbar-1lW-M')) {
                this.addVlcLink();
                clearInterval(this.interval);
            }
        }, 500);
    }

    addVlcLink() {
        if (!document.querySelector(".ptvlc-launch")) {
            var el = document.createElement('button')
            el.classList = "ptvlc-launch ToolbarButton-toolbarButton-3xzHJ Link-link-2n0yJ Link-default-2XA2b";
            el.innerHTML = "VLC";
            document.querySelector('.pageHeaderToolbar-toolbar-1lW-M').appendChild(el)
        
            document.querySelector(".ptvlc-launch").addEventListener("mousedown", this.callback);
        }
    }
}