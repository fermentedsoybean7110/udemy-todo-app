const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { initializeDatabase } = require('../data/database');
const todoRoutes = require('./routes/todos');

const app = express();
const PORT = 3000;

// データベース初期化
initializeDatabase();

// ビューエンジン設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ミドルウェア
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ルート
app.use('/', todoRoutes);

// サーバー起動
app.listen(PORT, () => {
  console.log(`ToDo アプリが http://localhost:${PORT} で起動しました`);
});
