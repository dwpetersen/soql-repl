#!/bin/bash
if [ -x "$(command -v bat)" ]; then
    bat -P $@
elif [ -x "$(command -v batcat)" ]; then
    batcat -P $@
else
    cat $@
fi
