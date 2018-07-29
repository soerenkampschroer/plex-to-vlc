const {app} = require('electron');
const exec = require('child_process').exec;
const fs = require('fs');
const escapeStringRegExp = require("escape-string-regexp");
const nativeMessage = require('chrome-native-messaging');

const playerName = '';

app.on('ready', () => {
    process.stdin
        .pipe(new nativeMessage.Input())
        .pipe(new nativeMessage.Transform(messageReceived))
        .pipe(new nativeMessage.Output())
        .pipe(process.stdout)
    ;
})


/**
 * Listen to messages from browser extension.
 * @param {object} request 
 * @param {*} push 
 * @param {*} done 
 */
function messageReceived(request, push, done) {

    if (request.type == "playback") {
        if (fs.existsSync(request.filePath)) {
            openPlayer(request, push, done);
        } else {
            request.status = "error";
            request.message = "File not found";
            push(request);
            done();
        }
    } else if (request.type == "version") {
        request.version = app.getVersion();
        push(request);
        done();
    }
}


/**
 * Opens a file using the specified app. The command looks like:
 * open /path/to/file -a appname
 * @param {object} request 
 * @param {*} push 
 * @param {*} done 
 */
function openPlayer(request, push, done) {
    
    let cmd,
        filePathClean;

    filePathClean = escapeFilePath(request.filePath);

    // app path + file path as argument
    cmd = 'open ' + filePathClean;

    // open file in specific player if requested
    if (playerName && playerName.length > 0) {
        cmd+= ' -a ' + playerName;
    }
    
    // open file
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            request.status = "error";
            request.message = stderr;
        } else {
            request.status = "success";
            request.message = "Started playback";
        }
        push(request);
        done();
    });
}

/**
 * Escapes whitespaces and some more fun stuff. 
 * @param {string} filePath 
 * @returns {string}
 */
function escapeFilePath(filePath) {
    filePath = filePath.trim();
    return escapeStringRegExp(filePath).replace(/(\s+)/g, '\\$1');
}