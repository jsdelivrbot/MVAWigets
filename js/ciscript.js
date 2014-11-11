$(function(){
	(function(){

		var ciWidget = {
			init: function(config){
				this.$target = $(config.target); // set target
				this.apiUrl = config.apiUrl;
				this.apiKey = config.apiKey;
				this.electionId = config.electionId;

				this.getUrl = config.getUrl; // location to server
				this.buildLayout();

				var params = document.URL.split('?')[1];

				var candidatenparam = params.split('&')[0];
				var addressparam = params.split('&')[1];

				var candidatename = candidatenparam.split('=')[1].split('%20').join(' ');
				var address = addressparam.split('=')[1].split('%20').join(' ');

								//console.log("hello i am in init " + candidatename);
								//console.log("hello i am in init " + address);

				this.sendAjaxRequest(address,candidatename);

			},

			buildLayout: function(){


				var layout = "<div id='pl-targetInner'"
									+"<div class='row' id='top'>"
									+"<div id='top' class='col-xs-12'>"
									+"</div>"
									+"<div class='row'>"
									+"<div id='leftPart' class='col-xs-12 col-sm-3'>"
									+"</div>"
									+"<div id='rightPart' class='col-xs-12 col-sm-8'> </div>"
									+"</div>"
									+"</div>"
									+"</div>"
									+"</div>"

					this.$target.append(layout);
			},

			sendAjaxRequest: function (addressCon,candidatenameCon) {
				$('#pl-search').append(' <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>'); //add loading
				$('.location-item').remove(); // remove location


				
				var address = addressCon;
				var name = candidatenameCon;
				
				var jsonUrl = this.apiUrl+'address='+encodeURIComponent(address)+'&electionId='+this.electionId+'&key='+this.apiKey;

				
				var name = candidatenameCon;
				


				$.ajax({ // send ajax request
					type:'GET',
					url: jsonUrl,
					dataType: 'json',
					//success: ciWidget.jsonParser(addressCon,jsonUrl,name)
					success: function(data){ ciWidget.jsonParser(addressCon,jsonUrl,name,data) }
				});


			},
			jsonParser: function (address,GCurl,name,data){

				var $top = $('#top');
				var $left = $('#leftPart');
				var $right = $('#rightPart');
				var candidateName = name;
				console.log("data: ");
				console.log(data);
				$.get(GCurl,function(data){
					if(data.contests.length > 0){ // validate data

						var edata = data; //convert json to javascript object


						for (var i = edata.contests.length - 1; i >= 0; i--) {

							var candidates = edata.contests[i].candidates;
							console.log(candidates);

							for (var j = candidates.length - 1; j >= 0; j--) {
								if(candidates[j].name == candidateName){


								//$top.append('<h2>'+candidates[j].name+'</h2>');
								//$top.append('<div id="namePanel" class="panel panel-primary"></div>');


								$top.append('<h2>Candidate Information</h2>');
								$top.append('<div id="namePanel" class="panel panel-primary"></div><br>')
								$right.append('<h3 style="color:#064479">'+candidates[j].name+'</h2>');
								

								if (candidates[j].party.length > 0)
									$right.append('<h4>Party : ' + candidates[j].party +'<br></h4>');
								else
									$right.append('<h4>'+'  '+'Party : N/A <br></h4>');


								if (candidates[j].hasOwnProperty("candidateUrl"))
									$right.append('<h4>'+'  '+'Candidate URL : ' +'<a href="'+ candidates[j].candidateUrl +'">' +candidates[j].candidateUrl+'</a><br></h4>');
								else
									$right.append('<h4>'+'  '+'Candidate URL : N/A <br></h4>');


								if (candidates[j].hasOwnProperty("phone"))
									$right.append('<h4>'+'  '+'Phone : ' + candidates[j].phone +'<br></h4>');
								else
									$right.append('<h4>'+'  '+'Phone : N/A <br></h4>');


								if (candidates[j].hasOwnProperty("photoUrl"))
									$left.append('<img src="'+candidates[j].photoUrl+'" alt="'+candidates[j].name+'"/>' +'<br></h4>');
								else
									$left.append('<img src="http://www.dspsjsu.org/wp-content/uploads/2012/07/no-profile-img.gif" alt="noPhoto"/>');

								if (candidates[j].hasOwnProperty("email"))
									$right.append('<h4>'+'  '+'E-mail : ' +'<a href="'+ candidates[j].email +'">' +candidates[j].email+'</a><br></h4>');
								else
									$right.append('<h4>'+'  '+'E-mail : N/A <br></h4>');

								if (candidates[j].hasOwnProperty("channels")){
									$right.append('<h4>Channels : <br></h4>');
									var channels = candidates[j].channels;

										for (var k = 0; k<channels.length; k++){
											$right.append('<h5>Type: '+channels[k].type+'<br></h5>');
											$right.append('<h5>ID: <a href="'+channels[k].id+'">'+channels[k].id+'"</a><br></h5>');
										};

								}
								else
									$right.append('<h4>'+'  '+'Channels : N/A <br><br><br></h4>');



                                $right.append('<input type="button" onclick="history.back();" value="Back">');
                                $right.append('<br><br><br>');
								//$targetInner.append('<br><br><br>');

							}



							else{
								//$top.append('<br><br><br>');
							}
						};


						};



					} else { // if no data
						$top.append('<h2 class="location-item">invalid input</h1>');
						$top.append('<input type="button" onclick="history.back();" value="Back">');
					}
					$('.glyphicon-refresh').remove();// remove loading
				});
			},
			getComma: function (zip){
				if(zip){
					return ', ';
				} else {
					return ' ';
				}

			}

		}; // end of ciWidget object


		ciWidget.init({ //initialize with target and location to GC server app
			target: '#target-practice',
			apiUrl:'https://www.googleapis.com/civicinfo/v2/voterinfo?',
			apiKey:'AIzaSyDZxb_ROtxLItUxvx8pltmml2T39l6FfsM',
			electionId:'2000'
			//getUrl: 'http://localhost:8888/AjaxTemplate/server/server.php?a='
		});

	})(); // end of self invoking function
});
