const webpack = require('webpack');
const JazzUpdateSitePlugin = require('jazz-update-site-webpack-plugin');
const packageJson = require('./package.json');
const core = require('@actions/core');
const DisableOutputWebpackPlugin = require("disable-output-webpack-plugin");
const RemovePlugin = require("remove-files-webpack-plugin");

module.exports = (env) => {
	env && env.buildUUID && console.info(`Build UUID is passed along: '${env.buildUUID}'`);
	const version = env && env.buildUUID || packageJson.version;
	const projectId = "com.siemens.bt.jazz.rtc.workitemeditor.presentation.statushistory";

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
				projectId: projectId,
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
			new RemovePlugin({
				before: {
					root: __dirname,
					test: [
						{
							folder: "./",
							method: filePath => {
								return new RegExp(
									/com\.siemens\.bt\.jazz\.rtc\.workitemeditor\.presentation\.statushistory.*\.zip$/,
									"i"
								).test(filePath);
							}
						}
					]
				},
				after: {
					root: __dirname,
					include: ["dist"]
				}
			}),
		],
	};

	if (process.env["GITHUB_ACTIONS"]) {
		// Set the output file name for use in GitHub Actions
		core.setOutput("output_file", `${projectId}_${version}.zip`);
	}

	return config;
};
