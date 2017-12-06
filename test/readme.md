# TESTING WITH APPIUM AND CUCUMBER.JS

## Setup

Install appium-doctor, run it and follow recommendations.
```
npm i appium-doctor -g
appium-doctor
```

## Running tests

1. If necessary, modify ```code/platforms.js``` with your devices capabilities.

2. Run ```cucumber``` to test both platforms or run them individually
```
npm run cucumber

# or

appium
cucumberjs test/spec -r test/code -f node_modules/cucumber-pretty --world-parameters "{\"platform\": \"ios\"}"

# or

appium
cucumberjs test/spec -r test/code -f node_modules/cucumber-pretty --world-parameters "{\"platform\": \"android\"}"

```

## Adding new tests

Test are written in CucumberJS. Specs are in ```spec``` folder and steps definitions in ```code``` folder.

To automate UI interaction we use ```WebdriverIO```. API and capabilities here: http://webdriver.io/api.html. 

For it to find a UI element, that element needs to have an ```accessibilityLabel``` used to uniquely identify it in the view hierarchy. Other methods exist, but this is the only one which makes tests cross-platoform.

Add ```accessibilityLabel``` to an element like so:
```
import testLabel from '../helpers/test-label';
...
<Text {...testLabel('myUniqueId')}/></Text>
```

Test make use of the PageObject pattern. Learn about it here: http://webdriver.io/guide/testrunner/pageobjects.html.

## Prototyping tests

Get Appium for Desktop from here: https://github.com/appium/appium-desktop. Start the server with default parameters and launch a new session with the same capabilities as in ```code/platforms.js``` file. This should open a window where you can see the simulator screen and inspect view hierarchy for accessibility ids to use in the tests.