const express = require('express');
const res = require('express/lib/response');
const app = express(); 
const http = require('url');
const middleware = require('./middleware');
const cors = require('cors');
app.use(express.json() ); 

const teacher = require('./teachers');

app.use('/api/teachers',teacher);

app.get('/',(req,res) => {
    res.send("welcome to Lucid...");
})


app.use(cors() );

const port = process.env.PORT || 80;
app.listen(port, () => console.log(`listening on port ${port}...`));


















// const userOperation = require('./database');
// app.post('/addUser', async (req,res) =>{
//     console.log(req.body);

//     try 
//     {
//         const x = await userOperation.addUser(req.body,res);
//         res.send("done");
//     }
//     catch(err)
//     {
//         console.log(err.message);
//     }
    
// })



// // const homepage = require('./homepage');
// // const addLeave = require('./req-leave');
// // const prevLeaves = require('./prevleaves');
// // app.use('/',homepage);
// // app.use('/api/reqLeave',addLeave);
// // app.use('/api/prevLeave',prevLeaves);
