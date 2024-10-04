import fastify from "fastify";

const app = fastify()

app.get('/hello', () => {
    return 'Hello words !'
})



app.listen({
    port: 3333,
}).then( () => {
    console.log("Helo World !")
})