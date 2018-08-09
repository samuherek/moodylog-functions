const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.createProfile = functions.auth.user().onCreate(user => {
  // Do something after a new user account is created
  console.log('creating a new account???', user);

  const profile = {
    email: user.email,
    displayName: user.displayName
  };

  return admin
    .firestore()
    .collection(`users`)
    .doc(user.uid)
    .set(profile)
    .then(result => {
      console.log('SUCCESS: user created:', result);
      return;
    })
    .catch(err => {
      console.log('ERROR: user creation:', err);
      return;
    });
});
