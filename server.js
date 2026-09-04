// server
const express = require('express'),
      app = express(),
      dreams = []

const middleware_post = ( req, res, next ) => {
  let dataString = ''

  req.on( 'data', function( data ) {
    dataString += data 
  })

  req.on( 'end', function() {
    const json = JSON.parse( dataString )
    dreams.push( json )

    // add a 'json' field to our request object
    // this field will be available in any additional
    // routes or middleware.
    req.json = JSON.stringify( dreams )

    // advance to next middleware or route
    next()
  })
}

app.use( express.static('./') )
app.post( '/submit', middleware_post )

app.post( '/submit', ( req, res ) => {
  // our request object now has a 'json' field in it from our previous middleware
  res.writeHead( 200, { 'Content-Type': 'application/json'})
  res.end( req.json )
})

const listener = app.listen( process.env.PORT || 3000 )

// run in developer's console
fetch( '/submit', {
  method:  'POST',
  headers: { 'Content-Type': 'application/json' },
  body:    JSON.stringify(['test'])
})
.then( response => response.json() )
.then( console.log ) 