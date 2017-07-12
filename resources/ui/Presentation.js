/**
 * @Author Lukas Steiger
 * @Copyright (c) 2017, Siemens AG
 */
define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/Deferred",
	"dojo/promise/all",
	"dojo/dom-construct",
	"./XhrHelpers",
	"./JazzHelpers",
	"dojo/text!./templates/Presentation.html",
	"dojo/domReady!",
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Deferred, all, domConstruct, XHR, JAZZ, template) {
	return declare("com.siemens.bt.jazz.rtc.workItemEditor.presentation.statusHistory.ui.Presentation", [ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
        
		_classProperties: {instanceID: 0},
        instanceID: null,
        templateString: null,
		
        constructor: function(args) {
            this.instanceID = ++this._classProperties.instanceID;
            this.inherited(arguments, []);
            this.templateString = template;
			
			this.createStateHistory(args.workItem.id, args.workItem.itemId);
        },

		/**
		 * create a state history presentation for a specific work item
		 * @params id: {string} work item ID
		 * @params itemId: {string} work item UUID
		 */
		createStateHistory: function(id, itemId) {
			var self = this;
			var historyUrl = JAZZ.getApplicationBaseUrl() + "rpt/repository/workitem?fields=workitem/workItem[id=" + id + "]/(itemHistory/(stateId)|itemId)";
			// read history of work item
			XHR.oslcXmlGetRequest(historyUrl).then(function(data) {
				var stateIDs = data.getElementsByTagName("stateId");
				var states = [];
				for(var i = 0; i < stateIDs.length; i++) {
					var stateId = stateIDs[i].textContent;
					// read work item attributes of a specific history entry
					states[i] = self.getStateInfo(itemId, stateId);
				}
				// wait for all history information and proceed
				all(states).then(function(allStates) {
					self.processStates(allStates);
				});
			});
		},
		
		/**
		 * get work item attributes of a specific historic work item entry
		 * @params itemId: {string} work item UUID
		 * @params stateId: {string} historic state UUID
		 * @returns {Deferred} the work item information  
		 */
		getStateInfo: function(itemId, stateId) {
			var dfd = new Deferred();
			var self = this;
			var stateInfoUrl = JAZZ.getApplicationBaseUrl() + "resource/itemOid/com.ibm.team.workitem.WorkItem/" + itemId + "/" + stateId + "?oslc.properties=rtc_cm:state{dcterms:title,rdf:about},rtc_cm:resolution{dcterms:title},dcterms:modified,rtc_cm:modifiedBy{foaf:name,rdf:about}";
			XHR.oslcJsonGetRequest(stateInfoUrl).then(function(data) {
				var resolution = (typeof data["rtc_cm:resolution"] !== "undefined") ? data["rtc_cm:resolution"]["dcterms:title"] : null;
				dfd.resolve({
					modified: data["dcterms:modified"],
					stateName: data["rtc_cm:state"]["dcterms:title"],
					stateId: data["rtc_cm:state"]["rdf:about"],
					modifier: data["rtc_cm:modifiedBy"]["foaf:name"],
					modifierUri: data["rtc_cm:modifiedBy"]["rdf:about"],
					resolution: resolution
				});
			});
			return dfd;
		},
		
		/**
		 * interface'd call to jazz.client.xhr, which must be used for all request's 
		 * going through the jazz integrated proxy. This allows as to make cross
		 * origin request's from client side
		 * @params allStates: {array} array of objects containing the work item state information
		 */
		processStates: function(allStates) {
			var self = this;
			// sort by modification date
			allStates.sort(function(a,b) {return (a.modified > b.modified) ? 1 : ((b.modified > a.modified) ? -1 : 0);} ); 
			// add initial state
			self.addStateChange(allStates[0], false);
			var prevStateId = allStates[0].stateId;
			// process each history entry and analyze whether the state has changed or not
			for(var i = 1; i < allStates.length; i++) {
				var curState = allStates[i];
				if(prevStateId !== curState.stateId) {
					prevStateId = curState.stateId;
					self.addStateChange(curState, true);
				}
			}
		},
		
		/**
		 * add state change representation to the DOM
		 * @params stateData: {object} work item information in a specific state
		 * @params addArrow: {boolean} whether an arrow representation should be added (used to visually connect a previous state representation with the new one)
		 */
		addStateChange: function(stateData, addArrow) {
			if(addArrow) {
				domConstruct.place("<p class=\"historyEntryArrow\">|</p>", this.historyContainer, "after");
			}
			var data = "<div class=\"historyEntry\">"
				+ "<span>" + new Date(stateData.modified).toLocaleString() + "</span>"
				+ "<span><b>" + stateData.stateName + (stateData.resolution ? " (" + stateData.resolution + ")" : "") + "</b></span>"
				+ "<span><a href=\"" + stateData.modifierUri + "\" class=\"jazz-ui-ResourceLink\">" + stateData.modifier + "</a></span>"
				+ "</div>";
			domConstruct.place(data, this.historyContainer, "after");
		}
    });
});