#!/bin/bash

# https://qiita.com/arc279/items/ed310419d2030c6edb5e

IFS=$'\t' read -a COLUMNS
IDX_MX=$((${#COLUMNS[@]}-1))

echo "["

while read line; do
    IFS=$'\t' read -a ROW <<< "$line"

    echo -n "{"
    for i in $(seq 0 $IDX_MX); do
        printf '"%s":"%s"' ${COLUMNS[$i]} ${ROW[$i]}

        if [ $i -ne $IDX_MX ] ; then
            echo -n ","
        fi
    done
    echo "},"
done

echo "null]"
