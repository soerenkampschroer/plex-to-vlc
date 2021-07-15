/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/background/scripts/src/Settings.js":
/*!************************************************!*\
  !*** ./app/background/scripts/src/Settings.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Settings)
/* harmony export */ });
class Settings {
  markItemsPlayed = true;
  player = "default";

  constructor() {}

  get() {
    return {
      "markItemsPlayed": this.markItemsPlayed,
      "player": this.player
    };
  }

  save() {
    let settings = {
      markItemsPlayed: this.markItemsPlayed,
      player: this.player
    };
    chrome.storage.local.set(settings);
  }

  load() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(null, items => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }

        let saveSettings = false;

        if (items.markItemsPlayed === undefined) {
          items.markItemsPlayed = this.markItemsPlayed;
          saveSettings = true;
        }

        if (!items.player === undefined) {
          items.player = this.player;
          saveSettings = true;
        }

        if (saveSettings) {
          this.save(items);
        }

        this.markItemsPlayed = items.markItemsPlayed;
        this.player = items.player;
        resolve(this);
      });
    });
  }

}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************************************!*\
  !*** ./app/background/scripts/src/main.js ***!
  \********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Settings_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Settings.js */ "./app/background/scripts/src/Settings.js");


class Main {
  /**
   * This is the host app id.
   */
  static HOST_NAME = "com.soerenkampschroer.plextovlc";
  /**
   * Minumum companion app version.
   */

  static ACCEPTABLE_HOST_VERSION = "1.4.0";

  constructor() {
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
    chrome.runtime.onInstalled.addListener(this.handleOnInstalled.bind(this));
  }

  handleMessage(request, caller, callback) {
    this.handleMessageWrapper(request, caller, callback).then(callback);
    return true;
  }

  async handleMessageWrapper(request, caller, callback) {
    let settings = new _Settings_js__WEBPACK_IMPORTED_MODULE_0__.default();
    await settings.load();

    switch (request.type) {
      case "playback":
        request.player = settings.get().player;
        this.openNativeMessagePort(request, this.onDisconnected.bind(this), this.onMessage.bind(this));
        return true;

      case "getSettings":
        return settings.get();

      case "saveSettings":
        settings.markItemsPlayed = request.settings.markItemsPlayed;
        settings.player = request.settings.player;
        settings.save(request.settings);
        return true;

      case "hostVersionCheck":
        this.openNativeMessagePort({
          type: "version"
        }, this.onDisconnected.bind(this), this.onCheckVersionMessage.bind(this));
        return true;
    }
  }

  handleOnInstalled() {// console.log('checking host app version');
    // this.openNativeMessagePort({type: "version"}, this.onDisconnected.bind(this), this.onCheckVersionMessage.bind(this));
  }

  onCheckVersionMessage(request, port) {
    if (!request.version || !this.compareVersion(Main.ACCEPTABLE_HOST_VERSION, request.version)) {
      this.displayHostUpdateDialog();
    }

    port.disconnect();
  }

  compareVersion(ver1, ver2) {
    ver1 = ver1.split(".").map(s => s.padStart(10)).join(".");
    ver2 = ver2.split(".").map(s => s.padStart(10)).join(".");
    return ver1 <= ver2;
  }

  openNativeMessagePort(request, onDisconnectedCallback, onMessageCallback) {
    let port = chrome.runtime.connectNative(Main.HOST_NAME);
    port.onDisconnect.addListener(onDisconnectedCallback);
    port.onMessage.addListener(onMessageCallback);
    port.postMessage(request);
  }

  async onMessage(request, port) {
    let settings = new _Settings_js__WEBPACK_IMPORTED_MODULE_0__.default();
    await settings.load();
    request.markItemsPlayed = settings.get().markItemsPlayed;
    this.sendMessageToContentScript(request);
    port.disconnect();
  }

  onDisconnected() {
    if (chrome.runtime.lastError.message == "Specified native messaging host not found." || chrome.runtime.lastError.message == "Access to the specified native messaging host is forbidden.") {
      this.displayHostUpdateDialog();
    }
  }

  displayHostUpdateDialog() {
    this.sendMessageToContentScript("installHost");
  }

  sendMessageToContentScript(message) {
    chrome.tabs.query({
      active: true
    }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message);
    });
  }

}

new Main();
})();

/******/ })()
;
//# sourceMappingURL=background.js.map