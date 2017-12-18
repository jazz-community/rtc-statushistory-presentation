/**
 * @Author Lukas Steiger
 * @Copyright (c) 2017, Siemens AG
 */
define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/Tooltip",
	"dojo/Deferred",
	"dojo/on",
	"dojo/promise/all",
	"dojo/query",
	"dojo/dom-construct",
	"./XhrHelpers",
	"./JazzHelpers",
	"./HistoryEntry",
	"dojo/text!./templates/Presentation.html",
	"dojo/domReady!",
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Tooltip, Deferred, on, all, query, domConstruct, XHR, JAZZ, HistoryEntry, template) {
	return declare("com.siemens.bt.jazz.rtc.workItemEditor.presentation.statusHistory.ui.Presentation", [ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
        
		_classProperties: {instanceID: 0},
        instanceID: null,
		templateString: null,
		
		calIcon: null,
		conf: null,
		itemId: null,
		states: null,
		initStateSize: null,
		stateDelegates: [],
		
        constructor: function(args) {
            this.instanceID = ++this._classProperties.instanceID;
            this.inherited(arguments, []);
			this.templateString = template;
			this.itemId = args.workItem.itemId;
			this.initStateSize = 3;
			this.conf = this.setConfigurationProperties(args);
			if(args.workItem.id > 0) {
				this.createStateHistory(args.workItem.id, this.itemId);
			}
		},

		setConfigurationProperties: function(args) {
			var conf = [];
			var properties = args.presentation.properties;
			if(typeof properties !== "undefined" && properties.length && properties.length > 0) {
				for(var i = 0; i < properties.length; i++) {
					var property = properties[i];
					conf[property.key] = property.value;
				}
			}
			return conf;
		},
		
		getHistoryDelegatedUIs: function(workItemId) {
			var dfd = new Deferred();
			var self = this;
			var url = JAZZ.getApplicationBaseUrl() + "service/com.ibm.team.workitem.common.internal.rest.IWorkItemRestService/workItemDTO2?id=" + workItemId + "&includeAttributes=false&includeLinks=false&includeApprovals=false&includeHistory=true&includeLinkHistory=false";
			XHR.oslcXmlGetRequest(url).then(function(data) {
				var changes = data.getElementsByTagName("changes");
				for(var i = 0; i < changes.length; i++) {
					var content = changes[i].getElementsByTagName("content")[0].textContent;
					var modified = changes[i].getElementsByTagName("modifiedDate")[0].textContent;
					self.stateDelegates.push({
						content: content,
						modified: modified
					});
				}
				dfd.resolve();
			});
			return dfd;
		},

		/**
		 * create a state history presentation for a specific work item
		 * @params id: {string} work item ID
		 * @params itemId: {string} work item UUID
		 */
		createStateHistory: function(id, itemId) {
			var self = this;

			var delegatedDfd = this.getHistoryDelegatedUIs(id);

			var historyUrl = JAZZ.getApplicationBaseUrl() + "rpt/repository/workitem?fields=workitem/workItem[id=" + id + "]/(itemHistory/(stateId|modified|state/(*))|itemId)";
			var historyDfd = new Deferred();
			var states = [];

			// read history of work item
			XHR.oslcXmlGetRequest(historyUrl).then(function(data) {
				var stateEntries = data.getElementsByTagName("itemHistory");
				
				// read state details from history response
				for(var i = 0; i < stateEntries.length; i++) {
					var stateId = stateEntries[i].getElementsByTagName("stateId")[0].textContent;
					var modified = stateEntries[i].getElementsByTagName("modified")[0].textContent;
					var exp = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}\+\d{2})(\d{2})/;
					var splitDate = modified.match(exp);
					if(splitDate.length === 3) {
						modified = splitDate[1] + ":" + splitDate[2];
						modified = new Date(modified);
					}
					var state = stateEntries[i].getElementsByTagName("state")[0].textContent;					
					states[i] = {
						stateId: stateId,
						modified: modified,
						state: state						
					};
				}

				// sort states
				states.sort(function(a,b) {return (a.modified < b.modified) ? -1 : ((b.modified < a.modified) ? 1 : 0);} ); 

				historyDfd.resolve();
			});

			all([delegatedDfd, historyDfd]).then(function() {
				// use only history entries containing a state change
				self.states = self.getStateChangeSubset(states, new Date());							
				// get state subset
				self.getStateRange(itemId, self.states, (self.states.length - self.initStateSize), self.states.length);				
			});
		},

		getStateRange: function(itemId, states, startIdx, endIdx, isAll) {
			if(startIdx < 0)
				startIdx = 0;
			var slicedStates = states.slice(startIdx, endIdx);
			var isAll = isAll || states.length === slicedStates.length;
			var prevLoadedOldestDate = startIdx > 0 ? states[startIdx - 1].modified : new Date();
			this.getFullStates(itemId, slicedStates, isAll, prevLoadedOldestDate);
		},

		getStateChangeSubset: function(allStates, prevLoadedOldestDate) {
			var self = this;
			var stateChanges = [];

			// add initial state
			var prevState = allStates[0];
			stateChanges.push(prevState);
			
			// process each history entry and analyze whether the state has changed or not
			for(var i = 1; i < allStates.length; i++) {
				var curState = allStates[i];
				if(prevState.state !== curState.state) {
					prevState.dateDiff = self._getDateDiff(prevState.modified, curState.modified);
					prevState.stateDelegate = self._getStateDelegate(prevState.modified);
					stateChanges.push(curState);
					prevState = curState;
				}
			}			

			// calculate date difference
			stateChanges[stateChanges.length -1].dateDiff = self._getDateDiff(prevState.modified, prevLoadedOldestDate);
			stateChanges[stateChanges.length -1].stateDelegate = self._getStateDelegate(prevState.modified);

			return stateChanges;
		},

		getFullStates: function(itemId, states, isEntireHistory, prevLoadedOldestDate) {
			var self = this;
			var fullStates = [];
			
			// query complete state
			for(var i = 0; i < states.length; i++) {
				fullStates[i] = self.getStateInfo(itemId, states[i]);
			}
			
			// wait for all history information and proceed
			all(fullStates).then(function(allStates) {
				if(isEntireHistory) {
					self._removeExpandButton();
				} else {
					self._addExpandButton();
				}
				self.processStates(allStates, prevLoadedOldestDate);
			});
		},
		
		/**
		 * get work item attributes of a specific historic work item entry
		 * @params itemId: {string} work item UUID
		 * @params state: {object} historic state info
		 * @returns {Deferred} the work item information  
		 */
		getStateInfo: function(itemId, state) {
			var dfd = new Deferred();
			var self = this;
			var stateId = state.stateId;
			var stateInfoUrl = JAZZ.getApplicationBaseUrl() + "resource/itemOid/com.ibm.team.workitem.WorkItem/" + itemId + "/" + stateId + "?oslc.properties=rtc_cm:state{*},rtc_cm:resolution{*},dcterms:modified,rtc_cm:modifiedBy{*}";
			
			XHR.oslcJsonGetRequest(stateInfoUrl).then(function(data) {
				var resolution = (typeof data["rtc_cm:resolution"] !== "undefined") ? data["rtc_cm:resolution"] : {};
				dfd.resolve({
					dateDiff: state.dateDiff,
					stateDelegate: state.stateDelegate,
					modified: data["dcterms:modified"] || "",
					stateName: data["rtc_cm:state"]["dcterms:title"] || "",
					stateId: data["rtc_cm:state"]["rdf:about"] || "",
					stateIcon: data["rtc_cm:state"]["rtc_cm:iconUrl"] || "",
					modifier: data["rtc_cm:modifiedBy"]["foaf:name"] || "",
					modifierUri: data["rtc_cm:modifiedBy"]["rdf:about"] || "",
					resolution: resolution["dcterms:title"] || "",
					resolutionIcon: resolution["rtc_cm:iconUrl"] || ""
				});
			});
			return dfd;
		},
		
		/**
		 * 
		 * going through the jazz integrated proxy. This allows as to make cross
		 * origin request's from client side
		 * @params allStates: {array} array of objects containing the work item state information
		 */
		processStates: function(allStates, prevLoadedOldestDate) {
			var self = this;
			var stateChanges = allStates;
			// add state entry tu UI
			for(var i = stateChanges.length - 1; i >= 0; i--) {
				var stateData = stateChanges[i];
				stateData.userImage = self._getProfileImage(stateData.modifierUri);
				stateData.formattedDate = new Date(stateData.modified)
						.toLocaleDateString('en-GB', {
							day : 'numeric',
							month : 'short',
							year : 'numeric'
						});
				self.applyConfiguration(stateData, self.conf);
				var he = new HistoryEntry(stateData);
				he.placeAt(self.historyContainer);
				he.startup();
			}
		},

        applyConfiguration: function(stateData, conf) {
            if(conf.timeline && conf.timeline === "STATUS") {
				stateData.primaryIcon = stateData.stateIcon;
				if(conf.largeIcons && conf.largeIcons === "true") {
					var suffix = conf.largeIconsSuffix || "_large";
					var s = stateData.stateIcon;
					if(suffix.lastIndexOf(".") < 0)
						suffix += s.substring(s.lastIndexOf("."));
					stateData.primaryLargeIcon = s.substring(0, s.lastIndexOf(".")) + suffix;
				} else { // default: largeIcons = false
					stateData.primaryLargeIcon = stateData.primaryIcon;
				}
                stateData.primaryText = stateData.stateName;
                stateData.secondaryIcon = stateData.userImage;
                stateData.secondaryText = stateData.modifier;
            } else { // default: timeline = USER 
				stateData.primaryIcon = stateData.userImage;
				stateData.primaryLargeIcon = stateData.primaryIcon;								
                stateData.primaryText = stateData.modifier;
                stateData.secondaryIcon = stateData.stateIcon;
                stateData.secondaryText = stateData.stateName;                
            }
        },

		_getStateDelegate: function(date) {
			for(var i = 0; i < this.stateDelegates.length; i++) {
				if(this._getDateDiffInSeconds(this.stateDelegates[i].modified, date) === 0) {
					return this.stateDelegates[i].content;
				}
			}
			return null;
		},

		_subtractDates: function(d1, d2) {
			return ((+Date.parse(d2)) - (+Date.parse(d1)));
		},

		_getDateDiff: function(d1, d2) {
			return Math.round(Math.abs(this._subtractDates(d1, d2))/8.64e7);
		},

		_getDateDiffInSeconds: function(d1, d2) {
			return Math.floor(Math.abs(this._subtractDates(d1, d2)/1000));
		},
		
		_getProfileImage: function(userUri) {
			var Util = com.ibm.team.dashboard.web.util.internal.Util;
			var SERVICE_PHOTO_ID = "com.ibm.team.dashboard.viewlets.service.internal.members.IMemberPhotoService"; 
			var userId = userUri.substring(userUri.lastIndexOf("/") + 1);
			var decodedUserId = decodeURIComponent(userId);
			return Util.getServiceURL(SERVICE_PHOTO_ID, null, {userId: decodedUserId}); 
		},

		_addExpandButton: function() {
			var self = this;
			var data = "<div class=\"expandButton\">+</div>";
			var node = domConstruct.place(data, this.historyContainer, "after");
			var tooltip = new Tooltip({
                connectId: [node],
                label: "Click to expand full history"
            });
			on(node, "click", function() {
				tooltip.destroy();
				self.getStateRange(self.itemId, self.states, 0, self.states.length - self.initStateSize, true);
			});
		},

		_removeExpandButton: function() {
			query('.expandButton').forEach(domConstruct.destroy);
		}
    });
});