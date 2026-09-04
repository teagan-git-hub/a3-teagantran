// const express    = require('express'),
//       app        = express(),
//       dreams     = []

// app.use( express.static( 'public' ) )
// app.use( express.static( 'views'  ) )
// app.use( express.json() )

// app.post( '/submit', express.json(), ( req, res ) => {
//   dreams.push( req.body.newdream )
//   res.writeHead( 200, { 'Content-Type': 'application/json'})
//   res.end( JSON.stringify( dreams ) )
// })

// app.listen( process.env.PORT || 3000 )

require( 'dotenv' ).config()

const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      app = express()

app.use( express.static( "public" ) )
app.use( express.json() )

const uri = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@${process.env.MONGOHOST}`
// check for sanity
console.log( 'uri:', uri )
const client = new MongoClient( uri )

let collection = null

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.post( '/add', async (req,res) => {
  const result = await collection.insertOne( req.body )
  res.json( result )
})

async function run() {
  await client.connect()
  collection = await client.db("datatest").collection("test")

  // route to get all docs
  app.get("/docs", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      res.json( docs )
    }
  })
}

run()

app.listen(3000)