var express = require('express');
var router = express.Router();
const { exec } = require("child_process");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({"status":"success"});
});

router.post('/', function(req, res, next) {
  console.log(req.body)

  let url = req.body["link"];

  let execShellCommand = (command) => {
    return new Promise(
      (resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                reject(error);
                return
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                reject(error);
                return;
            }
            console.log(`stdout: ${stdout}`);
            resolve(stdout);
        });
      }
    );
  };

  execShellCommand("yt " + url + " ")
    .then(
      result => { 
        console.log(result)
        return execShellCommand("mv ~/Music/yt/* ~/Downloads")
      },
      error => {
        console.error(error)
        // Update youtube-dl on an async task ? Then auto-retry ?
        throw new Error(''+error)
      }
    ).then(
      result => {
        console.log(result)
        res.json({"status":'success', "result": " " + result});
      },
      error => {
        console.error(error)
        // Update youtube-dl on an async task ? Then auto-retry ?
        res.json({"status":'error', "result": " second error catch" + error});
      }
    )
});


module.exports = router;
