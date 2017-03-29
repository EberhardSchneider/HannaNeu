		</div>

		
		<script>
			

			

			function besetzungToString( besetzung ) {
				html = "";
				arr = JSON.parse( besetzung );
				$.each(arr, function(index, element) {
					html += index + ": " + element + "\n";
				});
				return html;
			}

			function stringToBesetzung( besetzung ) {
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

		</script>
	</body>
</html>