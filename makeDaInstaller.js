const fs = require('fs')
require('dotenv').config()

const args = process.argv.slice(2)// Get arguments passed on command line
const newEnv = args[0].toLowerCase().trim() // The first argument
const validEnvironments = ['dev', 'pre', 'pro', 'test']

const packageJsonPath = './package.json'
let packageUpdated = false
const mainJsPath = './main.js'
let mainUpdated = false

const configurations = {
    dev: {
      name: "control-suite-dev-app",
      productName: "Control Suite DEV",
      description: 'Control Suite DEV App',
      appId: 'com.control-suite-dev-app'
    },
    pre: {
      name: "control-suite-pre-app",
      productName: "Control Suite PRE",
      description: 'Control Suite PRE App',
      appId: 'com.control-suite-pre-app'
    },
    pro: {
      name: "control-suite-pro-app",
      productName: "Control Suite PRO",
      description: 'Control Suite PRO App',
      appId: 'com.control-suite-pro-app'
    },
    test: {
      name: "control-suite-cloud-app",
      productName: "Control Suite Cloud",
      description: 'Control Suite CLOUD App',
      appId: 'com.control-suite-cloud-app'
    }
  }

const validateEnvironment = () => {
    if(!validEnvironments.some(environment =>  environment === newEnv)) throw new Error(`Not a valid environment, try with (${validEnvironments.join(', ')})`)
}


const updatePackage = () => {
  console.log(`>>> package.json:`);
  let data = fs.readFileSync(packageJsonPath, 'utf8');
  let packageJson = JSON.parse(data);
  const config = configurations[newEnv];
  packageJson.name = config.name;
  packageJson.productName = config.productName;
  packageJson.description = config.description;
  packageJson.build = packageJson.build || {};
  packageJson.build.appId = config.appId;
  packageJson.build.productName = config.productName;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  console.log(`           name: "${packageJson.name}"`);
  console.log(`           productName: "${packageJson.productName}"`);
  console.log(`           description: "${packageJson.description}"`);
  console.log(`           appId: "${packageJson.build.appId}"`);
}

const updateMain = () => {
    console.log(`>>> main.js:`)
    data = fs.readFileSync(mainJsPath, 'utf8')
    // Apply both replacements
    const updatedData = data
        .replace(/(const APP_ENV = ')([^']*)(')/, `$1${newEnv.toUpperCase()}$3`)
        .replace(/(const APP_URL = ')([^']*)(')/, `$1${process.env[newEnv.toUpperCase()]}$3`)

    fs.writeFileSync(mainJsPath, updatedData, 'utf8')
    console.log(`           APP_ENV: "${newEnv.toUpperCase()}"`)
    console.log(`           APP_URL: "${process.env[newEnv.toUpperCase()]}"`)
    mainUpdated = true
}


try {
    validateEnvironment()
    updatePackage()
    updateMain()
    console.log('Environment updated successfully.');

} catch (err) {
    console.error('Error:', err)
}