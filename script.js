<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PartNet - Соцсеть будущего</title>
    <link rel="stylesheet" href="style.css">

    <!-- Подключаем Firebase через CDN -->
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js"></script>
</head>
<body>

    <header>
        <h1>PartNet</h1>
        <button class="login-btn" onclick="toggleLogin()">Войти</button>
    </header>

    <main>
        <div class="container">
            <div class="post-box">
                <textarea id="postInput" placeholder="О чём думаешь?" maxlength="200"></textarea>
                <button class="post-btn" onclick="addPost()">➤ Опубликовать</button>
            </div>

            <div id="posts">
                <!-- Посты появятся тут -->
            </div>
        </div>
    </main>

    <!-- Окно входа/регистрации -->
    <div id="authModal" class="modal">
        <div class="modal-content">
            <h2>Вход в PartNet</h2>
            <input type="text" id="username" placeholder="Email">
            <input type="password" id="password" placeholder="Пароль">
            <button onclick="login()">Войти</button>
            <button onclick="register()">Регистрация</button>
            <p id="authMessage"></p>
        </div>
    </div>

    <!-- Подключаем основной скрипт -->
    <script src="script.js"></script>
</body>
</html>
