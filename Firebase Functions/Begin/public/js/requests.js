const ref = firebase.firestore().collection('requests').orderBy('upvotes', 'desc');
const requestList = document.querySelector('.request-list');

function renderRequests(request){
    let li = document.createElement('li');
    let text = document.createElement('span');
    let div = document.createElement('div');
    let votes = document.createElement('span');
    let icon = document.createElement('i');

    li.setAttribute('data-id', request.id);
    text.classList.add('text');
    text.textContent = request.text;
    votes.classList.add('votes');
    votes.textContent = request.upvotes;
    icon.classList.add('material-icons', 'upvote');
    icon.textContent = 'arrow_upward';
    div.appendChild(votes);
    div.appendChild(icon);
    li.appendChild(text);
    li.appendChild(div);
    requestList.appendChild(li);

    icon.addEventListener('click', (event) => {
        let upvote = firebase.functions().httpsCallable('upvote');
        upvote({ id: event.target.parentElement.parentElement.getAttribute('data-id') }).catch(err => {
            showNotification(err.message);
        });
    });
}

ref.onSnapshot(snapshot => {
    // let requests = [];
    // snapshot.forEach(doc => {
    //     requests.push({...doc.data(), id: doc.id});
    // });
    
    // requests.forEach(request => {
    //     renderRequests(request);
    // });
    // requests = [];

    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            renderRequests({...change.doc.data(), id: change.doc.id});
        } else if(change.type == 'modified'){
            let li = requestList.querySelector('[data-id='+change.doc.id+']');
            requestList.removeChild(li);
            renderRequests({...change.doc.data(), id: change.doc.id});
        } else if(change.type == 'removed'){
            let li = requestList.querySelector('[data-id='+change.doc.id+']');
            requestList.removeChild(li);
        }
    })
});