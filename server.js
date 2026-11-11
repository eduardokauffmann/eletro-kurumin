const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Liga ao MySQL do XAMPP
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'eletro_kurumin'
});

// Login
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;
    db.query('SELECT * FROM usuario WHERE email = ?', [email], (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ error: 'Erro no login' });
        res.json({ usuario: results[0].nome });
    });
});

// Listar Componentes (CRUD - Read)
app.get('/api/componentes', (req, res) => {
    const sql = 'SELECT c.*, cat.nome AS categoria FROM componente c JOIN categoria cat ON c.id_categoria = cat.id_categoria';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Criar Componente (CRUD - Create)
app.post('/api/componentes', (req, res) => {
    const { id_categoria, nome, preco, quantidade_estoque } = req.body;
    const sql = 'INSERT INTO componente (id_categoria, id_usuario, nome, preco, quantidade_estoque) VALUES (?, 1, ?, ?, ?)';
    db.query(sql, [id_categoria, nome, preco, quantidade_estoque], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ ok: true });
    });
});

// Eliminar Componente (CRUD - Delete)
app.delete('/api/componentes/:id', (req, res) => {
    db.query('DELETE FROM componente WHERE id_componente = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ ok: true });
    });
});

app.listen(3000, () => console.log('Servidor em http://localhost:3000'));