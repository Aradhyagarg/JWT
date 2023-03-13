const express = require('express');
const app = express();
require('dotenv').config();
const jwt = require('jsonwebtoken')
const posts = [
    {
        username:"aradhya",
        title:"post1"
    },
    {
        username:"rishi",
        title:"post2"
    }
]

app.get('/posts',authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user?.name))
})

app.post('/login', (req, res) =>{ 
    const username = req.body.username
    const user = {name: username}
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN)
    res.json({accessToken:accessToken})


})

function authenticateToken (req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log('token:', token)
    if (token == null) return res.sendStatus (401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log('JWT verification failed:', err.message)
            return res.sendStatus (403)
        }
        console.log('JWT payload:', user)
        req.user = user
        next()
    })
}
app.listen(3000);