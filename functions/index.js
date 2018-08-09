const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const { auth } = functions;
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.createProfile = auth.user().onCreate(user => {
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

exports.deleteProfile = auth.user().onDelete(user => {
  console.log('deleting an account', user);
  return admin
    .firestore()
    .collection('users')
    .doc(user.uid)
    .delete()
    .then(() => {
      console.log('user deleted!');
      return;
    })
    .catch(error => {
      console.error('error removing user', error);
    });
});
