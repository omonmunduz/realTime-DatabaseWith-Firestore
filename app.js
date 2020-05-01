const cafeList = document.querySelector('#cafe-list'); // we will place our populated data here
const form = document.querySelector('#add-cafe-form');  // we get our input from here

// function for creating new elements based on provided docs.data()
const renderCafe = (doc) => {
    const li = document.createElement('li');
    const name = document.createElement('span');
    const city = document.createElement('span');
    const cross = document.createElement('div');

    li.setAttribute('data-id',doc.id); // give id with data-id attribute to each li tag
    name.textContent = doc.data().name; // use .data()  to access values
    city.textContent = doc.data().city; 
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);
    cafeList.appendChild(li);

    // delete selected item
    cross.addEventListener('click',(e)=>{
        e.stopPropagation(); // stop propagation of the event so it doesn't bubble up
        let id = e.target.parentElement.getAttribute('data-id'); // get id of clicked li tag
        db.collection('cafes').doc(id).delete(); // doc() lets you pick a file we need, then we pass id inside
    })
}

/*
At the bottom of file;
Call  it orderBy and by looking at change.type and onSnapshot to listen to changes in our database.

normal way to read data from db
db.collection('cafes').get().then((snapshot)=>{ /// handle async code 
    snapshot.docs.forEach(doc => { // doc is each individual element that we get 
        renderCafe(doc) // call renderCafe function for all docs
    });
    });
*/

//saving data
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    db.collection('cafes').add({
        name:form.name.value,
        city:form.city.value
    })
    form.name.value = '';
    form.name.city = '';
})

// real-time listener
db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if(change.type == 'added'){
            renderCafe(change.doc);
        } else if (change.type == 'removed'){
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
            cafeList.removeChild(li);
        }
    });
});