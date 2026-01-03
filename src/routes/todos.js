const express = require('express');
const router = express.Router();
const todoController = require('../controllers/TodoController');

// 一覧表示
router.get('/', (req, res) => todoController.index(req, res));

// 新規作成フォーム
router.get('/todos/new', (req, res) => todoController.create(req, res));

// 新規作成処理
router.post('/todos', (req, res) => todoController.store(req, res));

// 編集フォーム
router.get('/todos/:id/edit', (req, res) => todoController.edit(req, res));

// 更新処理
router.post('/todos/:id', (req, res) => todoController.update(req, res));

// 削除処理
router.post('/todos/:id/delete', (req, res) => todoController.destroy(req, res));

module.exports = router;
