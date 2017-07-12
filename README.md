# Status History Presentation for RTC
Rational Team Concert (RTC) has a built-in feature to view the history of a work item. But especially for work items with many changes, it is hard to follow the **Status** of a work item over time. That's why we created this small extension. It shows all Status changes since the creation of the work item in form of a timeline.

![State History Presentation](https://github.com/jazz-community/rtc-statushistory-presentation/blob/master/documentation/statusHistoryPresentationScreenshot.png)

RTC allows you to customize the user interface of the work item editor to your needs, for example by writing own presentations.

This plug-in is a good starting point to learn from if you want to build your own `Non-Attribute-based Presentation` for RTC, as there seems to be no other example on the web on how to do this up until now.

## Setup Instructions
### Installation & Deployment
Deploy it into RTC just like any other update-site. Instructions on how to do this can be found e.g. [here](https://github.com/jazz-community/rtc-create-child-item-plugin#installation).

### Configuration
- In the Web UI, open the RTC project area where you want to add the Status History presentation
- Navigate to the project area administration page and click on `Work Items` in the menu on the left side
- In the sub-navigation, choose `Editor Presentations`
![Instructions on how to open Editor Presentation View](https://github.com/jazz-community/rtc-statushistory-presentation/blob/master/documentation/ViewEditorPresentation_WebUI.png)
- Select the presentation for which you want to add the Status History Plug-in.
- Add a new section and give it a name, e.g. *Status History* (optional)
- Within the desired section, click on the green *Plus* icon, switch to `non-Attribute-based Presentation` and set the selection of **Kind** to our Status History Plug-in
![Adding Status History Presentation to Editor Presentation](https://github.com/jazz-community/rtc-statushistory-presentation/blob/master/documentation/AddStatusHistoryPlugIn_WebUI.png)
- Make sure that you save your configuration changes and repeat the steps for any other Editor Presentation.

# About this Plug-In
## Compatibility
This plug-in has been verified to work on RTC 6.0.3 and onward. According to our information, the mechanism for creating non-attribute based presentation hasn't changed since one of the first releases of RTC, so we expect it to work with any version of RTC. If not, we would appreciate your feedback.

## Contributing
Please use the [Issue Tracker](https://github.com/jazz-community/rtc-statushistory-presentation/issues) of this repository to report issues or suggest enhancements.<br>
Pull requests are very welcome.

## Licensing
Copyright (c) Siemens AG. All rights reserved.<br>
Licensed under the [MIT](https://github.com/jazz-community/rtc-statushistory-presentation/blob/master/LICENSE) License.
