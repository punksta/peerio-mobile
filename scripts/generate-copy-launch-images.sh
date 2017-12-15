#!/bin/bash

identify *.png | grep -oEh ".*.png(.*?)\d+x\d+" | awk '{print "convert \$IMAGE_PATH/Default-Input.png -resize "$3"^ -gravity center -crop "$3"+0+0\\!", $1}'

