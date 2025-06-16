const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

const uploadFolder = path.join(__dirname, 'imagens');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

app.use('/imagens', express.static(path.join(__dirname, 'imagens')));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadFolder)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  
const upload = multer({ storage: storage });

// require('dotenv').config();

var conn = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"PUC@1234",
    database:"web25"
});

conn.connect(function (err) {
    if (err) throw err;
    console.log("SQL Connected!")
});

const generateToken = (id, email) => {
    return jwt.sign({id: id, email: email}, 'meusegredoabc', {
        expiresIn: '1h'
    });
}

const verifyToken = (token) => {
    return jwt.verify(token, 'meusegredoabc');
};

// USUÁRIOS ---------------------------------------------------------------------------------

app.post('/api/login', function (req,res) {
    let usuario = req.body;
    const sql = `SELECT u.id, u.email, u.senha FROM usuario u WHERE u.email = ? AND u.senha = ?`;

    conn.query(sql, [usuario.email, usuario.senha], function (err, result) {
        if(err) throw err;
        usuario.id = result[0].id;
        usuario.senha = result[0].senha;
    });

    token = generateToken(usuario.id, usuario.email);
    res.json({token: token});
})

function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    
    try {
      const decoded = verifyToken(token);
      req.userId = decoded.id;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Token inválido' });
    }
  }

//endpoint para cadastrar um usuário
app.post('/api/usuario', function (req,res) {
    var usuario = req.body;
    var sql = '';
    if(usuario.id) {
        sql = `UPDATE usuario SET
        nome = ${usuario.nome}
        email = ${usuario.email}, 
        senha = ${usuario.senha},
        dOB = ${usuario.dOB},
        img = ${usuario.img} 
        WHERE id = ${usuario.id}`;
    } else {
        sql = `INSERT INTO usuario (nome, email, senha, dOB, img) VALUES ('${usuario.nome}','${usuario.email}', '${usuario.senha}', '${usuario.dOB}', '${usuario.img}')`;
    }

    conn.query(sql, function (err, result) {
        if (err) throw err;
        res.status(200).json(result);
    })
});



//endpoint para resgatar um usuário
app.get('/api/usuario', authenticate, function (req,res) {
    let sql = "SELECT u.id, u.nome, u. email, u.senha, u.dOB, u.img FROM usuario u";
    conn.query(sql, function (err, result) {
        if (err) res.status(500).json(err);
        res.status(200).json(result);
    });
});

//endpoint para capturar um usuário por id
app.get('/api/usuario/:id', authenticate, (req, res) => {
    const { id } = req.params;

    let sql = `SELECT u.id, u.nome, u.email, u.senha, u.img, u.dOB FROM usuario u WHERE u.id = ${id}`;
    conn.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result)
        res.status(200).json(result[0]);
    });
});

//endpoint para capturar um filme por id
app.delete('/api/usuario/:id', authenticate, (req, res) => {
    const { id } = req.params;

    let sql = `DELETE FROM USUARIO WHERE ID = ${id}`;
    conn.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result)
        res.status(200).json(result[0]);
    });
});

// ---------------------------------------------------------------------------------

// FILMES ---------------------------------------------------------------------------------

//endpoint para cadastrar um filme
app.post('/api/filme', function (req,res) {
    var filme = req.body;
    filme.categoria_id = filme.categoria_id || filme.categoriaId;
    var sql = '';
    if(filme.id) {
        sql = `UPDATE filme SET
        nome = ?,
        ano = ?,
        capa = ?,
        categoria_id = ?
        WHERE id = ?`;
    } else {
        sql = `INSERT INTO filme (nome,ano,capa,categoria_id) VALUES (?,?,?,?)`;
    }

    conn.query(sql, [filme.nome, filme.ano, filme.capa, filme.categoria_id], function (err, result) {
        if (err) throw err;
        res.status(200).json(result);
    })
});

