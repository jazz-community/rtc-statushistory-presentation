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
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Tooltip, domConstruct, template) {
	return declare("com.siemens.bt.jazz.rtc.workItemEditor.presentation.statusHistory.ui.HistoryEntry", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

		templateString: null,
		stateData: null,

		constructor: function (stateData) {
			this.templateString = template;
			this.stateData = stateData;
		},

		postCreate: function () {
			if (this.stateData.resolution) {
				var data = "<td><img src=\"" + this.stateData.resolutionIcon + "\"></img></td>"
					+ "<td>" + this.stateData.resolution + "</td>";
				domConstruct.place(data, this.resolutionRow);
			}
			if (this.stateData.daysSince) {
				var days = "<td></td><td>" + this.stateData.daysSince + " days ago</td>";
				domConstruct.place(days, this.daysAgoRow);
			}
		},

		startup: function () {
			var dateDiffAddon = arguments.length > 0 ? arguments[0] : undefined;

			this.addTooltips(dateDiffAddon);
		},

		addTooltips: function () {
			var dateDiffAddon = arguments.length > 0 ? arguments[0] : undefined;

			var dateDiffTooltipContent = "Starting " + this.formattedDate + ", this work item was in the state " + this.stateData.stateName + " for <b>" + this.stateData.dateDiff + " days</b>";

			if (dateDiffAddon) {
				dateDiffTooltipContent += "<br><br>" + dateDiffAddon;
			}

			new Tooltip({
				connectId: [this.userImageTooltip],
				label: "<b>" + this.stateData.primaryText + "</b>",
				position: ["before", "after"]
			});
			new Tooltip({
				connectId: [this.dateDiffTooltip],
				label: dateDiffTooltipContent,
				position: ["before", "after"]
			});
			if (this.stateDelegate !== null) {
				new Tooltip({
					connectId: [this.delegatedHistoryEntry],
					label: "<span class=\"delegatedHistoryEntry\">"
						+ "<img class=\"userImage\" src=\"" + this.userImage + "\"></img>"
						+ "<p>" + this.stateData.modifier + "<br> " + this.stateData.changedOn + " " + this.formattedDate + "</p>"
						+ this.stateDelegate
						+ "</span>",
					position: ["before", "after"]
				});
			}
		}
	});
});
