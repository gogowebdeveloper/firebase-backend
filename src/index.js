import {initializeApp} from "firebase/app"
import {
    getFirestore,collection,onSnapshot,
    addDoc,deleteDoc,doc,
    query,where,
    orderBy,serverTimestamp,
    getDoc,updateDoc
} from "firebase/firestore"
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,signInWithEmailAndPassword,
    onAuthStateChanged
} from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyBJ3Lj-TdkrG-z4fq8QQHUzyvW1_QKZxXQ",
    authDomain: "ganeshms-fb9.firebaseapp.com",
    projectId: "ganeshms-fb9",
    storageBucket: "ganeshms-fb9.appspot.com",
    messagingSenderId: "336485169432",
    appId: "1:336485169432:web:ee4c098034b537ada4066d"
  };

//   initialize firebase app
initializeApp(firebaseConfig)

// init services
const db=getFirestore()
const auth=getAuth()

// collection ref
const colRef=collection(db,"books")

// queries

const q=query(colRef,orderBy("createdAt"))


// get collection data
// getDocs(colRef)
// .then((snapshot)=>{
// let books=[];
// snapshot.docs.map((doc)=>{
//     books.push({...doc.data(),id:doc.id})
// })
// console.log(books);
// }).catch((err)=>{
//     console.log(err);
// })

onSnapshot(q,(snapshot)=>{
    let books=[];
    snapshot.docs.map((doc)=>{
        books.push({...doc.data(),id:doc.id})
    })
    console.log(books);
})

// login for adding and deleting data
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt:serverTimestamp()
  })
  .then(() => {
    addBookForm.reset()
  })
})

const deleteBookForm=document.querySelector(".delete");
deleteBookForm.addEventListener("submit",(e)=>{
e.preventDefault();
// create a ref for the document
// doc(database,collection,id inside the collection)
const docRef=doc(db,'books',deleteBookForm.id.value);
deleteDoc(docRef)
.then(()=>{
    deleteBookForm.reset();
})
})

// get single document
//doc(database,"collection",id to be fetched)
const docRef=doc(db,"books","jb0EW3wx3JELXb0qxLMf");

// reuse the updated data & setting subscription
onSnapshot(docRef,(doc)=>{
    console.log(doc.data(),doc.id);
})

// update form

const updateForm=document.querySelector(".update");
updateForm.addEventListener("submit",(e)=>{
e.preventDefault()
const docRef=doc(db,'books',updateForm.id.value)
updateDoc(docRef,{
    title:"New updated title"
})
.then(()=>{
    updateForm.reset()
})
})

const signupForm=document.querySelector(".signUp");
signupForm.addEventListener("submit",(e)=>{
e.preventDefault()
const email=signupForm.email.value;
const password=signupForm.password.value;

createUserWithEmailAndPassword(auth,email,password)
.then((cred)=>{
console.log("User Created : "+cred.user);
alert("Registered Successfully")
signupForm.reset()
})
.catch((err)=>{
    console.log(err.message);
})
})



// Login and Logout

const logoutButton=document.querySelector(".logout");
logoutButton.addEventListener("click",()=>{
    signOut(auth)
    .then(()=>{
        console.log("User Signed Out");
    }).catch((err)=>{
        console.log(err.message);
    })
})

const loginForm=document.querySelector(".login");
loginForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    const email=loginForm.email.value;
    const password=loginForm.password.value;
    signInWithEmailAndPassword(auth,email,password)
    .then((cred)=>{
        console.log("User logged in:",cred.user);
    })
    .catch((err)=>{
        console.log(err.message);
    })
})
