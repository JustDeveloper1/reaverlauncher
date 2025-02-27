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

// Корректная защита от XSS (не ломает HTML)
function escapeHTML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function addPost() {
    var input = document.getElementById("postInput");
    var text = input.value.trim();

    if (text === "") {
        alert("Пост не может быть пустым!");
        return;
    }

    const safeText = escapeHTML(text).replace(/\n/g, "<br>");

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
        .onSnapshot(snapshot => {
            postsContainer.innerHTML = "";

            if (snapshot.empty) {
                postsContainer.innerHTML = "<p>Нет постов в базе данных.</p>";
                return;
            }

            snapshot.forEach(doc => {
                const post = doc.data();
                const postElement = document.createElement("div");
                postElement.classList.add("post");
                postElement.id = doc.id;

                const timestamp = post.timestamp?.seconds
                    ? new Date(post.timestamp.seconds * 1000).toLocaleString()
                    : new Date().toLocaleString();

                postElement.innerHTML = `
                    <p>${post.text}</p>
                    <small>Дата: ${timestamp}</small>
                    <div>
                        <button class="like-btn" onclick="likePost('${doc.id}')">👍 Лайк (${post.likes})</button>
                    </div>
                `;

                postsContainer.appendChild(postElement);
            });
        }, error => {
            console.error("Ошибка при загрузке постов: ", error);
            postsContainer.innerHTML = "<p>Ошибка загрузки постов.</p>";
        });
}

// Функция для добавления лайка
function likePost(postId) {
    const postRef = db.collection("posts").doc(postId);

    postRef.get().then(doc => {
        if (doc.exists) {
            const postData = doc.data();
            postRef.update({ likes: postData.likes + 1 })
                .then(() => console.log("Лайк добавлен!"))
                .catch(error => console.error("Ошибка при добавлении лайка: ", error));
        }
    });
}

// Загрузка постов при загрузке страницы
window.onload = loadPosts;

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
        .catch(error => showMessage(error.message, "red"));
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
        .catch(error => showMessage(error.message, "red"));
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
