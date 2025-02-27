// Инициализация Firebase
var firebaseConfig = {
    apiKey: "AIzaSyDUn0QjsY8GYRuuFGzOMmloeJegtxxMZCc",
    authDomain: "reaversocial.firebaseapp.com",
    projectId: "reaversocial",
    storageBucket: "reaversocial.firebasestorage.app",
    messagingSenderId: "461982892032",
    appId: "1:461982892032:web:5327c7e66a4ddddff1d8e5",
    measurementId: "G-CD344TGD2D"
};
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var db = firebase.firestore();

function escapeHTML(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function addPost() {
    var input = document.getElementById("postInput");
    var text = input.value.trim();

    if (text === "") {
        alert("Пост не может быть пустым!");
        return;
    }

    const safeText = escapeHTML(text);

    db.collection("posts").add({
        text: safeText,
        likes: 0,
        comments: [],
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.log("Пост добавлен!");
        input.value = "";
    }).catch(error => {
        console.error("Ошибка добавления поста: ", error);
    });
}

function loadPosts() {
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "<p>Загрузка постов...</p>";

    db.collection("posts")
        .orderBy("timestamp", "desc")
        .onSnapshot(function(snapshot) {
            postsContainer.innerHTML = "";

            if (snapshot.empty) {
                postsContainer.innerHTML = "<p>Нет постов.</p>";
                return;
            }

            snapshot.forEach(function(doc) {
                const post = doc.data();
                const postElement = document.createElement("div");
                postElement.classList.add("post");
                postElement.id = doc.id;

                const timestamp = post.timestamp?.seconds
                    ? new Date(post.timestamp.seconds * 1000).toLocaleString()
                    : new Date().toLocaleString();

                const textPara = document.createElement("p");
                textPara.textContent = post.text;

                const smallDate = document.createElement("small");
                smallDate.textContent = `Дата: ${timestamp}`;

                const likeButton = document.createElement("button");
                likeButton.classList.add("like-btn");
                likeButton.textContent = `👍 Лайк (${post.likes})`;
                likeButton.onclick = () => likePost(doc.id);

                postElement.appendChild(textPara);
                postElement.appendChild(smallDate);
                postElement.appendChild(likeButton);
                postsContainer.appendChild(postElement);
            });
        }, function(error) {
            console.error("Ошибка при загрузке постов: ", error);
            postsContainer.innerHTML = "<p>Ошибка загрузки.</p>";
        });
}

function likePost(postId) {
    const postRef = db.collection("posts").doc(postId);

    postRef.get().then(doc => {
        if (doc.exists) {
            const postData = doc.data();
            const newLikes = postData.likes + 1;

            postRef.update({
                likes: newLikes
            }).then(() => {
                console.log("Лайк добавлен!");
            }).catch(error => {
                console.error("Ошибка при добавлении лайка: ", error);
            });
        }
    });
}


window.onload = function() {
    loadPosts();
};

// Функция входа
function login() {
    var email = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value.trim();
    if (!email || !password) {
        showMessage("Заполните все поля!", "red");
        return;
    }
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            showMessage(`Добро пожаловать, ${email}!`, "green");
            closeModal();
            document.querySelector(".login-btn").innerText = email;
        })
        .catch(error => {
            showMessage(error.message, "red");
        });
}

// Функция регистрации
function register() {
    var email = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value.trim();
    if (!email || !password) {
        showMessage("Заполните все поля!", "red");
        return;
    }
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            showMessage("Регистрация успешна!", "green");
            closeModal();
        })
        .catch(error => {
            showMessage(error.message, "red");
        });
}

// Функция отображения сообщений
function showMessage(text, color) {
    var msg = document.getElementById("authMessage");
    msg.innerText = text;
    msg.style.color = color;
}

// Открытие окна входа
function toggleLogin() {
    document.getElementById("authModal").style.display = "flex";
}

// Закрытие окна входа
function closeModal() {
    document.getElementById("authModal").style.display = "none";
}
