<?php include "templates/include/header.php" ?>

	<div class="adminHeader">
		<h2>hannaherfurtner.de Administration</h2>
		<p>Sie sind als <strong><?php echo htmlspecialchars($_SESSION['username']) ?></strong> eingeloggt.</p>
	</div>

	<h1><?php echo $results['pageTitle'] ?></h1>

	<div class="form-wrapper">

	<form action="admin.php?action=<?php echo $results['formAction'] ?>" method="post" id="edit-form">
		<input type="hidden" name="eventId" value="<?php echo  $results['event']->id ?>" />

<?php if ( isset( $results['errorMessage'] ) ) { ?>
			<div class="errorMessage"><?php echo $results['errorMessage'] ?></div>	
<?php } ?>
	
		<ul>
			
			<li>
				<label for="datum">Datum</label>
				<input type="date" name="datum" id="datum"  placeholder="JJJJ-MM-DD" required maxlength="10" 
					value="<?php echo date('Y-m-d', $results['event']->datum ) ?>">
			</li>

			<li>
				<label for="komponist">Komponist</label>
				<input type="text" name="komponist" id="komponist" placeholder="Komponist" required maxlength="50" value="<?php echo $results['event']->komponist ?>" />
			</li>

			<li>
				<label for="title">Name</label>
				<input type="text" name="title" id="title" placeholder="title" required maxlength="50" value="<?php echo $results['event']->title ?>" />
			</li>

			<li>
				<label for="ort">Ort</label>
				<input type="text" name="ort" id="ort" placeholder="ort" required maxlength="50" value="<?php echo $results['event']->ort ?>" />
			</li>

			<li>
				<label for="besetzung">Besetzung</label>
				<textarea name="besetzung" id="besetzung" cols="50" rows="20"><?php echo $results['event']->besetzung ?></textarea>
			</li>


		</ul>

		<div class="buttons">
			<input type="submit" name="saveChanges" value="Änderungen speichern" />
			<input type="submit" formnovalidate name="cancel" value="Verwerfen" />
		</div>

	</form>
	</div> <!-- form-wrapper -->
	<div class="preview">
		
	</div>

	<?php if ( $results['event']->id ) { ?>
		<p><a href="admin.php?action=deleteEvent&amp;eventId="<?php echo $results['article']->id ?>">Veranstaltung löschen</a></p>
<?php } ?>	
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
		<script src="jsIncludes/jquery.maskedinput.min.js"></script>
<script>
	$(function() {
				$('#besetzung').html( besetzungToString( $('#besetzung').val() ));

				$('#edit-form').submit(function () {
					$('#besetzung').val( stringToBesetzung( $('#besetzung').val() ));
							return true;
					});
			});
</script>	

<?php include "templates/include/footer.php" ?>