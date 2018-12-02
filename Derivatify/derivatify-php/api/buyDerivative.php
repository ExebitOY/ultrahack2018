<?php

include_once "../api.php";

$ini = parse_ini_file('../config.ini', true);
$db = new SQLite3("../" . $ini['db']['db']);

echo buy_future($_GET['auth'], $db, $_GET['id'], $_GET['count']);

/*switch($_GET['id'])
{
case 'd000000001':
	echo '{ "type": "mini", "name": "MINI LONG FORTUM FurCuber 1", "underlying": "FORTUM", "underlyingIsin": "FI0009007132", "financingLevel": 15, "stoplossLevel": 16, "price": 4 }';
	break;
case 'd000000002':
	echo '{ "type": "mini", "name": "MINI LONG FORTUM FurCuber 2", "underlying": "FORTUM", "underlyingIsin": "FI0009007132", "financingLevel": 16, "stoplossLevel": 17, "price": 3 }';
	break;
case 'd000000003':
	echo '{ "type": "mini", "name": "MINI SHORT NOKIA FurCuber 1", "underlying": "NOKIA", "underlyingIsin": "FI0009000681", "financingLevel": 6, "stoplossLevel": 5.5, "price": 1.2 }';
	break;
}*/

?>
