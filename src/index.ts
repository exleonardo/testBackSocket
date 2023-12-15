import express,{Request,Response} from 'express'
import http from 'http'
import { Server } from 'socket.io';
import cors from 'cors'

const app = express()
const port =process.env.PORT|| 5000
const server = http.createServer(app)
const socket = new Server(server,{cors: {
        origin: "https://chatwebsocket-front.vercel.app/",
        methods: ["GET", "POST"]
    }})


const messages =[{message:'Hello Bomj',id:1, user:{id:1,name:'Dimych'}},{message:'Hello Psina',id:1, user:{id:1,name:'Victor'}}]

app.use(cors())
app.options('*', cors())


socket.on('connection', (connection) => {
    connection.on("connect", () => {
        console.log("a user connected");
        console.log(connection.connected); // true
    });

    connection.on("connect_error", () => {
        console.log("user connect_error");
    });

    connection.on("disconnect", () => {
        console.log(connection.connected); // false
        console.log("user disconnected");
    });

    connection.on("client-message-sent", (msg) => {
        const messageItem = {message:msg,id:1, user:{id:+new Date(),name:'Dimych'}}
        console.log("message: " + msg);
        messages.push(messageItem)
        socket.emit("new-message-sent", messageItem);
    });

    connection.emit("init-messages-published",messages )

    console.log('a user connected',connection.id);
});



const todo = [{id:1,title:'HTML',isDone:false},{id:2,title:'React',isDone:false},{id:3,title:'CSS',isDone:false},{id:4,title:'JS',isDone:false}]
const address = [{value:'Novaya Borovaya'},{value:"Prospect pushkina",}]

socket.on('connection', (connection) => {

    console.log('a user connected',connection.id);
});




app.get('/', (req:Request, res:Response) => {

    res.send('Hello')
})

app.get('/prod', (req:Request, res:Response) => {
    if(req.query.title){
        const title =req.query.title.toString()
        const todos = todo.filter(todo=>todo.title.indexOf(title)>-1)
        res.send(todos)
    }else{
        res.send(todo)
    }
})
app.get('/prod/:todo', (req:Request, res:Response) => {
    const todos = todo.find(todo=>todo.title === req.params.todo)
    if(todos){
        res.send(todos)
    }else{
        // res.send(404)
        res.send(404)
    }
})
app.delete('/prod/:id', (req:Request, res:Response) => {
    let todos = todo.findIndex(todo=>(todo.id === +req.params.id))
    if(todos >-1){
        todo.splice(todos,1)
        res.send(204)
    }
    res.send(404)
})
app.post('/prod', (req:Request, res:Response) => {
    console.log (req.body.title)
    const newTodo = {id:+(new Date()),title:req.body.title,isDone:false}
    todo.push(newTodo)
    res.status(201).send(newTodo)
})

app.get('/address', (req:Request, res:Response) => {
    res.send(address)
})

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
