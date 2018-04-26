const webpack = require('webpack');
const JazzUpdateSitePlugin = require('jazz-update-site-webpack-plugin');
const packageJson = require('./package.json');

module.exports = (env) => {
    env && env.buildUUID && console.info(`Build UUID is passed along: '${env.buildUUID}'`);
    const version = env && env.buildUUID || packageJson.version;

    const config = {
        entry: {
            StatusHistory: './index.js' // not used, prevent webpack from failing
        },
        output: {
            filename: '[name]Bundle.js' // not used, prevent webpack from failing
        },
        plugins: [
            new JazzUpdateSitePlugin({
                appType: 'ccm',
                projectId: "com.siemens.bt.jazz.rtc.workitemeditor.presentation.statushistory",
                acceptGlobPattern: [
                    'resources/**',
                    'META-INF/**',
                    'plugin.xml',
                ],
                projectInfo: {
                    author: packageJson.author,
                    copyright: packageJson.author,
                    description: packageJson.description,
                    license: packageJson.license,
                    version: version,
                },
            }),
        ],
    };
    return config;
};
