#!/bin/bash

#set -x
set -eu

URL="localhost:4000"

function add() {
    id=${1}
    data="data${1}"
    curl -s ${URL}/add/${id}/${data}
}

function delete() {
    id=${1}
    curl -s ${URL}/delete/${id}
}

function fetch() {
    id=${1}
    curl -s ${URL}/fetch/${id}
}

function fetch_db() {
    id=${1}
    curl -s ${URL}/fetch_db/${id}
}

function list() {
    curl -s ${URL}/list
}

function list_db() {
    curl -s ${URL}/list_db
}

function test_read_after_write_single() {
    for i in {1..10}
    do
        add 1 &
    done

    sleep 1
    
    for i in {1..3}
    do
        fetch 1 &
    done

    delete 1 &
    
    for i in {1..3}
    do
        fetch 1 &
    done

    wait
    list_db
}

function test_read_after_write_multi() {
    for i in {1..10}
    do
        add ${i} &
    done

    for i in {1..10}
    do
        fetch ${i} &
    done

    for i in {1..10}
    do
        delete ${i} &
    done
    
    for i in {1..10}
    do
        fetch ${i} &
    done

    wait
    list_db
}

test_read_after_write_single
#test_read_after_write_multi
