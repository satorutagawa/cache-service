// cache.ts

export {};
const AsyncLock = require('async-lock');

class DataCache {
	_cache: { [id: number]: string};
	_lock: typeof AsyncLock;
	
	constructor(lock: any) {
		this._cache = {};
		this._lock = new AsyncLock();
	}

	set_cache_with_lock(id: number, data: string) {
	    return new Promise((resolve) => {
    	    this._lock.acquire('key1', () => {
			    console.log(`lock_cache enter for ${id}`)
			    if (id in this._cache) {
			    	console.log(`Already set for ${id}`)
			        resolve(-1);
			    }
			    else {
			      	this._cache[id] = data
			        resolve(id);
			    }
   			    console.log(`lock_cache exit for ${id}`)
			})
	    })
	}


	unset_cache_with_lock(id: number) {
	    return new Promise((resolve) => {
	    	this._lock.acquire('key1', () => {
			    console.log(`lock_cache enter for ${id}`)
		      	if (id in this._cache) {
		        	delete this._cache[id]
		        	resolve(id)
		      	}
		      	else {
		        	resolve(id)
		      	}
		      	console.log(`lock_cache exit for ${id}`)
	    	})
	  	})
	}

	read_cache_with_lock(id: number) {
	    return new Promise((resolve) => {
  	  		this._lock.acquire('key1', () => {
			    console.log(`lock_cache enter for ${id}`)
			    if (id in this._cache) {
			    	resolve(`${this._cache[id]}\n`)
			    }
			    else {
			        resolve(`No data for ${id}\n`)
			    }
			    console.log(`lock_cache exit for ${id}`)
		    })
		})
	}

	read_cache_all_with_lock() {
	    return new Promise((resolve) => {
  	  		this._lock.acquire('key1', () => {
			    console.log(`lock_cache enter for all`)
			    if (this._cache) {
			    	resolve(this._cache)
			    }
			    else {
			        resolve(`No data in cache\n`)
			    }
			    console.log(`lock_cache exit for all`)
		    })
		})
	}

}

module.exports = DataCache