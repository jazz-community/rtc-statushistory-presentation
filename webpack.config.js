const webpack = require('webpack');
const JazzUpdateSitePlugin = require('jazz-update-site-webpack-plugin');
const packageJson = require('./package.json');

module.exports = (env) => {
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
                projectId: packageJson.name,
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
                    version: packageJson.version,
                },
            }),
        ],
    };
    return config;
};
