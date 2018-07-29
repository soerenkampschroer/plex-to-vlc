/* global Toastify */

/**
 * Notification Class
 * Wrapper for Toastify, displays notifications
 */
export default class Notification {

    /**
     * Notification types.
     * @readonly
     * @enum {string}
     */
    static Type = {
        SUCCESS: "success",
        ERROR: "error"
    };

    /**
     * Displays notification.
     * @param {string} text 
     * @param {Type} [type=Notification.Type.SUCCESS] type 
     */
    display(text, type = Notification.Type.SUCCESS) {

        var backgroundColor;

        switch (type) {
            case Notification.Type.ERROR:
                backgroundColor = "linear-gradient(to bottom, #E53935, #D32F2F)";
                break;
            case Notification.Type.SUCCESS:
            default:
                backgroundColor = "linear-gradient(to bottom, #4CAF50, #43A047)";
                break;
        }

        Toastify({
            text: text,
            backgroundColor: backgroundColor,
            className: "ptv-notification",
            positionLeft: false,
            duration: 3000
        }).showToast();
    }
}