/* global Toastify */

export default class Notification {
    display(text, type) {

        var backgroundColor;

        switch (type) {
            case "error":
                backgroundColor = "linear-gradient(to bottom, #E53935, #D32F2F)";
                break;
            case "success":
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