# TESTING WITH APPIUM AND CUCUMBER.JS

## Setup

Install appium-doctor, run it and follow recommendations.
```
npm i appium-doctor -g
appium-doctor
```

## Running tests

1. If necessary, modify ```code/platforms.js``` with your devices capabilities.

2. If necessary, modify Android build path (```androidBuildPath``` prop) in ```code/buildPaths.js```. To run on device use ````${__dirname/../../android/app/build/outputs/apk/app-armeabi-v7a-debug.apk```` and to run on an emulator use ````${__dirname}/../../android/app/build/outputs/apk/app-x86-debug.apk````.

3. Run ```cucumber``` to test both platforms or run them individually
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

### Option 1

Get Appium for Desktop from here: https://github.com/appium/appium-desktop. Start the server with default parameters and launch a new session with the same capabilities as in ```code/platforms.js``` file. This should open a window where you can see the simulator screen and inspect view hierarchy for accessibility ids to use in the tests.

### Option 2
Open a debugging REPL from inside a step definition
```
// stepDefinitions.js
await this.app.debug()
```
```
# REPL
[15:57:05]  DEBUG       Queue has stopped!
[15:57:05]  DEBUG       You can now go into the browser or use the command line as REPL
[15:57:05]  DEBUG       (To exit, press ^C again or type .exit)

> browser
'[WebdriverIO REPL client]'
> browser.element('settings')
{ ELEMENT: '2',
  'element-6066-11e4-a52e-4f735466cecf': '2',
  selector: 'settings',
  value: { ELEMENT: '2' },
  index: 2 }
```