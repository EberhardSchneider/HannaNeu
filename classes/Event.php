<?php 
	/** 
	* Class to handle events
	**/

	class Event {

/**
*	@var int Event id From Database
**/
public $id = null;

/**
*	@var string Event's name
**/
public $title = null;

/**
*	@var string composer
**/
public $komponist = null;

/**
*	@var string Location of event
**/
public $ort = null;

/**
*	@var int Date of event
**/
public $datum = null;

/**
*	@var string Cast of event in JSON form
**/
public $besetzung = null;

/**
* @var boolean Is event displayed or not
**/
public $active = null;


/**
* Constructor, uses values supplied by array
*
* @param assoc Property values
*/

public function __construct( $data=array() ) {
	if ( isset ($data['id'] )) $this->id = (int) $data['id'];
	if ( isset ($data['title'] )) $this->title = utf8_encode( $data['title'] );
	if ( isset ($data['komponist'] )) $this->komponist = utf8_encode( $data['komponist'] );
	if ( isset ($data['ort'] )) $this->ort = utf8_encode( $data['ort'] );
	if ( isset ($data['datum'] )) $this->datum = (int) $data['datum'];
	if ( isset ($data['besetzung'] )) $this->besetzung = $data['besetzung'];
	if ( isset ($data['active'] )) $this->active = (int) $data['active'];
}


/**
* Sets object's properties using the edit form post values
*
* @param assoc The form post values
*/


public function storeFormValues( $params ) {

	// store all params
	$this->__construct( $params );

	// Parse and store date
	if ( isset($params['datum'])) {
	
			$date = explode( '-', $params['datum']);
			if ( count($date) == 3 ) {
				list( $y, $m, $d ) = $date;
				$this->datum = mktime( 0,0,0, $m, $d, $y);
			}
			
			
	} // if
} // storeFormValues


/**
* returns an Event object matching the given event ID
*
*	@param int The event ID
* @return Event|false
*/

public static function getEventById( $id ) {
	$conn = new PDO( DB_DSN, DB_USERNAME, DB_PASSWORD );
  $sql = "SELECT *, UNIX_TIMESTAMP(datum) AS datum FROM events WHERE id = :id";
  $st = $conn->prepare( $sql );
  $st->bindValue( ":id", $id, PDO::PARAM_INT );
  $st->execute();
  $row = $st->fetch();
  $conn = null;
  if ( $row ) return new Event( $row );
}

 /**
  * Returns all (or a range of) Event objects in the DB
  *
  * @param int Optional The number of rows to return (default=all)
  * @param string Optional column by which to order the articles (default="publicationDate DESC")
  * @return Array|false A two-element array : results => array, a list of Article objects; totalRows => Total number of articles
  */

  public static function getList( $numRows=1000000, $order="datum DESC" ) {
    $conn = new PDO( DB_DSN, DB_USERNAME, DB_PASSWORD );
    $sql = "SELECT SQL_CALC_FOUND_ROWS *, UNIX_TIMESTAMP(datum) AS datum FROM events ORDER BY " . $order . " LIMIT :numRows";
 		
    $st = $conn->prepare( $sql );
    $st->bindValue( ":numRows", $numRows, PDO::PARAM_INT );
    $st->execute();
    $list = array();
 
    while ( $row = $st->fetch() ) {
      $event = new Event( $row );
      $list[] = $event;
    }
 
    // Now get the total number of articles that matched the criteria
    $sql = "SELECT FOUND_ROWS() AS totalRows";
    $totalRows = $conn->query( $sql )->fetch();
    $conn = null;
    return ( array ( "results" => $list, "totalRows" => $totalRows[0] ) );
  }

	  public function insert() {
	  	// check if Event object has already ID
	  	if ( !is_null( $this->id ) ) trigger_error ( "Event::insert(): Attempt to insert an Event object that already has its ID property set (to $this->id).", E_USER_ERROR );

	  	// Insert new Event
	  	$conn = new PDO( DB_DSN, DB_USERNAME, DB_PASSWORD );
	    $sql = "INSERT INTO events ( title, komponist, ort, datum, besetzung, active ) VALUES ( :title, :komponist, :ort, FROM_UNIXTIME(:datum), :besetzung, :active )";
	    $st = $conn->prepare ( $sql );
	    $st->bindValue( ":title", $this->title, PDO::PARAM_STR );
	    $st->bindValue( ":komponist", $this->komponist, PDO::PARAM_STR );
	    $st->bindValue( ":ort", $this->ort, PDO::PARAM_STR );
	    $st->bindValue( ":datum", $this->datum, PDO::PARAM_INT );
	    $st->bindValue( ":besetzung", $this->besetzung, PDO::PARAM_STR );
	    $st->bindValue( ":active", $this->active, PDO::PARAM_INT );
	    $st->execute();
	    $this->id = $conn->lastInsertId();
	    $conn = null;
	  }

	public function update() {
		// check if Event has an ID
		if ( is_null( $this->id ) ) trigger_error( "Event::insert(): Attempt to update Event object which has no ID set yet", E_USER_ERROR );

		// Update event
		$conn = new PDO( DB_DSN, DB_USERNAME, DB_PASSWORD );
		$sql = "UPDATE events SET datum=FROM_UNIXTIME(:datum), title=:title, komponist=:komponist, ort=:ort, besetzung=:besetzung, active=:active WHERE id=:id";
		$st = $conn->prepare( $sql );
		$st->bindValue(":datum", $this->datum, PDO::PARAM_INT );
	 	$st->bindValue( ":title", $this->title, PDO::PARAM_STR );
	  $st->bindValue( ":komponist", $this->komponist, PDO::PARAM_STR );
	  $st->bindValue( ":ort", $this->ort, PDO::PARAM_STR );
		$st->bindValue( ":besetzung", $this->besetzung, PDO::PARAM_STR );
	  $st->bindValue( ":active", $this->active, PDO::PARAM_INT );
	  $st->bindValue( ":id", $this->id, PDO::PARAM_INT );
	  $st->execute();
	  $conn = null;
	}

	public function delete() {

		if ( is_null( $this->id ) ) trigger_error ( "Event::delete(): Attempt to delete an Event object which has no ID set yet (to $this->id).", E_USER_ERROR );

		// Delete the Event
		$conn = new PDO( DB_DSN, DB_USERNAME, DB_PASSWORD );
		$st = $conn->prepare( "DELETE FROM events WHERE id=:id");
		$st->bindValue( ":id", $id, PDO::PARAM_INT );
		$st->execute();
		$conn = null;
	}

} // class
