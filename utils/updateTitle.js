const fs = require('fs')
const path = require('path')

const packageJsonPath = path.join(__dirname, '..', 'package.json');
let data = fs.readFileSync(packageJsonPath, 'utf8')
let packageJson = JSON.parse(data)

const updateTitle = (win, config) => {
    
    setTimeout(() => {
        const originalTitle = win.getTitle()
        const titleAlreadyUpdated = originalTitle.includes(config.name)

        if(!titleAlreadyUpdated){
            const newTitle = `${originalTitle} (${config.name}) v.${packageJson.version}`
            win.setTitle(newTitle)
        }
    }, 1000)
}

module.exports = updateTitle