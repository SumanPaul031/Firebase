const authSwitchLinks = document.querySelectorAll('.switch');
const authModals = document.querySelectorAll('.auth .modal');
const authWrapper = document.querySelector('.auth');
const registerForm = document.querySelector('.register');
const loginForm = document.querySelector('.login');
const signOut = document.querySelector('.sign-out');

authSwitchLinks.forEach(link => {
    link.addEventListener('click', () => {
        authModals.forEach(modal => modal.classList.toggle('active'));
    });
});

registerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = registerForm['email'].value;
    const password = registerForm['password'].value;

    firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
        registerForm.reset();
        registerForm.querySelector('.error').textContent = '';
    }).catch(err => {
        registerForm.querySelector('.error').textContent = err.message;
    });
});

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = loginForm['email'].value;
    const password = loginForm['password'].value;

    firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
        console.log(user);
        loginForm.reset();
        loginForm.querySelector('.error').textContent = '';
    }).catch(err => {
        loginForm.querySelector('.error').textContent = err.message;
    });
});

firebase.auth().onAuthStateChanged((user) => {
    if(user){
        authWrapper.classList.remove('open');
        authModals.forEach(modal => modal.classList.remove('active'));
    } else{
        authWrapper.classList.add('open');
        authModals[0].classList.add('active');
    }
});

signOut.addEventListener('click', () => {
    firebase.auth().signOut().then(() => console.log('Signed Out'));
})