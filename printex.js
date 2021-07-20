var printer = require('printer');
var fs = require('fs');

var info = fs.readFileSync('ticket.txt').toString();

function sendPrint() {
    printer.printDirect({
        data: info,
        type: 'RAW',
        success: function (jobID) {
            console.log("ID: " + jobID);
        },
        error: function (err) {
            console.log('printer module error: ' + err);
            throw err;
        }
    });
}

sendPrint();