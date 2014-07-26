/* Joshua McDonald 2014

 Notes:

 This widget is based on the Metro-UI Scheduler and adds JSON functionality and
 the ability to easily drop the widget into a page without changing the existing
 CSS.

 Requirements:

 --> streamer.css               (Download with this plugin)
 --> at least jquery-1.10.2.js  (http://jquery.com/)
 --> jquery.widget.min.js       (http://jqueryui.com/)
 --> jquery.mousewheel.js       (http://plugins.jquery.com/mousewheel/)

 --> Your JSON Events File (Example included with plugin)

 Required HTML Snippet

    <div id="json-events"></div>

 Required Initialization

    <script>
     $( document ).ready(function() {
        $.custom.streamer({
            dataUrl : 'events.json'
        });
     });
    </script>

 The MIT License (MIT)

     Copyright (c) 2012-2013 Sergey Pimenov (metro-ui), Joshua McDonald (json implementation)

     Permission is hereby granted, free of charge, to any person obtaining a copy
     of this software and associated documentation files (the "Software"), to deal
     in the Software without restriction, including without limitation the rights
     to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     copies of the Software, and to permit persons to whom the Software is
     furnished to do so, subject to the following conditions:

     The above copyright notice and this permission notice shall be included in
     all copies or substantial portions of the Software.

     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     THE SOFTWARE.

 */
