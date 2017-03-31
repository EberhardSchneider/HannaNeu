		</div>

		
		<script>
			

			function besetzungToString( besetzung ) {
				if (besetzung == "") return "";
				html = "";
				arr = JSON.parse( besetzung );
				$.each(arr, function(index, element) {
					html += index + ": " + element + "\n";
				});
				return html;
			}

			function stringToBesetzung( besetzung ) {
				if (besetzung == "") return "{}";
				jsonString = "{ ";
				arr = besetzung.trim().split("\n");
				arr.forEach(function(element) {
					parts = element.split(":");
					jsonString += "\"" + parts[0].trim() + "\": \"" + parts[1].trim() + "\",";
				});
				jsonString = jsonString.substring(0, jsonString.length-1);
				jsonString += " }";
				return jsonString;
			} 

			function showPreview() {
				// handle date
				date = $('#datum').val();
				dateComponents = date.split("-");
				newDate = dateComponents[2] + ". " + dateComponents[1] + ". " + dateComponents[0];

				html = "";
				html += '<div class="event"><div class="event-up">';
				html += '<div class="komponist">' + $("#komponist").val() + '</div>';
				html += '<div class="title">'+ $("#title").val() +'</div>';
				html += '<div class="ort">'+ $("#ort").val() +'</div>';
				html += '</div>';
				html += '<div class="event-date">';
				html += '<div class="datum">'+ newDate +'</div>';
				html += '</div>';

				besetzung = JSON.parse( stringToBesetzung( $('#besetzung').val() ) );
				besetzungHTML = "";

				$.each( besetzung, function( rolle, darsteller ) { 
					if ( rolle.substring(0, 1) != "-" ) {			
						besetzungHTML  += "<div class='zeile'><span class='rolle'>"+ rolle +":</span><span class='darsteller'>"+ darsteller +"</span></div>";
					}
					else {		// if rolle starts with "-", there is only one line which has to be centered, stored in "darsteller"
						besetzungHTML +="<div class='zeile'><div class = 'one-line'>" + darsteller + "</div></div>";
					}
				});
				html += '<div class="card"><div class="event-low"><div class="besetzungHTML ">'+ besetzungHTML +'</div></div></div>';


				$('.preview').html( html );
			}

		</script>
	</body>
</html>