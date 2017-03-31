<?php include  TEMPLATE_PATH . "/include/admin-header.php" ?>

	<div class="adminHeader">
		<h1>Termine für hannaherfurtner.de</h1>
		<p>Sie sind als <strong><?php echo htmlspecialchars($_SESSION['username']) ?></strong> eingelogt.</p>
		<p><a href="admin.php?action=logout">Ausloggen</a></p>
	</div>

	<?php if ( isset( $results['errorMessage'] ) ) { ?>	
	<div class="errorMessage"><?php echo $results['errorMessage'] ?></div>
<?php }  ?>

<?php if ( isset( $results['statusMessage'] ) ) { ?>	
	<div class="statusMessage"><?php echo $results['statusMessage'] ?></div>
<?php }  ?>
<div class="events-list">
	<h2>Alle Veranstaltungen</h2>
	<p><a href="admin.php?action=newEvent">Neue Veranstaltung hinzufügen.</a></p>



	<table>
		<tr>
			<th>Datum</th>
			<th>Ort</th>
			<th>Name</th>
		</tr>

<?php foreach( $results['events'] as $event) { ?>
		<tr onclick="location='admin.php?action=editEvent&amp;eventId=<?php echo $event->id ?>'">
			<td><div class="table-date"><?php echo date("d. m. Y", $event->datum)  ?></div></td>
			<td><div class="table-ort"><?php echo $event->ort ?></div></td>
			<td><div class="table-title"><?php echo $event->title ?></div></td>
		</tr>
<?php } ?>

	</table>

	<p><?php echo $results['totalRows'] ?> Veranstaltung<?php echo ($results['totalRows'] != 1 ) ? "en": ""?> insgesamt.</p>

	

</div>
<?php include TEMPLATE_PATH . "/include/footer.php" ?>