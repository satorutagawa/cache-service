import express from 'express';

const AppDAO = require('./dao')
const SomeTable = require('./some_table')
const dao = new AppDAO('./database.sqlite3')
const someTable = new SomeTable(dao)

const app = express();
const AsyncLock = require('async-lock')
var lock = new AsyncLock()

let _cache: { [id: number]: string} = {};

// sleep time expects milliseconds
function sleep (time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

app.get( "/", ( req, res ) => {
  res.send( "Hello world!" );
} );

app.get( "/add/:id/:data", ( req, res ) => {
  let id: number = parseInt(req.params['id'])
  let data: string = req.params['data']
  console.log(id, data)
  if (id in _cache) {
    res.send( `Data already exists for ${id}`)
  }
  else {
    _cache[id] = data

    lock.acquire("key1", () => {
      console.log('lock enter')
      let dateTime = new Date()
      console.log(`Sleep start: ${dateTime}`)
      sleep(3000)
        .then(() => {
          dateTime = new Date()
          console.log(`Sleep End: ${dateTime}`)
          someTable.insert(id, data)
            .then(() => {
              console.log('lock exit')
              res.send( `Added ${id}: ${data}` );            
            })
            .catch((err: Error) => {
              console.log('lock exit')            
              res.send( `Data already exists for ${id}`)
            })
        })
    })
  }

});

app.get( "/list_db", ( req, res ) => {
  console.log("Listing from DB")

  someTable.getAll()
    .then((rows: any) => {
      res.send( rows );
    })
    .catch((err: Error) => {
      console.log('Error: ')
      console.log(JSON.stringify(err))
    })
});

app.get( "/list", ( req, res ) => {
  console.log("Listing from cache")
  res.send(_cache)
});

app.get( "/fetch_db/:id", ( req, res ) => {
  let id: number = parseInt(req.params['id'])

  console.log(`Fetch ${id} from DB`)

  someTable.getById()
    .then((row: any) => {
      res.send( row.data );
    })
    .catch((err: Error) => {
      console.log('Error: ')
      console.log(JSON.stringify(err))
    })
});

app.get( "/fetch/:id", ( req, res ) => {
  let id: number = parseInt(req.params['id'])

  console.log(`Fetch ${id}`)
  if (id in _cache) {
    res.send(_cache[id])  
  }
  else {
    res.send(`No data for ${id}`)
  }

});


app.get( "/delete/:id", ( req, res ) => {
  let id: number = parseInt(req.params['id'])
  console.log(`Deleting ${id}`)

  if (id in _cache) {
    delete _cache[id]

    lock.acquire("key1", () => {
      console.log('lock enter')

      let dateTime = new Date()
      console.log(`Sleep start: ${dateTime}`)
      sleep(3000)
      .then(() => {
        dateTime = new Date()
        console.log(`Sleep End: ${dateTime}`)

        someTable.delete(id)
        .then(() => {
          console.log('lock exit')
          res.send(`Deleted ${id}`)
        })
        .catch((err: Error) => {
          console.log('Error: ')
          console.log(JSON.stringify(err))
        })
      })
    })
  } else {
    res.send(`Nothing to delete for ${id}`)
  }

});

someTable.createTable()
  .then(() => {
    console.log("Created Table")
  })
  .catch((err: Error) => {
    console.log('Error: ')
    console.log(JSON.stringify(err))
  })

// load cache
someTable.getAll()
  .then((rows: any) => {
    rows.forEach((row: any) => {
      _cache[row.id] = row.data
    })
  })
  .catch((err: Error) => {
    console.log('Error: ')
    console.log(JSON.stringify(err))
  })

app.listen(4000, () => {
  console.log(`server running on port 4000`);
});