(function($){

    $.widget('custom.streamer', {

        version : '1.0.0',
        options : {
            dataUrl         : '',
            scrollBar       : false,
			containerId		: 'json-events',
            slideToGroup    : 1,
            //slideToTime: "10:20",

            slideSleep      : 1000,
            slideSpeed      : 1000,
            onClick         : function(event){},
            onLongClick     : function(event){}
        },
        currentWaypoint : 0,
        vars: {
            currentWaypoint : 0
        },
        _create: function(){

            var me              = this,
                options         = me.options,
                jsonData,
                eventLength,
                widgetWidth,
                htmlData        = '',
                waypoints       = [];

            $(window).scrollTop();
            
                $.getJSON(options.dataUrl, function(json){
                    jsonData = json;
                    eventLength = me._numMinutes( jsonData.eventStartTime,jsonData.eventEndTime );
                    // me.buildStreams(htmlData);
                    // console.log(eventLength);
                }).then(function(){
                        htmlData = '<h2 class="text-center" >' + jsonData.eventHeader + '</h2> <hr>';
                })
                /*
                 Write out the frame header
                */
                .then(function(){
                    htmlData +='<div class="streamer" data-role="streamer" data-scroll-bar="true"  data-slide-speed="500" style="height: 507px !important; ">'+
                        '<div class="streams">' +
                            '<div class="streams-title">' +
                                '<div class="toolbar">' +
                                    '<button class="button small js-show-all-streams" id="all-streams" title="Show all streams" >' +
                                        '<i class="glyphicon glyphicon-th"></i>&nbsp;' +
                                    '</button>' +
                                    //'<button class="button small js-schedule-mode" title="On|Off schedule mode" data-role="">' +
                                    //   '<i class="glyphicon glyphicon-bookmark"></i>' +
                                    //'</button>' +
                                    '<button class="button small js-go-previous-time" id="previous-time" title="Go to previous time interval">' +
                                        '<i class="glyphicon glyphicon-circle-arrow-left"></i>&nbsp;' +
                                    '</button>' +
                                    '<button class="button small js-go-next-time" id="next-time" title="Go to next time interval" >' +
                                        '<i class="glyphicon glyphicon-circle-arrow-right"></i>&nbsp;' +
                                    '</button>' +
                                '</div>' +
                            '</div>';

                })
                /*
                 Build the streams which are the boxes on the left hand side of the event widget
                 */
                .then(function(){
                    $.each(jsonData.tracks, function( index, track) {

                        htmlData += '<div class="stream bg-' + track.blockColor + '">' +
                            '   <div class="stream-title">' + track.title + '</div>' +
                            '   <div class="stream-number">' + track.location + '</div>' +
                            '</div>';

                    });
                })

                .then(function(){
                    var tempStartTime = jsonData.eventStartTime,
                        splitTime,
                        i = 0,
                        widgetWidth = ((( parseInt(eventLength) / parseInt(jsonData.blockLengthMins)) * 215) + 215).toString() + 'px';

                    /*
                     Now start the events container by adding the div's me make up the
                     events. The width of the events area container is equal to the
                     numbner of blocks times 215px which is the small tick
                     mark image width. (calculation above)
                     */

                    htmlData += ' </div><div class="events" id="events-panel"  style="overflow-x: scroll;">' +
                        '<div class="events-area" style="width:' + widgetWidth +';">' +
                        '<ul class="meter">';

                    /*
                     Build the meter me spans teh top of the streamer div and gives it the tick marks
                     - using ten minute blocks loop the entire length of the event and add placeholders
                     */


                    while( i <= eventLength ){
                        splitTime    = tempStartTime.split(':');
                        htmlData    += ' <li id="js-interval-'+ splitTime[0] + '-' + splitTime[1] +'" data-time="'+splitTime[0] +'-' + splitTime[1]+'" ><em>'+ splitTime[0] +':' + splitTime[1] + '</em></li>';
                        tempStartTime = me._addMinutes(tempStartTime,parseInt(jsonData.blockLengthMins));
                        i           += parseInt(jsonData.blockLengthMins);
                        waypoints.push('js-interval-'+ splitTime[0] + '-' + splitTime[1]);
                    }

                    htmlData +=         '</ul>' +
                        '<div class="events-grid">';

                })

                .then(function(){
                    $.each(jsonData.keynotes, function( index , keynote ) {
                        htmlData += '<div class="event-group double">' +
                            '<div class="event-super padding20">' +
                                '<div>' + keynote.startTime + ' - ' +  keynote.endTime + '</div>' +
                                    '<h2 class="no-margin">' + keynote.title + '</h2>' +
                                    '<h4 class="no-margin">' + keynote.presenter + '</h4>' +
                                    '<p>' + keynote.description + '</p>' +
                                '</div>' +
                            '</div>';
                    });
                })

                /*
                 Now me the meter is built you have to populate
                 the blocks inside the streams by padding the
                 stream with empty blocks if you ahve events me
                 start out of sequence. If you have more than one
                 event at the same time on the same track you need
                 to add the data-role live parent div to the elements.
                 */
                .then(function(){
                    var sessions;
                    htmlData += '<div class="event-group">';
                    $.each(jsonData.tracks, function( index, track) {
                        /*
                         Sort the track sessions by time
                         */
                        sessions = me._sortResults(track.sessions, "startTime", true);
                        var blockColor = track.blockColor;

                        htmlData += '<div class="event-stream" >';

                        $.each(sessions, function( index, session) {

                            htmlData += '<div class="event" >';

                            htmlData += '<div class="event-content" style="left: 0px;">'+
                                '<div class="event-content-logo">'+
                                //'<img class="icon" src="images/live1.jpg">'+
                                '<div class="time bg-' + blockColor + '">' + session.startTime + '</div>'+
                                '</div>'+
                                '<div class="event-content-data">'+
                                '<div class="title">Katerina Kostereva</div>'+
                                '<div class="subtitle">Terrasoft</div>'+
                                '<div class="remark">Create and develop a business without external investment</div>'+
                                '</div>'+
                                '</div>';
                            // console.log(session);
                            htmlData += '</div>';
                        });

                        htmlData += '</div>';

                    });

                    htmlData += '</div>';
                })

                .then(function(){
                    /*
                     Close the events container
                     */
                    htmlData +=  '</div>' +
                        '</div>' +
                        '</div>';
                    /*
                     Close the streamer
                     */
                    htmlData +=  '</div>' +
                        '</div>';
                })
                /*
                 Write out the events scroller to the page
                 */
                .then(function(){
					
                   // console.log(htmlData);
                    $('#' + me.option('containerId')).html(htmlData);
                })
                .then(function(){
					
                    /*
                        Add horizontal scrolling to the events pane
                    */
                    var element = $('#' + me.option('containerId'));

                    $('.events-area').mousewheel(function(event, delta){
                        var scroll_value = delta * 50;
                            $('#events-panel').scrollLeft($('.events').scrollLeft() - scroll_value);

                        return false;
                    });

                    /*
                        Add waypoints to the individual time <li> tags to make sure that
                        the scroller knows the position when the user clicks on the
                        next or previous button it will not jump to the front or
                        end of the timeline.
                    */
                    $.each(waypoints, function( index, waypoint ) {
                        $('#' + waypoint).waypoint(function() {
                            me.currentWaypoint = index;
                            },{
                                context     : $('.events'),
                                offset      : 142, // Width of track element
                                horizontal  : true
                        });
                    });
                        $("#previous-time").unbind('click').bind('click',function () {
                            $("#events-panel").stop(true,true);
                            me._moveTimeline(me,'down');
                        });
                        /* $("#next-time").bind('click',{
                         direction  : 'up',
                         self        :me
                         },me._moveTimeline);*/

                        $("#next-time").unbind('click').bind('click',function () {
                            $("#events-panel").stop(true,true);
                            me._moveTimeline(me,'up');
                        });



                        $("#all-streams").unbind('click').bind("click", function(e){
                            element.find(".event").removeClass("event-disable");
                            element.data('streamSelect', -1);
                            e.preventDefault();
                        });
                    /*
                        Add the diabled / enabled look to a stream
                    */
                    var events          =  element.find(".event"),
                        event_streams   =  element.find(".event-stream"),
                        streams         =  element.find(".stream");

                    events.mousedown(function(e){
                        if (e.altKey) {
                            $(this).toggleClass("selected");
                        }
                    });

                    streams.each(function(i, s){
                        $(s).mousedown(function(e){
                            if (element.data('streamSelect') == i) {
                                events.removeClass('event-disable');
                                element.data('streamSelect', -1);
                            } else {
                                element.data('streamSelect', i);
                                events.addClass('event-disable');
                                $(event_streams[i]).find(".event").removeClass("event-disable");
                            }
                        });
                    });

                    events.on('click', function(e){
                        e.preventDefault();
                        options.onClick($(this));
                    });




                });
        },

        _moveTimeline    : function(me,direction) {
            var //me = event.data.self,
                cw = me.currentWaypoint;

            cw = direction == 'up' ? cw + 1 : (cw - 1) <= 0 ? 0 : cw - 1;
           // me.option({'currentWaypoint':cw});
            me.currentWaypoint = cw;

            $('#events-panel').scrollTo( 213 * cw ,{duration:600}).promise().done(function(){
                me.currentWaypoint = cw;
            });

          return;
        },
	    // Sort JSON Object on a property
        _sortResults     : function(object, prop, asc) {
            object = object.sort(function(a, b) {
                if (asc) return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
                else return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            });
            return object;
        },

        // Add minutes to a time

        _addMinutes      : function(time,mins){
            var s        = time.split(':'),
                minutes  = parseInt(s[1]),
                hours    = parseInt(s[0]),
                pad      = "00";

                if( (minutes + mins) >= 60 ){
                    hours += 1;
                    minutes = (minutes + mins ) - 60;
                } else {
                    minutes = minutes + mins;
                }

            return hours.toString() + ':' +  pad.substring(0, pad.length - minutes.toString().length) + minutes.toString();
        },

        /*
            Returns the length of the event in minutes
        */

        _numMinutes        : function(start, end){
            var s = start.split(':'),
                e = end.split(':'),

                min = e[1]-s[1],
                hour_carry = 0;

            if(min < 0){
                min += 60;
                hour_carry += 1;
            }

            var hour = e[0]-s[0]-hour_carry,
                diff = (hour * 60) + min;

            return diff;
        },

        _destroy: function(){

        },

        _setOption: function( key, value ) {
            //console.log('Key' + key + ' Value = ' + value);
            if ( key === "currentWaypoint" ) {



            }

            this._superApply( arguments );
        }
 })
})( jQuery );