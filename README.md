[![travis-svg][travis-svg]][travis]

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

| Key              | Value         | Default Value |
| ---------------- | ------------- | ------------- |
| timeline         | STATUS, USER  | USER          |
| largeIcons       | true, false   | false         |
| largeIconsSuffix | (string)      | \_large       |

To enable large icons, set *largeIcons* to *true*. Additionally, you need to add larger icons to your process. To do so, add the respective iamges as a process attachment to your project area process. The search scope of the plug-in is limited to the path **/workflow/**, so your icons need to be provided in there. 

![Configure Status History Presentation in Eclipse Client](https://github.com/jazz-community/rtc-statushistory-presentation/blob/master/documentation/ConfigurePropertiesInEclipseClient.PNG)

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

[travis-svg]: https://travis-ci.org/jazz-community/rtc-statushistory-presentation.svg?branch=master
[travis]: https://travis-ci.org/jazz-community/rtc-statushistory-presentation
