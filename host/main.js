const {app, dialog} = require('electron');
const escapeStringRegExp = require("escape-string-regexp");
const exec = require('child_process').exec;

const executablePath = '/Applications/VLC.app/Contents/MacOS/VLC';

app.on('ready', () => { 
    
    setupNativeMessageListener();
    
})

function setupNativeMessageListener() {
    
    process.stdin.setEncoding('utf8');
    
    // listen for stdin data
    process.stdin.on('data', (chunk) => {
        
        let filePath;
        
        filePath = parseFilePathFromChunk(chunk);

        runVlc(filePath);

        // quit
        app.quit();
        
    });

}

function parseFilePathFromChunk(chunk) {

    let json,
        filePath;

    // cut the first 4 chars and JSON parse
    json = JSON.parse(chunk.slice(4, chunk.length));

    // sanitize filepath
    filePath = escapeFilePath(json.filePath);

    return filePath;
}

function escapeFilePath(filePath) {
    filePath = filePath.trim();
    return escapeStringRegExp(filePath).replace(/(\s+)/g, '\\$1');
}

function runVlc(filePath) {
    
    let cmd;

    // app path + file path as argument
    cmd = executablePath +  ' ' + filePath;
    
    // const dialogOptions = {type: 'info', buttons: ['OK'], message: 'Do it?', detail: cmd};
    // dialog.showMessageBox(dialogOptions, i => console.log(i));

    // start vlc with media path
    exec(cmd);
}