#!/bin/bash

convert $IMAGE_PATH/Default-Input.png -resize 640x1136^ -gravity center -crop 640x1136+0+0\! Default-568h@2x~iphone.png
convert $IMAGE_PATH/Default-Input.png -resize 750x1334^ -gravity center -crop 750x1334+0+0\! Default-667h.png
convert $IMAGE_PATH/Default-Input.png -resize 1242x2208^ -gravity center -crop 1242x2208+0+0\! Default-736h.png
convert $IMAGE_PATH/Default-Input.png -rotate 90 -resize 2208x1242^ -gravity center -crop 2208x1242+0+0\! Default-Landscape-736h.png
convert $IMAGE_PATH/Default-Input.png -rotate 90 -resize 2048x1536^ -gravity center -crop 2048x1536+0+0\! Default-Landscape@2x~ipad.png
convert $IMAGE_PATH/Default-Input.png -rotate 90 -resize 1024x768^ -gravity center -crop 1024x768+0+0\! Default-Landscape~ipad.png
convert $IMAGE_PATH/Default-Input.png -resize 1536x2048^ -gravity center -crop 1536x2048+0+0\! Default-Portrait@2x~ipad.png
convert $IMAGE_PATH/Default-Input.png -resize 768x1024^ -gravity center -crop 768x1024+0+0\! Default-Portrait~ipad.png
convert $IMAGE_PATH/Default-Input.png -resize 640x960^ -gravity center -crop 640x960+0+0\! Default@2x~iphone.png
convert $IMAGE_PATH/Default-Input.png -resize 320x480^ -gravity center -crop 320x480+0+0\! Default~iphone.png
