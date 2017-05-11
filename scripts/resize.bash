#!/bin/bash
convert Splash.png -resize "$1^" -gravity center -crop $1+0+0 +repage $2
