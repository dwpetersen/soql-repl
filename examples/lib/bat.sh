#!/bin/bash
if [ -x "$(command -v bat)" ]; then
    bat -P $@
else
    cat $@
fi
