(function($){

	var Schedule = {
		variables: {
			step: 30, //minutes
			step_height: 50, // Px
			start: '2016-05-16 00:00:00',
		},
		initialize: function() {
			// Render week headers
			for (var i = 0;i<7;i++) {
				var day = moment(this.variables.start).add(i,'days');
				$(".week-header .column-day:eq("+i+")").html(day.format("ddd DD"));
			}
			// Render schedule
			for (var i = 0;i<24*60/this.variables.step;i++) {
				var time = moment(this.variables.start).add(i*this.variables.step,'minutes');
				var step_element = $("<div class='step'>"+time.format("HH:mm")+"</div>");
				step_element.css({height: this.variables.step_height+"px"});
				$(".steps").append(step_element);
			}
			$(".schedule-container").css({
				height: $(".steps").height()+"px"
			});

			// Fetch data

			$.getJSON("../static/js/data.json",function(r){
				console.log("Process me");
				// console.log(r);
				var hours = r['data']
				var sorted = _.sortBy(hours, "start_at")
				n = sorted.length
				lastHour = ""
				numObj = 0
				count_margin = 0
				for(var i = 0;i<n;i++){

					dayHour = String(sorted[i]['start_at'].substr(8,3))
					start_at = String(sorted[i]['start_at'].substr(10,11))
					due_at = String(sorted[i]['due_at'].substr(10,11))
					if(i==0){
						lastHour = due_at
					}

					iniHours = start_at.substr(0,3);
					finHours = due_at.substr(0,3);
					iniMinutes = start_at.substr(4,2);
					finMinutes = due_at.substr(4,2);

					longHour =  parseInt(finHours) - parseInt(iniHours)
					longMinutes =  parseInt(finMinutes) - parseInt(iniMinutes)

					if(longHour>0){
						totalPixelesH= longHour* 100}
					else{totalPixelesH= 0}

					if(longMinutes>0){
						totalPixelesM= 50}
					else{totalPixelesM= 0}
					totalPixeles = totalPixelesH +totalPixelesM

					marginTop = parseInt(iniHours) * 100
					if(iniMinutes > 0){
						marginTop = marginTop+50
					}
					if(start_at >= lastHour || numObj > 2)
					{
						if(count_margin > 1){
							var hour_element = $("<div class='hour' style='width:50px ;height: "+totalPixeles+"px; margin-top:"+marginTop+"px; margin-left: -50px;'></div>");
							count_margin = 0
						}else{
							var hour_element = $("<div class='hour' style='width:50px ;height: "+totalPixeles+"px; margin-top:"+marginTop+"px; margin-left: -100px;'></div>");
							count_margin = count_margin +1
						}

						numObj = 0
					}else{
						var hour_element = $("<div class='hour' style='width:50px ;height: "+totalPixeles+"px; margin-top:"+marginTop+"px;'></div>");
						numObj = numObj +1
						count_margin = 0
					}
					lastHour = due_at

					// $(".schedule-container .column-day:eq("+0+")").append(hour_element);
					// obtener dia y ordenar en base a esto
					for (var x = 0;x<7;x++) {
						var day = moment(Schedule.start).add(x,'days');
						dayM = day.format("DD");
						if(parseInt(dayHour) == parseInt(dayM)){
								colum = x
								$(".schedule-container .column-day:eq("+colum+")").append(hour_element);
						}else{
							console.log('error');
						}

					}

				}

				// console.log($( ".column-day").contents().find( "Mon 16" ));

				// $( ".column-day").contents().find( "Mon 16" ).append( "<p>Test</p>" );

			}).error(function(err){
				console.log(err);
			})
		}
	}

	Schedule.initialize();

})(jQuery);
