/**
 * @Author Lukas Steiger
 * @Copyright (c) 2017, Siemens AG
 */
define([
        "dojo/_base/declare"
], function(declare) {	
	var JazzHelpers = declare("com.siemens.bt.jazz.uitls.jazz", null, {
		
		/**
		 * get the base URL for all application interactions for the current application
		 * @returns {string} base URI of the application, e.g. https://my-jazz-server.com/CCM
		 */
		getApplicationBaseUrl: function() {
			/* globals net: false */
			var baseUrl = net.jazz.ajax.BootstrapProperties.FRONTSIDE_URL;
			baseUrl = this._addTrailingSlashIfNotPresent(baseUrl);
			return (typeof baseUrl !== "undefined" && baseUrl.length > 0) ? baseUrl : null;
		},
		
		/*********************************************
		 *********** private helpers *****************
		 *********************************************/	
		/* PRIVATE: adds a trailing slash where needed */
		_addTrailingSlashIfNotPresent: function(url) {
            if (url.charAt(url.length - 1) !== "/") {
            	url += "/";
            }
            return url;
		}
	});
	// create singleton
	return new JazzHelpers();
});