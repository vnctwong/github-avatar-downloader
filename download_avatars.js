var request = require('request');
console.log('Welcome to the GitHub Avatar Downloader!');
var fs = require('fs');
var token = require('./secret.js').GITHUB_TOKEN;
var repoOwner = process.argv[2];
var repoName = process.argv[3];



function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      Authorization: `token ${token}` //'3692d94756cda12e2fed084560e39a8dda73ff2a'
    }
  };

  request(options, function (err, res, body) {
    cb(err, body); //body parsed into obj

  });
}


getRepoContributors(repoOwner, repoName, function (err, result) {
  if (repoOwner === undefined || repoName === undefined) {
    console.log('Errors:', err);
    throw err;
  } else {
    var list = JSON.parse(result); // returns result as obj

    //loop results and print avatar_url value

    list.forEach(function (i) {
      //console.log(['avatar_url']) //^ this gets the data, .get? how to fs?
      avatar_url = i.avatar_url;
      userName = i.login + '.jpg';
      avatarUrlRequestPackage(avatar_url, userName)
    });
  }
});

function avatarUrlRequestPackage(url, filePath) {
  let path = './avatars/'
  request
    .get(url)
    .onRequestError('error', function (err) {
      throw err;
    })
    .on('response', function (response) {
      console.log('Response Status Code: ', response.statusCode);
    })
    .pipe(fs.createWriteStream(path + filePath));
}