// define(["jquery"], function($){
	
	$.fn.countdownTimer = function(options){
		
		var defaults = {
			parentHide : false, // Set the class of a different parent element if you want to hide from this level instead.
			cutOffTime : null,  // The cut off time for the countdown timer. Default is null and will not show the timer.
			serverTime : null, // Use this if you want to pass in the server time.
			format : "HMS", // Set the format of the clock, default is HMS where H = Hours, M = Minutes and S = Seconds. Days are also available as D.
			seperator : ":", // The seperator to go inbetween the numbers when labels are switched off.
			showLabels : false, // This is the option where you can choose whether to have labels on or off.
			labels : ["Days", "Hours", "Minutes", "Seconds"], // The default labels used when they are switched on.
			timerClass : "" // Here you can add a custom class to the <p> which wraps the countdown time
		};
		
		var options = $.extend(defaults, options);
		
		var D = 0, // Days
			H = 1, // Hours
			M = 2, // Minutes
			S = 3; // Seconds
		
		var _utils = {
			
			times : [0,0,0,0],
			
			_processTimes : function(difference){
				this.times[D] = Math.floor(difference/1000/60/60/24),// Work out the days remianing
				this.times[H] = Math.floor(difference/1000/60/60%24),// Work out the hours remaining
				this.times[M] = Math.floor(difference/1000/60%60), // Work out the minutes remaining
				this.times[S] = Math.floor(difference/1000%60); // Work out the seconds remaining
				for (var i=0; i < this.times.length; i++){ // This adds a leading 0 to any numbers that are less than 10 so that they are formatted correctly
					if (this.times[i] < 10) {
						this.times[i] = "0" + this.times[i];
					}
				}
			},
			
			_build_show : function(){
				var format = options.format,
					show = [];
					
				show[D] = (format.match('D') ? 'show' : null);
				show[H] = (format.match('H') ? 'show' : null);
				show[M] = (format.match('M') ? 'show' : null);
				show[S] = (format.match('S') ? 'show' : null);
				return show;
			},
			
			_build_time : function(){
				var seperator = options.seperator,
					show = this._build_show(),
					labels = options.labels,
					timerClass = options.timerClass;
					
				var html = '<div class="countdown-time ' + timerClass + '">';
				if (options.showLabels === true) {
					if (show[D]){
						html += '<span class="countdown-amount">' + this.times[D] + '</span><span class="countdown-label">' + labels[D] + '</span>';
					}
					if (show[H]){
						html += '<span class="countdown-amount">' + this.times[H] + '</span><span class="countdown-label">' + labels[H] + '</span>';
					}
					if (show[M]){
						html += '<span class="countdown-amount">' + this.times[M] + '</span><span class="countdown-label">' + labels[M] + '</span>';
					}
					if (show[S]) {
						html += '<span class="countdown-amount">' + this.times[S] + '</span><span class="countdown-label">' + labels[S] + '</span>';
					}
				}
				else {
					if (show[D]){
						html += this.times[D]
							if (show[D] && show[H]) {
								html += seperator;
							}
					}
					if (show[H] && show[M]){
						html += this.times[H] + seperator;
					}
					if (show[M] && show[S]){
						html += this.times[M] + seperator;
					}
					if (show[S]) {
						html += this.times[S]
					}
				}
				html += '</div>';
				return html;
			},
			
			_render_html : function(countdown){
				html = this._build_time();
				countdown.html(html);
			}
		};
		
		return this.each(function() {	
			
			var $this = $(this);
			
			if (options.parentHide.length){
				$wrapper = $("." + options.parentHide);
			}
			else {
				$wrapper = $this;
			} 
			$wrapper.hide();
			
			var currentTime = options.serverTime || new Date(),
				difference = options.cutOffTime - currentTime; //Find the difference in the target time and the current time.
		
			siteObj.fn.log(currentTime + " & " + options.cutOffTime + " & " + difference);
			
			var update_timer = function() {
				
				if ((difference >= 1000) && (options.cutOffTime != null)){
					$wrapper.show();
					difference = difference - 1000;// Take off 1 second from the original time.

					_utils._processTimes(difference);
					_utils._render_html($this);
					// siteObj.fn.log(_utils.times)
				}
				else {
					$wrapper.hide();
					clearInterval(update_timer);
				}
			}
		
			window.setInterval(update_timer, 1000);
		});
	};
// });