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

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadFolder)
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + Date.now()+ ext)
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

app.post('/api/login', function (req,res) {
    let usuario = req.body;
    let sql = `SELECT u.id, u.email, u.senha FROM usuario u WHERE u.email = ${usuario.email}, u.senha = ${usuario.senha}`;

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
        sql = `UPDATE usuario SET
        nome = ${usuario.nome}
        email = ${usuario.email}, 
        senha = ${usuario.senha},
        dOB = ${usuario.dOB},
        img = ${usuario.img} 
        WHERE id = ${usuario.id}`;
    } else {
        sql = `INSERT INTO usuario (nome,email,senha, dOB, img) VALUES ('${usuario.nome}','${usuario.email}', '${usuario.senha}', '${usuario.dOB}', '${usuario.img}')`;
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