//endpoint para resgatar um filme
app.get('/api/filme', function (req,res) {
    let sql = `SELECT f.id, f.nome, f.ano, f.capa, c.nome AS categoria
    FROM filme f
    LEFT JOIN categoria c ON f.categoria_id = c.id`;
    conn.query(sql, function (err, result) {
        if (err) res.status(500).json(err);
        res.status(200).json(result);
    });
});

//endpoint para capturar um filme por id
app.get('/api/filme/:id', (req, res) => {
    const { id } = req.params;

    let sql = `SELECT f.id, f.nome, f.ano, f.capa, c.nome AS categoria FROM filme f LEFT JOIN categoria c ON f.categoria_id = c.id WHERE f.id = ?`;
    conn.query(sql, [id], function (err, result) {
        if (err) throw err;
        console.log(result)
        res.status(200).json(result[0]);
    });
});

//endpoint para capturar um filme por id
app.delete('/api/filme/:id', authenticate, (req, res) => {
    const { id } = req.params;

    let sql = `DELETE FROM FILME WHERE ID = ${id}`;
    conn.query(sql, function (err, result) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro interno no servidor.' });
          }
      
          if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Filme não encontrado.' });
          }
      
          res.status(200).json({ message: 'Filme deletado com sucesso.' });
        });
});

// ---------------------------------------------------------------------------------

// CATEGORIAS ---------------------------------------------------------------------------------

//endpoint para cadastrar uma categoria
app.post('/api/categoria', authenticate, function (req, res) {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ error: 'Nome da categoria obrigatório' });
  
    conn.query('INSERT INTO categorias (nome) VALUES (?)', [nome], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao inserir categoria' });
        res.json({ id: result.insertId, nome });
      });
  });
  
// Listar todas as categorias
app.get('/api/categorias', function (req, res) {
    const sql = 'SELECT * FROM categoria';
  
    conn.query(sql, function (err, result) {
      if (err) {
        console.error('Erro ao buscar categorias:', err);
        res.status(500).json({ error: 'Erro ao buscar categorias' });
      } else {
        res.json(result);
      }
    });
  });

// Buscar categoria por ID
app.get('/api/categoria/filme/:filmeID', authenticate, function (req, res) {
    const { filmeID } = req.params;
    const sql = `SELECT * FROM CATEGORIA WHERE filmeID = ${filmeID}`;
    conn.query(sql, function (err, result) {
      if (err) return res.status(500).json(err);
      res.status(200).json(result);
    });
  });

// Deletar categoria
app.delete('/api/categoria/:filmeID', authenticate, function (req, res) {
    const { id } = req.params;

    const sql = `DELETE FROM CATEGORIA WHERE id = ${id}`;
    conn.query(sql, function (err, result) {
    if (err) return res.status(500).json({ message: 'Erro ao deletar categoria' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Categoria não encontrada' });

    res.status(200).json({ message: 'Categoria deletada com sucesso' });
    });
});

// ---------------------------------------------------------------------------------

app.post('/api/upload', upload.single('file'), function (req, res) {
    if (!req.file) return res.status(400).send('Nenhum arquivo enviado');
  
    res.status(200).json({ filename: req.file.filename });
});

app.get('/api/image',function(req, res){
    const img = path.join(__dirname, 'imagens', 'vida-de-gato.jpg');

    fs.access(img, fs.constants.F_OK, (err) => {
    if(err) {
      return res.status(404).send('Arquivo não encontrado');
    }

    res.setHeader('Content-Disposition', 'attachment; filename=vida-de-gato.jpg');
    res.setHeader('Content-Type', 'image/jpeg');

    const fileStream = fs.createReadStream(img);
    fileStream.pipe(res);

    fileStream.on('error', (err) => {
        console.error('Erro no stream: ', err);
        if(!res.headersSent) {
            res.status(500).json({ error: "Erro ao enviar o arquivo."})
        }
    });
  });
});

app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on port", PORT);
})