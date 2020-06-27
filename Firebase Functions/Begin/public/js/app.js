const requestModal = document.querySelector('.new-request');
const requestLink = document.querySelector('.add-request');
const requestForm = document.querySelector('.new-request form');
const notification = document.querySelector('.notification');

requestLink.addEventListener('click', () => {
    requestModal.classList.add('open');
});

requestModal.addEventListener('click', (event) => {
    if(event.target.classList.contains('new-request')){
        requestModal.classList.remove('open');
    }
});

requestForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const addRequest = firebase.functions().httpsCallable('addRequest');
    addRequest({
        text: requestForm['request'].value
    }).then(() => {
        requestForm.reset();
        requestModal.classList.remove('open');
        requestForm.querySelector('.error').textContent = '';
    }).catch(err => {
        requestForm.querySelector('.error').textContent = err.message;
    });
})

// //Say hello button
// const button = document.querySelector('.call');
// button.addEventListener('click', () => {
//     const sayHello = firebase.functions().httpsCallable('sayHello');
//     sayHello({ name: 'Suman' }).then(result => {
//         window.alert(result.data);
//     });
// });

const showNotification = (message) => {
    notification.textContent = message;
    notification.classList.add('active');
    setTimeout(() => {
        notification.textContent = '';
        notification.classList.remove('active');
    }, 3000);
}