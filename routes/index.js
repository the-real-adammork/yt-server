var express = require('express');
var router = express.Router();
const { exec } = require("child_process");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({"status":"success"});
});

router.post('/', function(req, res, next) {
  console.log(req.body)

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

  execShellCommand("ls -la").then(
    result => { 
      console.log(result)
      res.json({hello:'success'});
    }
  ).catch(
    error => {
      console.error(error)
      res.json({hello:'error'});
    }
  );
});


module.exports = router;
