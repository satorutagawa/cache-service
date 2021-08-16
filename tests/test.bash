#!/bin/bash

set -eux

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

for i in {1..3}
do
    add ${i} &
    fetch ${i} &
done

list

wait
for i in {1..3}
do
    delete ${i} &
done

wait
list
