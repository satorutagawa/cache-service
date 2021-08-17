# Cache service
 * A standalone caching service written in TypeScript

## Features:
 * add items
 * remove items
 * fetch items

## Features not considered for assignment
 * Updating of data
 * Fetch of data based on key other than id
 * Check proper insert/delete
 * Mechanism for handling data that does not fit in memory

## Install dependencies:
 * npm i

## Usage:
 * npm run dev

## (Reference) Env was setup using this tutorial:
 * Initial setup
   * https://bit.ly/3lIv7BU
     * (Dockerization not done)
 * Database DAO
   * https://stackabuse.com/a-sqlite-tutorial-with-node-js/

## Key Components
 * Database
   * Simple table with 2 columns
     * id (int)
     * data (text)
 * Cache
   * Data Structure
     * dictionary with item_id as primary key
 * API endpoints
   * GET /add/{id}/{data}
     * (Should be POST but GET used for simplicity)
     * Adds record to cache
     * Adds record to DB after 3 sec
   * GET /delete/{id}
     * (Should be DELETE but GET used for simplicity)
     * Deletes record from cache
     * Deletes record from DB after 3 sec
   * GET /fetch/{id}
     * returns single data from cache
   * GET /fetch_db/{id}
     * returns single data from DB
   * GET /list
     * returns cache contents
   * GET /list_db
     * returns DB contents

## Main considerations
 * CAP Theorem
   * trade off between Consistency and Availability when Partition tolerance exists
     * Availability is chosen here
       * Data in cache is changed first
         * eventually in sync with Database (after 3 sec)
 * Lock cache/db during read/write
   * no guarantee a write is an atomic operation
     * prevent risk of reading partially written data

## Tested Environment
 * MacOS 11.4 running nodejs v14.17.4

## Tests
 * tests/unit_test.sh
   * Synchronous test for basic operation
 * tests/test1.sh
   * Asynchronous read-after-write test using single id
 * tests/test2.sh
   * Asynchronous read-after-write test using multiple ids
