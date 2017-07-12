/**
 * @Author Lukas Steiger
 * @Copyright (c) 2017, Siemens AG
 */
define([
        "dojo/_base/declare",
        "dojo/Deferred"
], function(declare, Deferred) {
	var XhrHelper = declare("com.siemens.bt.jazz.utils.xhr", null, {
		/**
		 * interface'd call to jazz.client.xhr, which must be used for all request's 
		 * going through the jazz integrated proxy. This allows as to make cross
		 * origin request's from client side
		 * @params method: {string} HTTP verb used
		 * @params args: {object} an object list of valid dojo.xhr arguments
		 * @params hasBody: {boolean} whether the request has a body or not
		 * @returns {Deferred} the result of the async call    
		 */
		xhr: function(method, args, hasBody) {
			/* globals jazz: false */
        	return jazz.client.xhr(method, args, hasBody);
		},
		
		/**
		 * xhr request for OSLC (version 2.0) enabled servers
		 * @params method {string}: HTTP verb used
		 * @params url {URI string}: endpoint url for the xhr request
		 * @params accept {string}: the required content type of the response 
		 * @params handleAs {string}: how we want to treat the response (text, json, ..)
		 * @returns {Deferred} the result of the async call 
		 */
		oslcRequest: function(method, url, accept, handleAs) {
			return this.xhr(method, {
        		url: url,            		
        		headers: {
        			"OSLC-Core-Version": "2.0",
        			"Accept": accept
        		},
        	    handleAs: handleAs
        	}, false);
		},
		
		/**
		 * send an OSLC 2.0 enabled HTTP GET request to the passed in url
		 * and expect and process the result as JSON
		 * @params url {string}: endpoint url for the xhr request
		 * @returns {Deferred} the result of the async call  
		 */
		oslcJsonGetRequest: function(url) {
			return this.oslcRequest("GET", url, "application/json", "json");
		},
				
		/**
		 * send an OSLC 2.0 enabled HTTP GET request to the passed in url
		 * and expect and process the result as XML
		 * @params url {string}: endpoint url for the xhr request
		 * @returns {Deferred} the result of the async call  
		 */
		oslcXmlGetRequest: function(url) {
			return this.oslcRequest("GET", url, "application/xml", "xml");
		}
	});
	// create singleton
	return new XhrHelper();
});