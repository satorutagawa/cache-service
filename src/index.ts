import express from 'express';

const AppDAO = require('./dao')
const SomeTable = require('./some_table')
const DataCache = require('./cache')

const dao = new AppDAO('./database.sqlite3')
const someTable = new SomeTable(dao)
const cache = new DataCache()

const app = express();


app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

app.get( "/add/:id/:data", ( req, res ) => {
    let id: number = parseInt(req.params['id'])
    let data: string = req.params['data']
    console.log(id, data)
    if (id in cache._cache) {
        res.send( `Data already exists for ${id}\n`)
    }
    else {
        cache.set_cache_with_lock(id, data)
        .then(() => {
            someTable.insert_to_db_with_lock(id, data)
            .then((result: string) => {
                res.send(result)
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
    cache.read_cache_all_with_lock()
    .then((result: any) => {
        console.log(result)
        res.send(result)
    })
});

app.get( "/fetch_db/:id", ( req, res ) => {
    let id: number = parseInt(req.params['id'])

    console.log(`Fetch ${id} from DB`)

    someTable.getById(id)
    .then((row: any) => {
        res.send( `${row.data}\n` );
    })
    .catch((err: Error) => {
        console.log('Error in fetch_db: ')
        console.log(JSON.stringify(err))
    })
});

app.get( "/fetch/:id", ( req, res ) => {
    let id: number = parseInt(req.params['id'])

    console.log(`Fetch ${id}`)

    cache.read_cache_with_lock(id)
    .then((result: string) => {
        res.send(result)
    })

});

app.get( "/delete/:id", ( req, res ) => {
    let id: number = parseInt(req.params['id'])
    console.log(`Deleting ${id}`)

    if (id in cache._cache) {
        cache.unset_cache_with_lock(id)
        .then(() => {
            someTable.delete_from_db_with_lock(id)
            .then((result: string) => {
                res.send(result)
            })
        })
    } else {
        res.send(`Nothing to delete for ${id}\n`)
    }

});

someTable.createTable()
.then(() => {
    console.log("Created Table")
    
    // load cache
    someTable.getAll()
    .then((rows: any) => {
        rows.forEach((row: any) => {
            cache.set_cache_with_lock(row.id, row.data)
            .then((id: number) => {
                console.log(`Cache loaded for: ${id}`)
            })
        })
    })
    .catch((err: Error) => {
        console.log('Error loading cache: ')
        console.log(JSON.stringify(err))
    })    
})
.catch((err: Error) => {
    console.log('Error creating table: ')
    console.log(JSON.stringify(err))
})

app.listen(4000, () => {
    console.log(`server running on port 4000`);
});
