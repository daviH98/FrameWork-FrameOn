const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'imagens')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  });
  
const upload = multer({ storage });

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

app.get('/api/login', function (req,res) {
    let usuario = req.body;
    let sql = `SELECT u.id, u.email FROM usuario u WHERE u.email = ${usuario.email}`;

    conn.query(sql, function (err, result) {
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
        sql = `UPDATE usuario SET email = ${usuario.email}, senha = ${usuario.senha}, WHERE id = ${usuario.id}`;
    } else {
        sql = `INSERT INTO usuario (email,senha) VALUES ('${usuario.email}', '${usuario.senha}')`;
    }

    conn.query(sql, function (err, result) {
        if (err) throw err;
        res.status(200).json(result);
    })
});



//endpoint para resgatar um usuário
app.get('/api/usuario', authenticate, function (req,res) {
    let sql = "SELECT u.id, u.nome FROM usuario u";

    conn.query(sql, function (err, result) {
        if (err) res.status(500).json(err);
        res.status(200).json(result);
    });
});

//endpoint para capturar um usuário por id
app.get('/api/usuario/:id', (req, res) => {
    const { id } = req.params;

    let sql = `SELECT u.id, u.nome, u.email, u.senha FROM usuario u WHERE u.id = ${id}`;
    conn.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result)
        res.status(200).json(result[0]);
    });
});

app.post('/api/upload', upload.single('file'), function (req, res) {
    console.log(req.file);
    res.send('foi')
});

app.get('/api/image',function(req, res){
    //var img = "\\imagens\\"

    res.setHeader('Content-Disposition', 'attachment; filename=vida-de-gato.jpg');
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Length', 13269);

    const fileStream = fs.createReadStream(img);
    fileStream.pipe(res);

    fileStream.on('error', (err) => {
        console.error('Erro no stream: ', err);
        if(!res.headersSent) {
            res.status(500).json({ error: "Erro ao enviar o arquivo."})
        }
    });
});

app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on port", PORT);
})