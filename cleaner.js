// cleaner.js
let interval = 1000 * 60 * 60 * 24;
let m;

function removeInactiveUsers() {
  m.userDeleteInactive().catch(err => {
    console.log("Unable to remove inactive users from database: \n" + err);
  });
}

function removeOldMessages() {
  m.messageDeleteOld().catch(err => {
    console.log("Unable to remove old messages from database: \n" + err);
  });
}

module.exports.initializeCleaner = function(manager) {
  m = manager;

  setInterval(removeInactiveUsers, interval);
  setInterval(removeOldMessages, interval);
};
