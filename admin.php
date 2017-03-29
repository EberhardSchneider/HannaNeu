<?php 
	include( "config.php" );
	session_start();

	$action = isset( $_GET['action'] ) ? $_GET['action'] : "";
	$username = isset( $_SESSION['username'] ) ? $_SESSION['username'] : "";

	if ( $action != "login" && $action != "logout" && !$username ) {
		login();
		exit;
	}

	switch( $action ) {
		case 'login':
			login();
			break;
		case 'logout':
			logout();
			break;
		case 'newEvent':
			newEvent();
			break;
		case 'editEvent':
			editEvent();
			break;
		case 'deleteEvent':
			deleteEvent();
			break;
		default:
			listEvents();
	}



	function login() {
		$results = array();
		$results['pageTitle'] = "Administrator Login | Hanna Herfurtner";

		if ( isset($_POST['login'] ) ) {
			// User has posted login form
			if ( $_POST['username']  == ADMIN_USERNAME && $_POST['password'] == ADMIN_PASSWORD ) {
				// Success !!
				$_SESSION['username'] = ADMIN_USERNAME;
				header( "Location: admin.php" );
			}
			else {
				// Login failed
				$results['errorMessage'] = "Falscher Benutzername oder falsches Passwort.";
				require( TEMPLATE_PATH . "/admin/loginForm.php");
			}
		}
		else {
				// No login posted yet, show login form
				require( TEMPLATE_PATH . "/admin/loginForm.php");
		}
	}

	function logout() {
		unset( $_SESSION['username'] );
		header( "Location: admin.php");
	}

	function newEvent() {

		$results = array();
		$results['pageTitle'] = "Neuer Termin";
		$results['formAction'] = "newEvent";

		if ( isset( $_POST['saveChanges'] ) ) {
			// User has posted Event edit form, save the event
			$event = new Event();
			$event->storeFormValues( $_POST );
			$event->insert();
			header( "Location: admin.php?status=changesSaved" );
		}
		elseif ( isset( $_POST['cancel'] ) ) {
			header( "Location: admin.php" );
		}
		else {
			// User has not posted form yet, show edit form
			$results['event'] = new Event();
			require( TEMPLATE_PATH . "/admin/editArticle.php" );
		}
	}

function editEvent() {
	$results = array();
	$results['pageTitle'] = "Termin editieren";
	$results['formAction'] = "editEvent";

	if ( isset( $_POST['saveChanges'] ) ) {
			// User has posted Event edit form, save the event

		
		if ( !$event = Event::getEventById( (int) $_POST['eventId'] ) ) {
			header("Location: admin.php?error=eventNotFound");
			return;
		}

			$event->storeFormValues( $_POST );
			$event->update();
			header( "Location: admin.php?status=changesSaved" );
		}
		elseif ( isset( $_POST['cancel'])) {
			// User canceled edit form: return to article list
			header("Location: admin.php");
		}
		else {
			// User has not posted anything yet, show edit form
			$results['event'] = Event::getEventById( (int) $_GET['eventId'] );
			require( TEMPLATE_PATH . "/admin/editEvent.php" );
		}
}

function deleteEvent() {
	if ( !$article = Event::getArticleById( (int)$_GET['id'])) {
		header("Location: admin.php?error=eventNotFound");
		return;
	}

	$article->delete();
}

function listEvents() {
	$results = array();
	$data = Event::getList();
	$results['events'] = $data['results'];
	$results['totalRows'] = $data['totalRows'];
	$results['pageTitle'] = "Alle Veranstaltungen";

	if ( isset($_GET['error'])) {
		if ($_GET['error'] == "eventNotFound") $results['errorMessage'] = "Error: Event not found";
	}	

	if ( isset( $_GET['status'] ) ) {
		if ( $_GET['status'] == "changesSaved") $results['statusMessage'] = "Änderungen erfolgreich gespeichert!";
		if ( $_GET['status'] == "eventDeleted") $results['statusMessage'] = "Veranstaltung gelöscht";
	}

	require( TEMPLATE_PATH . "/admin/listEvents.php" );
}

?>