const getMenuTemplate = (i18n) => ([
    {
        label: i18n.file,
        submenu: [
            { role: 'quit', label: i18n.quit }
        ]
    },
    // {
    //     label: i18n.edit,
    //     submenu: [
    //         { role: 'undo', label: i18n.undo },
    //         { role: 'redo', label:  i18n.redo },
    //         { type: 'separator' },
    //         { role: 'cut', label: i18n.cut },
    //         { role: 'copy', label: i18n.copy },
    //         { role: 'paste', label: i18n.paste }
    //     ]
    // },
    // {
    //     label: i18n.view,
    //     submenu: [
    //         { role: 'reload', label: i18n.reload },
    //         { role: 'forceReload', label: i18n.forcereload },
    //         { role: 'resetzoom', label: i18n.resetzoom },
    //         { role: 'zoomin', label: i18n.zoomin },
    //         { role: 'zoomout', label: i18n.zoomout },
    //         { role: 'togglefullscreen', label: i18n.togglefullscreen }
    //     ]
    // },
    // {
    //     label: i18n.window,
    //     submenu: [
    //         { role: 'minimize', label: i18n.minimize },
    //         { role: 'zoom', label: i18n.zoom },
    //         { role: 'close', label: i18n.close }
    //     ]
    // },
    {
        label: i18n.help,
        submenu: [
            {
                label: i18n.documentation,
                click: async() => {
                    const {shell} = require('electron')
                    await shell.openExternal('https://controlsuite.notion.site/controlsuite/ControlSuite-Back-Office-fa33b79b4ae54d97baa5da9fe3e4973e')
                }
            }
        ]
    },
])

module.exports = getMenuTemplate