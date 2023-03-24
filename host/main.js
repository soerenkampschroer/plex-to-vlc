const {app} = require('electron');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const nativeMessage = require('chrome-native-messaging');

app.on('ready', () => {
    process.stdin
        .pipe(new nativeMessage.Input())
        .pipe(new nativeMessage.Transform(messageReceived))
        .pipe(new nativeMessage.Output())
        .pipe(process.stdout)
    ;
});

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
            openStream(request, push, done);
        }
    } else if (request.type == "version") {
        request.version = app.getVersion();
        push(request);
        done();
    }
}

/**
 * Opens a file using the specified app. The command looks like:
 * open  -a appname /path/to/file
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
    if (request.player && request.player.length > 0 && request.player !== "default") {
        cmd+= ' -a ' + request.player.replace(/[^0-9a-zA-Z ]/g, "").replace(/[ ]/g, "\\ ");
    }
    
    // open file
    executeCmd(cmd, request, push, done);
}

/**
 * Opens a Plex download link in the specified app.
 * 
 * @param {object} request 
 * @param {*} push 
 * @param {*} done
 */
async function openStream (request, push, done) {
    let player,
        cmd,
        filePathClean;

    filePathClean = "'" + request.downloadUrl + "'";

    if (request.player && request.player.length > 0 && request.player !== "default") {
        player = request.player.replace(/[^0-9a-zA-Z ]/g, "").replace(/[ ]/g, "\\ ");
    } else {
        player = await getDefaultPlayer();
        if (player == "iina") {
            player = await getDefaultPlayer("io.iina.mkv");
        }
    }
    
    if (player == "iina") {
        cmd = "/Applications/IINA.app/Contents/MacOS/iina-cli " + filePathClean;
    } else {
        cmd = "open -a " + player + " " + filePathClean;
    }

    // open file
    executeCmd(cmd, request, push, done);
}

/**
 * @param {string} cmd 
 * @param {*} request 
 */
async function executeCmd(cmd, request, push, done) {
    try {
        let {stdout, stderr} = await exec(cmd);

        if (stderr) {
            request.status = "error";
            request.message = stderr;
        } else {
            request.status = "success";
            request.message = "Started playback";
        }
        push(request);
        done();

    } catch (error) {
        request.status = "error";
        request.message = error.toString();
        
        push(request);
        done();
    }
}

/**
 * Parse out the defualt player for mkv files.
 * @returns {Promise}
 */
async function getDefaultPlayer(contentType = "org.matroska.mkv") {
    const cmd = "/System/Library/Frameworks/CoreServices.framework/Versions/A/Frameworks/LaunchServices.framework/Versions/A/Support/lsregister -dump | grep -A 2 'mpeg-4' | grep 'all roles' | awk '{print $3}'";
    const myRe = /(?<=[a-z]*\.[a-z]*\.).*?(?=\s)/g;
    const {stdout, stderr} = await exec(cmd);
    return myRe.exec(stdout)[0];
}

/**
 * Escapes whitespaces and some more fun stuff. 
 * @param {string} filePath 
 * @returns {string}
 */
function escapeFilePath(filePath) {
    filePath = filePath.trim();
    return '"' + filePath.replace('"', '') + '"';
}