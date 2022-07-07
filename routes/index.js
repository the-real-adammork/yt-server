var express = require('express');
var router = express.Router();
var crypto = require('crypto');
const { exec } = require("child_process");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({"status":"success"});
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

  async function moveWithBuffer(directory) {
    await sleep(2000);
    return execShellCommand("find ./" + directory + " -type f -name \"*\" | sed 's/.*/\"&\"/' | xargs -I {} atomicparsley \"{}\" --genre \"YTRIP\" ;" + "mv " + directory + "/*.m4a ~/Downloads")
  }

  const uniqueishId = crypto.randomBytes(20).toString('hex');
  const directory = "downloads/" + uniqueishId;
  execShellCommand("mkdir " + directory)
    .then(
      result => { 
        console.log(result)
        return execShellCommand("yt -D " + directory + " " + url)
      },
    ).then(
      result => { 
        console.log(result)
        return moveWithBuffer(directory)
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
