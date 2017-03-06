#!/bin/bash

openssl x509 -outform der -in $1 -out $2
