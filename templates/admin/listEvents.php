<?php include  TEMPLATE_PATH . "/include/header.php" ?>

	<div class="adminHeader">
		<h2>Termine für hannaherfurtner.de</h2>
		<p>Sie sind als <strong><?php echo htmlspecialchars($_SESSION['username']) ?></strong> eingelogt.</p>
		<p><a href="admin.php?action=logout">Ausloggen</a></p>
	</div>

	<h1>Alle Veranstaltungen</h1>

<?php if ( isset( $results['errorMessage'] ) ) { ?>	
	<div class="errorMessage"><?php echo $results['errorMessage'] ?></div>
<?php }  ?>

<?php if ( isset( $results['statusMessage'] ) ) { ?>	
	<div class="statusMessage"><?php echo $results['statusMessage'] ?></div>
<?php }  ?>

	<table>
		<tr>
			<th>Datum</th>
			<th>Ort</th>
			<th>Name</th>
		</tr>

<?php foreach( $results['events'] as $event) { ?>
		<tr onclick="location='admin.php?action=editEvent&amp;eventId=<?php echo $event->id ?>'">
			<td><?php echo date("d. m. Y", $event->datum)  ?></td>
			<td><?php echo $event->ort ?></td>
			<td><?php echo $event->title ?></td>
		</tr>
<?php } ?>

	</table>

	<p><?php echo $results['totalRows'] ?> Veranstaltung<?php echo ($results['totalRows'] != 1 ) ? "en": ""?> insgesamt.</p>

	<p><a href="admin.php?action=newEvent">Neue Veranstaltung hinzufügen.</a></p>

<?php include TEMPLATE_PATH . "/include/footer.php" ?>