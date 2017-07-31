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
    "dojo/dom-construct",
    "dojo/query",
    "dojo/text!./templates/HistoryEntry.html",
    "dojo/ready",
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Tooltip, domConstruct, query, template, ready) {
	return declare("com.siemens.bt.jazz.rtc.workItemEditor.presentation.statusHistory.ui.HistoryEntry", [ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
        
        templateString: null,
        stateData: null,
		
        constructor: function(stateData) {
            this.inherited(arguments);
            this.templateString = template;
            this.stateData = stateData;
        },

        postCreate: function() {
            if(this.stateData.resolution) {
                var data = "<td><img src=\""+ this.stateData.resolutionIcon+ "\"></img></td>"
                         + "<td>" + this.stateData.resolution + "</td>";
                domConstruct.place(data, this.resolutionRow);
            }
        },

        startup: function() {
            // add user tooltip
            new Tooltip({
                connectId: [this.userImageTooltip],
                label: "Modified by: <b>" + this.stateData.modifier + "</b>"
            });
            new Tooltip({
                connectId: [this.dateDiffTooltip],
                label: "Starting " + this.formattedDate + ", this work item was in the state " + this.stateData.stateName + " for <b>" + this.stateData.dateDiff + " days</b>"
            });
        }
    });
});