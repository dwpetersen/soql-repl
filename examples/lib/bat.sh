#!/bin/bash
if [ -x "$(command -v bat)" ]; then
    bat $@
elif [ -x "$(command -v batcat)" ]; then
    batcat $@
else
    cat $@
fi
