#!/bin/bash

set -eux

BASE_URL="localhost:4000"

function test_add() {
    curl -s ${BASE_URL}/add/1/data1
}

function test_delete() {
    curl -s ${BASE_URL}/delete/1
}

function test_list() {
    curl -s ${BASE_URL}/list
}

function test_list_db() {
    curl -s ${BASE_URL}/list_db
}

test_add
test_list
test_list_db
test_delete
test_list
