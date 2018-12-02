<?php

/*ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);*/

include_once 'std.php';

$ini = parse_ini_file('config.ini', true);

function get_accounts($auth)
{
	global $ini;
	return make_request("https://sandbox.apis.op-palvelut.fi/v1/accounts", array('x-api-key' => $ini['keys']['api-key'], 'x-authorization' => $auth));
}

$_insts = array();
$_got_insts = false;

function get_instruments($auth)
{
	global $_insts, $_got_insts;

	if($_got_insts)
		return $_insts;

	global $ini;
	$r = make_request("https://sandbox.apis.op-palvelut.fi/instruments/mgmt/v1/instruments", array('x-api-key' => $ini['keys']['api-key'], 'x-authorization' => $auth));

	$_insts =  json_encode(json_decode($r, true)['instruments']);
	$_got_insts = true;
	return $_insts;
}

function isin_to_info($auth, $isin)
{
	$insts = json_decode(get_instruments($auth), true);
	$ret = array("name" => "", "price" => 0);

	foreach($insts as $inst)
	{
		if($inst["isinCode"] == $isin)
		{
			$ret['name'] = $inst["name"];
			$ret['price'] = $inst["value"];
		}

	}

	return $ret;
}

function get_isins($auth, $q)
{
	$insts = json_decode(get_instruments($auth), true);
	$ret = array();

	foreach($insts as $inst)
	{
		//echo json_encode($inst);
		if(strpos($inst["name"], strtoupper($q)) !== false)
		{
			array_push($ret, $inst["isinCode"]);
		}

	}

	return json_encode($ret);
}

//echo get_isins($_GET['auth'], "FORTUM");

function get_holdings($auth)
{
	global $ini;
	$r = make_request("https://sandbox.apis.op-palvelut.fi/v1/holdings", array('x-api-key' => $ini['keys']['api-key'], 'x-authorization' => $auth));

	$ret = json_decode($r, true)['instrumentHoldings'];

	for($i = 0; $i < count($ret); $i++)
	{
		$ret[$i]['ammount'] = intval($ret[$i]["marketValue"] / isin_to_info($auth, $ret[$i]["isinCode"])['price']);
	}

	return json_encode($ret, true);
}

function search_futurs($auth, $filters, $db)
{
	$apiKH = strtoupper(hash("sha256", $_GET['auth']));

	$query = "SELECT * FROM futures";

	$qs = array();

	if(array_key_exists("subtype", $filters))
	{
		$type = strtoupper($filters["subtype"]);
		array_push($qs, "type IS '$type'");
	}

	if(array_key_exists("underlying", $filters))
	{
		$qq = " ( ";
		$isins = json_decode(get_isins($auth, $filters['underlying']), true);
		for($i = 0; $i < count($isins); $i++)
		{
			if($i > 0)
				$qq .= " OR ";
			$qq .= "underlying IS '$isins[$i]'";
		}
		$qq .= " ) ";
		array_push($qs, $qq);
	}

	if($filters["own"])
		array_push($qs, "seller IS '$apiKH'");

	if(array_key_exists("id", $filters))
		array_push($qs, "id IS '$filters[id]'");

	if(array_key_exists("fMin", $filters) && is_numeric($filters["fMin"]))
		array_push($qs, "financing >= $filters[fMin]");

	if(array_key_exists("fMax", $filters) && is_numeric($filters["fMax"]))
		array_push($qs, "financing <= $filters[fMax]");

	if(array_key_exists("sMin", $filters) && is_numeric($filters["sMin"]))
		array_push($qs, "stoploss >= $filters[sMin]");

	if(array_key_exists("sMax", $filters) && is_numeric($filters["fMax"]))
		array_push($qs, "stoploss <= $filters[sMax]");

	if(count($qs) > 0)
		$query .= " WHERE $qs[0] ";

	for($i = 1; $i < count($qs); $i++)
		$query .= " AND " . $qs[$i];

	$query .= ";";

	$ret = array();

	//echo $query;
	$results = $db->query($query);
	while ($row = $results->fetchArray())
	{
		$info = isin_to_info($auth, $row[6]);
		$info['price'] -= $row[4];
		if($row[3] == "SHORT")
			$info['price'] *= -1;

		$namehash = hash("sha256", $row[6]);
		$pp = 0;

		foreach(str_split($namehash) as $char)
		{
			if(is_numeric($char))
				$pp += $char;
			else
				$pp *= -1;
		}

		while(abs($pp) > 1.0)
			$pp /= 2;

		if($row[3] == "SHORT")
			$pp *= -1;

		//$pp = intval($pp);

		array_push($ret, array( "id" => "f$row[0]",
		       			"name" => $row[1],
					"type" => "minifuture", 
					"subtype" => $row[3],
					"financingLevel" => $row[4],
					"stoplossLevel" => $row[5],
					"underlyingISIN" => $row[6],
					"underlyingName" => $info['name'],
					"price" => $info['price'],
					"pPrice" => $info['price'] + $pp,
					"pDelta" => doubleval($pp),
					"deltaPercent" => doubleval(intval($pp / ($info['price'] + $pp) * 1000) / 10)
				));
	}

	return json_encode($ret, true);
}

