Cache service

Prerequisite:
# * python (for tests)

Install dependencies:
 * npm i

Usage:
 * npm run dev

Env setup using this tutorial:
 * https://bit.ly/3lIv7BU
   * (Dockerization not done)

Features:
 * add items
 * remove items
 * fetch items

Key Components
 * cache
   * Data Structure
     * dictionary with item_id as primary key
 * API endpoints
   * POST /add/
   * DELETE /delete/{item_id}/
   * GET /fetch/{item_id}/
   * GET /list/
     * returns array of item_ids

Features not considered for assignment
 * Database
   * All data is destroyed when server is restarted
 * Updating of data
 * Fetch of data based on key other than item_id
