const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// exports.randomNumber = functions.https.onRequest((request, response) => {
//     const number = Math.round(Math.random() * 100);
//     response.send(number.toString());
// });

// exports.Redirect = functions.https.onRequest((request, response) => {
//     response.redirect('https://coronavirus-tracker-a4f64.web.app');
// });

// exports.sayHello = functions.https.onCall((data, context) => {
//     return `hello ${data.name}`;
// });

exports.newUserSignup = functions.auth.user().onCreate(user => {
    return admin.firestore().collection('users').doc(user.uid).set({
        email: user.email,
        upvotedOn: []
    });
});

exports.userDelete = functions.auth.user().onDelete(user => {
    return admin.firestore().collection('users').doc(user.uid).delete();
});

exports.addRequest = functions.https.onCall((data, context) => {
    if(!context.auth){
        throw new functions.https.HttpsError(
            'unauthenticated',
            'You must Log In to add a request'
        );
    }
    if(data.text.length > 30){
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Request text must be less than 30 characters long'
        );
    }
    return admin.firestore().collection('requests').add({
        text: data.text,
        upvotes: 0
    });
});

exports.upvote = functions.https.onCall(async (data, context) => {
    if(!context.auth){
        throw new functions.https.HttpsError(
            'unauthenticated',
            'You must Log In to add a request'
        );
    }

    const user = admin.firestore().collection('users').doc(context.auth.uid);
    const request = admin.firestore().collection('requests').doc(data.id);

    const doc = await user.get();

    if(doc.data().upvotedOn.includes(data.id)){
        throw new functions.https.HttpsError(
            'failed-precondition',
            'You have already upvoted this'
        );
    }
        
    if(doc.data().upvotedOn.includes(data.id)){
        throw new functions.https.HttpsError(
            'failed-precondition',
            'You have already upvoted this'
        );
    }

    await user.update({
        upvotedOn: [...doc.data().upvotedOn, data.id]
    });

    return request.update({
        upvotes: admin.firestore.FieldValue.increment(1)
    });
});

//fireSTORE triggers for tracking activities
exports.logActivities = functions.firestore.document('/{collection}/{id}').onCreate((snap, context) => {
    console.log(snap.data());
    const collection = context.params.collection;
    const id = context.params.id;

    const activities = admin.firestore().collection('activities');

    if(collection === 'requests'){
        return activities.add({ text: 'A new tutorial request' });
    }
    if(collection === 'users'){
        return activities.add({ text: 'A new User signed Up' });
    }
    return null;
})