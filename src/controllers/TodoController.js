const { getDatabase } = require('../../data/database');

class TodoController {
  // 一覧表示
  async index(req, res) {
    const db = getDatabase();
    
    const sql = `
      SELECT * FROM todos 
      ORDER BY 
        CASE priority 
          WHEN 'high' THEN 1 
          WHEN 'medium' THEN 2 
          WHEN 'low' THEN 3 
          ELSE 4 
        END,
        deadline ASC
    `;
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('データベースエラー');
        return;
      }
      
      db.close();
      res.render('index', { todos: rows });
    });
  }

  // 新規作成フォーム表示
  create(req, res) {
    res.render('form', { todo: null, action: '/todos', method: 'POST' });
  }

  // 新規作成処理
  async store(req, res) {
    const { title, content, deadline, priority } = req.body;
    const db = getDatabase();
    
    const sql = 'INSERT INTO todos (title, content, deadline, priority) VALUES (?, ?, ?, ?)';
    db.run(sql, [title, content, deadline, priority || 'medium'], function(err) {
      if (err) {
        console.error(err.message);
        db.close();
        res.status(500).send('作成エラー');
        return;
      }
      
      db.close();
      res.redirect('/');
    });
  }

  // 編集フォーム表示
  async edit(req, res) {
    const { id } = req.params;
    const db = getDatabase();
    
    db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error(err.message);
        db.close();
        res.status(500).send('データベースエラー');
        return;
      }
      
      if (!row) {
        db.close();
        res.status(404).send('ToDoが見つかりません');
        return;
      }
      
      db.close();
      res.render('form', { todo: row, action: `/todos/${id}`, method: 'POST' });
    });
  }

  // 更新処理
  async update(req, res) {
    const { id } = req.params;
    const { title, content, deadline, priority } = req.body;
    const db = getDatabase();
    
    const sql = 'UPDATE todos SET title = ?, content = ?, deadline = ?, priority = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    db.run(sql, [title, content, deadline, priority || 'medium', id], function(err) {
      if (err) {
        console.error(err.message);
        db.close();
        res.status(500).send('更新エラー');
        return;
      }
      
      db.close();
      res.redirect('/');
    });
  }

  // 削除処理
  async destroy(req, res) {
    const { id } = req.params;
    const db = getDatabase();
    
    db.run('DELETE FROM todos WHERE id = ?', [id], function(err) {
      if (err) {
        console.error(err.message);
        db.close();
        res.status(500).send('削除エラー');
        return;
      }
      
      db.close();
      res.redirect('/');
    });
  }
}

module.exports = new TodoController();
