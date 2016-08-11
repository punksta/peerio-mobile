[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)

# nicebear

## prepare environment

You would need Android SDK and XCode tools (and xcodeselect) installed, along with Android and iOS simulators
Checkout the project and run:

`npm install`
`npm update`

Run these commands every time there's a major pull from repository, which affects package.json

## To run

React-native runs listening server for debugging purposes. Default port is 8081, make sure it is used.
To start the app:

`npm start` to start the packager
`npm run ios` to start the app in sim


## To build
To clean build from scratch, run:

`npm run clean`

## To debug
Use CMD-R to reload the app live (after changes)
Use CMD-D to access debugging menu
