<?php include "templates/include/header.php" ?>


		<form action="admin.php?action=login" method="post">
			<input type="hidden" name="login" value="true">

<?php if (isset( $results['errorMessage'])) {?>
				<div class="errorMessage"><?php echo $results['errorMessage'] ?></div>	
<?php } ?>	

			<ul>

				<li>
					<label for="username">Benutzername</label>
					<input type="text" name="username" id="username" placeholder="Ihr Admin-Benutzername" required autofocus maxlength="20" />
				</li>

				<li>
					<label for="password">Passwort</label>
					<input type="text" name="password" id="password" placeholder="Passwort" required maxlength="20" />
				</li>

			</ul>

			<div class="buttons">
				<input type="submit" name="login" value="Login" />
			</div>
		</form>

<?php include "templates/include/footer.php" ?>

