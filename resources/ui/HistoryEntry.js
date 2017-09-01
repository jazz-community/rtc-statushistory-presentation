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
    "dojo/text!./templates/HistoryEntry.html"
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Tooltip, domConstruct, template) {
	return declare("com.siemens.bt.jazz.rtc.workItemEditor.presentation.statusHistory.ui.HistoryEntry", [ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        
        templateString: null,
        stateData: null,
		
        constructor: function(stateData) {
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
            this.addTooltips();
        },

        addTooltips: function() {
            new Tooltip({
                connectId: [this.userImageTooltip],
                label: "Modified by: <b>" + this.stateData.modifier + "</b>",
                position: ["before", "after"]
            });
            new Tooltip({
                connectId: [this.dateDiffTooltip],
                label: "Starting " + this.formattedDate + ", this work item was in the state " + this.stateData.stateName + " for <b>" + this.stateData.dateDiff + " days</b>",
                position: ["before", "after"]
            });
            if(this.stateDelegate !== null) {
                new Tooltip({
                    connectId: [this.delegatedHistoryEntry],
                    label: "<span class=\"delegatedHistoryEntry\">"
                            + "<img class=\"userImage\" src=\"" + this.userImage + "\"></img>"
                            + "<p>" + this.stateData.modifier + "<br> changed on " + this.formattedDate + ": </p>"
                            + this.stateDelegate
                        + "</span>",
                    position: ["before", "after"]
                });
            }
        }
    });
});