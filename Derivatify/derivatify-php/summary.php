<?php

include_once 'std.php';
include_once 'api.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$ini = parse_ini_file('config.ini', true);

//echo $ini["keys"]["api-key"] . "<br>";

//foreach($ini["keys"]["auth-key"] as $k)
//	echo $k . "<br>";

//$response = make_request("https://sandbox.apis.op-palvelut.fi/v1/accounts", array('x-api-key' => $ini['keys']['api-key'], 'x-authorization' => $_GET['auth']));

include 'header.html';

$db = new SQLite3($ini['db']['db']);
$apiKH = strtoupper(hash("sha256", $_GET['auth']));

echo "Logged in as " . $db->query("SELECT * FROM users WHERE hashed_key IS '$apiKH';")->fetchArray()[1] . "<hr>";

echo tablify_json(get_accounts($_GET['auth']), array(array('accountName', 'Account'), array('iban', 'IBAN'), array('balance', 'Balance', 'right'), array('amountAvailable', 'Usable', 'right')));

// Doesn't belong on this page
echo tablify_json(get_instruments($_GET['auth']), array(array('name', 'Security'), array('value', 'Value', 'right'), array('currency', 'Currency'), array('marketPlace', 'Exchange'), array('isinCode', 'ISIN')));

echo tablify_json(get_holdings($_GET['auth']), array(array("instrumentName", "Name"), array("isinCode", "ISIN"), array("ammount", "You have"), array("marketValue", "Market value")));

echo tablify_json(search_futurs($_GET['auth'], array(), $db), array(array("name", "Name"), array("price", "Price"), array("pDelta", "Change"), array("subtype", "Type"), array("financingLevel", "Financing level"), array("stoplossLevel", "Stop loss level"), array("underlyingName", "Underlying")));


include 'footer.html';

?>
