const express= require('express');
const app= express();
require('dotenv').config();

const port= process.env.PORT || 3001

// middleware
app.use(express.json());

app.get('/', (req,res)=>{
    res.send('Jai Shree Ram');
})

// db
require('./db/DB');

// routes
app.use('/api/users', require('./routes/user'));

app.listen(port, ()=>{
    console.log(`server is running on http://localhost:${port}`);
})

