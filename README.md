![](https://github.com/jazz-community/rtc-statushistory-presentation/workflows/npm%20build/badge.svg)

# Status History Presentation for RTC
Rational Team Concert (RTC) has a built-in feature to view the history of a work item. But especially for work items with many changes, it is hard to **follow the Status** of a work item **over time**. That's why we created this small extension. It shows all Status changes since the creation of the work item in form of a timeline.

![State History Presentation Version 2.0.0](https://github.com/jazz-community/rtc-statushistory-presentation/blob/master/documentation/statusHistoryPresentation_V2.0.0.png)

## Modes
The default mode of the plug-in *(timeline = USER)*, uses the profile picture of the user in the left hand circle of the timeline. So the picture of the user is more dominant than the rest of the information. In some cases, it is more interesting to focus on the Status. To do so, set the configuration to STATUS mode *(timeline = STATUS)* (view example of [Status Mode](https://github.com/jazz-community/rtc-statushistory-presentation/blob/master/documentation/statusHistoryPresentation_V2.2.0.png))

## Good to know
RTC allows you to customize the user interface of the work item editor to your needs, for example by writing own presentations.

This plug-in is a good starting point to learn from if you want to build your own `Non-Attribute-based Presentation` for RTC, as there seems to be no other example on the web on how to do this up until now.

## Setup Instructions
### Download
Grab the latest release from our [Releases Page](https://github.com/jazz-community/rtc-statushistory-presentation/releases). 

If you are upgrading from Version 1.0.0, take notice that there was a breaking change in between.

### Installation & Deployment
Deploy it into RTC just like any other update-site. Instructions on how to do this can be found e.g. [here](https://github.com/jazz-community/rtc-create-child-item-plugin#installation).

### Configuration
- In the **Web UI** (the Eclipse Client does NOT work for this), open the RTC project area where you want to add the Status History presentation
- Navigate to the project area administration page and click on `Work Items` in the menu on the left side
- In the sub-navigation, choose `Editor Presentations`<br>
![Instructions on how to open Editor Presentation View](https://github.com/jazz-community/rtc-statushistory-presentation/blob/master/documentation/ViewEditorPresentation_WebUI.png)
- Select the presentation for which you want to add the Status History Plug-in.
- Add a new section and give it a name, e.g. *Status History* (optional)
- Within the desired section, click on the green *Plus* icon, switch to `non-Attribute-based Presentation` and set the selection of **Kind** to our Status History Plug-in<br>
![Adding Status History Presentation to Editor Presentation](https://github.com/jazz-community/rtc-statushistory-presentation/blob/master/documentation/AddStatusHistoryPlugIn_WebUI.png)
- Make sure that you save your configuration changes and repeat the steps for any other Editor Presentation.

### Customization
The plug-in has a few configuration possibilities. They can be changed by opening the *Editor Presentation* in the **Eclipse Client** (the WEB UI does NOT work for this). 

| Key                   | Value         | Default Value |
| --------------------- | ------------- | ------------- |
| timeline              | STATUS, USER  | USER          |
| largeIcons            | true, false   | false         |
| largeIconsSuffix      | (string)      | \_large       |
| enableDetailedHistory | true, false   | false         |
| soonDays              | ( JSON )      |               |

To enable large icons, set *largeIcons* to *true*. Additionally, you need to add larger icons to your process. To do so, add the respective images as a process attachment to your project area process. The search scope of the plug-in is limited to the path **/workflow/**, so your icons need to be provided in there. 

With version 2.3.0, the detailed history, shown when hovering over an entry, is replaced with a simple version that doesn't make any additional requests. (See [Issue #17](https://github.com/jazz-community/rtc-statushistory-presentation/issues/17) for more details). The details of the state change can still be seen in the "History" tab. To reenable this feature, you need to set the "enableDetailedHistory" key to "true".

![Configure Status History Presentation in Eclipse Client](https://github.com/jazz-community/rtc-statushistory-presentation/blob/master/documentation/ConfigurePropertiesInEclipseClient.PNG)

#### **soonDays configuration**

The "soonDays" feature allows you to show a colored indicator when the work item comes close to the 'end date' or when it's over the 'end date'.

If no configuration is found this feature will be ignored. 

The configuration requires the 'id' of the severity as it's key. For the value the amount of days ( number ) will be used. The value defines when the minimal difference in days before the indicator will be displayed in an orange color and display the remaining days. 

For a more dynamic use you can also define how many percentage points should be left, before showing the indicator. You can do that by using the "%" character.

**Example:** Between start and the end date are 10 days. We've set the value to `"20%"`. This will make the indicator start to be shown `2 Days` before the end date is reached.

If the 'end date' has surpassed the current date, the indicator will turn red and display the time past.

In order for the 'soonDays' feature to enable the following conditions need to be met:
- A 'end date' needs to be defined. One of the following will be used
	- The 'due date' of the work item
	- The 'End Date' of the 'Planned For'
- A configuration was defined under the 'soonDays' key
- The severity must be able to be resolved by the configuration
- The work item **can't be resolved**

```json
{
	"severity.literal.l0": 0.5,
	"severity.literal.l1": 4,
	"severity.literal.l2": "20%"
}
```

##### How the start and end date gets determent

###### start date
The 'start date' is only needed if the value is a percentage.
The system will use the 'creation date' of the work item as the 'start date'. If the work item has a 'planned for' will that be used instead.

###### end date
If a 'due date' is set it will be used as the 'end date'. 
If the work item has a 'Planned for' and the date of the 'Planned for' is before the 'due date', the 'end date' of the 'Planned for' will be used instead.

##### fallback value
If the system can't find the 'severity' in the configuration it will try to use the fallback value. You can define this by setting "*" as the key in the configuration.

```json
{
	"*": 5
}
```

##### full example
```json
{
	"severity.literal.l3": 20,
	"severity.literal.l4": 30,
	"*": 5
}
```


# About this Plug-In
## Compatibility
This plug-in has been verified to work on RTC 6.0.3 and onward. According to our information, the mechanism for creating non-attribute-based presentations has not changed since one of the first releases of RTC, so we expect it to work with any version of RTC. If not, we would appreciate your feedback.

## Contributing
Please use the [Issue Tracker](https://github.com/jazz-community/rtc-statushistory-presentation/issues) of this repository to report issues or suggest enhancements.

For general contribution guidelines, please refer to [CONTRIBUTING.md](https://github.com/jazz-community/rtc-statushistory-presentation/blob/master/CONTRIBUTING.md)

## Licensing
Copyright (c) Siemens AG. All rights reserved.<br>
Licensed under the [MIT](https://github.com/jazz-community/rtc-statushistory-presentation/blob/master/LICENSE) License.

The _calendar_ icon by [Font Awesome](https://fontawesome.com/) is used under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) _(color has been changed)_
