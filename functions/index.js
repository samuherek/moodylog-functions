const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const { auth } = functions;
const { firestore } = admin;
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

exports.createProfile = auth.user().onCreate(user => {
  console.log('Creating profile...');
  const { email, displayName, uid } = user;

  const profile = {
    email,
    displayName: displayName || 'Anonymous',
    logs: [{ id: 'mood', name: 'Mood', createdAt: new Date(), active: true }]
  };

  return firestore()
    .collection(`users`)
    .doc(uid)
    .set(profile)
    .then(result => {
      console.log('SUCCESS: user created:', result);
      return;
    })
    .catch(err => {
      console.error('ERROR: user creation:', err);
      return;
    });
});

exports.deleteProfile = auth.user().onDelete(user => {
  console.log('Deleting profile...', user);
  return firestore()
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