function make_new_future($auth, $db, $typeIn, $finLevel, $slLevel, $underlying)
{
	$apiKH = strtoupper(hash("sha256", $_GET['auth']));
	$type = strtoupper($typeIn);

	if($type != "LONG" && $type != "SHORT")
		return "no such length";

	$c = $db->query("SELECT COUNT(*) FROM futures WHERE seller IS '$apiKH' AND type IS '$type' AND underlying IS '$underlying';")->fetchArray()[0];
	//echo json_encode($c, true);
	$c = $c+1;
	$ca = $db->query("SELECT COUNT(*) FROM futures;")->fetchArray()[0];
	$ca = $ca+1;

	$username = $db->query("SELECT * FROM users WHERE hashed_key IS '$apiKH';")->fetchArray()[1];

	if(!$username)
		return "who dat?";

	$info = isin_to_info($auth, $underlying);
	if(!$info['name'])
		return "404 paper not found";

	$name = "MINI $type $info[name] $username $c";

	//echo "INSERT INTO futures VALUES($ca, '$name', '$apiKH', '$type', $finLevel, $slLevel, '$underlying');";
	$db->exec("insert into futures values($ca, '$name', '$apiKH', '$type', $finLevel, $slLevel, '$underlying');");

	return "yes, yes, very yes";
}

function buy_future($auth, $db, $id, $count)
{
	$apiKH = strtoupper(hash("sha256", $_GET['auth']));
	$utime = time();
	$sec = json_decode(search_futurs($auth, array("id" => ltrim($id, "f")), $db), true)[0];

	$db->exec("INSERT INTO holdings VALUES('$id', $count, '$apiKH', '$utime', $sec[price]);");

	return "yes, yes, very yes";
}

function my_holdings($auth, $db, $auki = false)
{
	$apiKH = strtoupper(hash("sha256", $_GET['auth']));
	$utime = time();

	$ret = array();
	
	$results = $db->query("SELECT * FROM holdings WHERE user IS '$apiKH';");
	while($row = $results->fetchArray())
	{
		$ret[$row["id"]] += $row["ammount"];
	}

	$ret2 = array();

	foreach($ret as $key => $value)
	{
		$back = array("id" => intval(substr($key, 1)), "type" => substr($key, 0, 1), "ammount" => $value);
	
		if($auki)
		{
			if($back['type'] == "f")
			{
				$back['json'] = json_decode(search_futurs($auth, array("id" => $back["id"]), $db))[0];
			}
		}

		array_push($ret2, $back);
	}

	return json_encode($ret2, true);
	//"yes, yes, very yes";
}


?>
