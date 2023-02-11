// 153. installed mongoose to interact with mongoDB
const mongoose = require('mongoose')
// 156. getting DocSchema
const Document = require('./DocSchema')

// 154. creating connections with mongodb
mongoose.connect("mongodb://localhost/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModified: false,
    useCreateIndex: true,

}).then(console.log("connected to mongodb!!!"))

// 51. importing from socket.io which is actually a function
// 52. socket.io is actually a function so first thing you will pass is the port where you will run your code.
// 53. i.e, 3001. Our client is on port 3000.
// 54. since our client and sever are on diff URLs, we will use CORS here.
// 55. CORS: Cross Origin Request Support. This allows us to make req from diff URL to a diff URL.
const io = require('socket.io')(3001, {
    cors: {
        // 56. all we have to specify origin where our actual client is
        origin: "http://localhost:3000",
        // 57. and we need to specify what methods we are going to allow to go through.
        // 58. in our case we are allowing GET and POST req.
        methods: ['GET', 'POST']
    },
})


// 161. creating a default value
    // an empty string for now
    const defaultValue = ""


//59. now this io object will allow us to do our connections
// 60. every time our client connects, it's going to run this io connection.
// 70. and it will give us this socket
/*io.on('connection', socket => {
    // 106. listening to the changes/delta by quill from client
    socket.on('send-changes', delta => {
        // 107. this will log all the changes bought by the delta from quill sent to us with a location also.
         // console.log(delta)
         // 108. now actually sending the changes back to other clients and passing the delta in it.
         // 109. so it is broadcasting the changes to every one else except us on our current socket.
        socket.broadcast.emit('receive-changes', delta)
    })
    // 71. this io is how we communicate back to our client
    console.log('connected!!!')
})*/

// 136. same copy of above function but a bit modified
io.on("connection", socket =>{
    // 137. receiving the documentId
    socket.on("get-document", async documentId =>{
    // 157. so whenever i find a document or create it from scratch

        // 138. for now our data is just an empty string
        // const data = " "
        // 161. now passing our default data here
        const document = await findOrCreateDoc(documentId)
        // 139. making sure that the socket joins a room for this doc id
            // 140. with this we are putting this socket in its own room and
                // 150. based on that room, everyone in this room can communicate
        socket.join(documentId)
        // 152. also emitting out our correct data
        // 162. returning document.data now
        socket.emit("load-document", document.data)

        // 151. emitting to that doc id this time.
        socket.on("send-changes", delta =>{
            socket.broadcast.to(documentId).emit("receive-changes", delta)
        })
        // 163. saving our document
            // 164. this is going to be an async function and taking the entire document as data
            socket.on('save-document', async data => {
                // 164. saving
                await Document.findByIdAndUpdate(documentId, {data})
            })
            // 165. now this is something we can call from our client
                // 166. so lets go to client.
    })
    console.log('connected!!!')
})
// 72. but right now we can't make any connections as our client isn't making a connection.
// 73. so in client folder, npm i socket.io-client
// 74. now follow along in client/Editor.js


// 158. so creating a function for that
async function findOrCreateDoc(id){
    if(id == null) return

    const document = await Document.findById(id)
    // 159. if we have a doc, return it to the user
    if(document) return document
    // 160. otherwise return creation of default document
    return await Document.create({ _id: id, data: defaultValue})
}
