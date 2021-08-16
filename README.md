Cache service

Prerequisite:
# * python (for tests)

Install dependencies:
 * npm i

Usage:
 * npm run dev

Env setup using this tutorial:
 * Initial setup
   * https://bit.ly/3lIv7BU
     * (Dockerization not done)
 * Database DAO
   * https://stackabuse.com/a-sqlite-tutorial-with-node-js/

Features:
 * add items
 * remove items
 * fetch items

Key Components
 * Database
   * Simple table with 2 columns
     * id (int)
     * data (text)
 * Cache
   * Data Structure
     * dictionary with item_id as primary key
 * API endpoints
   * GET /add/{item_id}/{data}
     * Should be POST but GET used for simplicity
   * GET /delete/{item_id}/
     * Should be DELETE but GET used for simplicity
   * GET /fetch/{item_id}/
   * GET /list/
     * returns array of item_ids

Features not considered for assignment
 * Updating of data
 * Fetch of data based on key other than item_id
 * Check proper insert/delete

Main considerations
 * CAP Theorem
   * trade off between Consistency and Availability when Partition tolerance exists
     * Availability is chosen here
 * Lock cache during write
   * read during write needs to be blocked

Endpoint workflow
 * /add/:id/data
   * write to cache
   * sleep 5 to imitate long DB write
   * write to DB
 * /list
   * read from DB
 * /fetch/:id
   * read id from cache
 * /delete
   * delete from cache
   * sleep 5 to imitate long DB write
   * delete from DB
