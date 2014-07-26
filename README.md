jsonJqueryMetroUiScheduler
==========================
Recently I stumbled across Sergey Pimenov’s  Metro UI framework that makes the bootstrap framework look a lot like Windows 8 with the tiles and Microsoft color pallet and a few really nice looking UI elements that I believe mirror Microsoft components. I really liked how the schedule streamer presented event data in a linear fashion on tracks, but I spent a great deal of the last five years working with Sencha’s Extjs and Touch and I was looking for something that I could drop in and manipulate the actual contents via passing a JSON object, that way I could spare myself the tedious job of hand coding a ton of HTML and also pull data from the database a bit easier. I ended up gutting the original component and using a variety of other elements to get the desired functionality and true to the open source license I’m publishing the finished result below. The reason that the actual framework is not a dependency is due to the fact that the CSS was altered so that it did not require adding a class to the body tag; this allows you to just use the widget without interfering with your existing styles. 

Ingredients:

Dependencies:
	
	JQuery Waypoints - http://imakewebthings.com/jquery-waypoints/ this plugin is used to fire events tied to the scroll position. I used this to keep track of where you might be in the schedule so that if you went from scrolling to using the navigation button you would go to the last or next increment of time and not be sent back to the beginning and then forwarded one increment of time.
	
	
	JQuery Mouse wheel - https://github.com/brandonaaron/jquery-mousewheel this plugin is used to enable the horizontal scrolling on the events pane.
	
	JQuery – http://blog.jquery.com/ - I am using version 1.10.2 so this should be the minimum version that you use.
	Bootstrap - http://getbootstrap.com/ I am also using Bootstrap 3.2.0 so this plays well with this framework. It’s not necessary but if you are using it this plugin will not interfere or vice versa.
	
	
	JQuery Widget Factory - http://jqueryui.com/widget/  since this is actually a UI Widget; of course, you will need the widget UI file from JQuery.
	
 The Widget Files:
 
	Json-event-streamer.js – This is the core JavaScript file that builds the html code and also adds the functionality to the buttons and timeline.
	
	streamer.css – This is the CSS that adds all of the styles to the timeline and really makes it look awesome. This code is 99% Metro UI’s CSS code.
	
Setting Up Your Page 

	The code is going to look for a div tag in your page, you will need to give the tag a unique ID and then use that ID when initializing the streamer in your JavaScript. It’s important to note that the actual streamer is transparent so if you want to set it up in a container with a white background and some decent padding etc I would use the following code:
	
[code]
<div class="center-block" style="padding: 20px; border: 1px #eaeaea solid;width:1200px !important;background-color:#FFF;"   >
			<div id="json-events"></div>
    </div>
[/code]

	The class center-block is a Bootstrap class above and I wanted to force the 1200 pixel width. Notice for the example my div ID  is equal to ‘json-events’. Next, you need to initialize the streamer using the following code that should be in the document ready function placed at the bottom of your page in script tags.

[javascript]
$( document ).ready(function() {
	$.custom.streamer({
		dataUrl 		: ' events.json',
		containerId 	: 'json-events'
	});
});
[/javascript]
	
	The example above assumes that the json file that will supply the events lives on the root of the drive, and the div id that will host the events streamer has an ID of ‘json-events’. 
	
The JSON File Structure

	The JSON file that contains the events must conform to the structure defined below, the example file is a great starting point.
	
Top level configuration:

eventHeader  		= The large title that is displayed above the streamer component. String

eventStartTime	= Time in the following format 9:00, required to compute the number of blocks  that are in the streamer.

eventEndTime	= Time in the following format 9:00, required to compute the number of blocks  that are in the streamer.

blockLengthMins	=  Number of minutes used to divide startTime – EndTime

keynotes 	= Objects that contain the information for the presentations that span all of the tracks. 

Tracks	= A track is an object that forms the rows in the streamer, each track contains a square with a color and corresponding events. Tracks must contain the following attributes as well as a ‘sessions’ object which is populated by event objects. Colors can be found in the streamer.css file

			title     	 	: "Test",
           		location  	: "Conference Room",
            		blockColor	: "orange",


Event Objects:

startTime   	=  Time in the following format 9:00, required to compute the number of blocks  this event will take up in the streamer.

endTime     	=  Time in the following format 9:00, required to compute the number of blocks  this event will take up in the streamer.

title         		= String value that will be the bold title in the event tile

description		= Optional description leave an empty string if not needed,

presenter     		= Presenter name



Removing the little x in IE-10 across all your input fields

	I am just finishing up a week of headaches directly attributed to Microsoft’s crazy implementation of a browser that allows for around 35 different ways that a user can render your site. One of the smaller issues had to do with the little black x that appears in IE-10, apparently the combo boxes in Extjs are actually input type text and the addition of an unintended way to clear the combo could potentially introduce several errors, such as values being set as an empty string when you are not expecting that to be the case. Fortunately the x can be hidden using simple CSS:

[css]
input::-ms-clear {
    display: none;
}
[/css]

