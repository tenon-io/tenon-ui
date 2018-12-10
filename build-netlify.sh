#!/bin/sh

cd www;
$(which yarn);
./node_modules/gatsby/.bin/gatsby build;
