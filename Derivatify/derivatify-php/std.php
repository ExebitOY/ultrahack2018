<?php


/* Field syntax:
 *
 * [ name in json, header, (align) ]
 */

function tablify_json($json, $fields)
{
	$ret = "";

	$ret .= "<table>";

	$ret .= "<tr class='table-header'>";
	foreach($fields as $f)
		$ret .= "<th>$f[1]</th>";

	$r = true;

	$arr = json_decode($json, true);
	foreach($arr as $row)
	{
		$ret .= "<tr class='" . ($r ? "row-odd" : "row-even")  .  "'>";

		foreach($fields as $f)
			$ret .= "<td " . (sizeof($f) >= 3 ? "align='$f[2]'" : "") . ">" . $row[$f[0]] . "</td>";

		$ret .= "</tr>";

		$r = !$r;
	}

	$ret .= "</table>";

	return $ret;
}

function make_request($url, $headers)
{
	$httpheaders = "";
	foreach($headers as $key => $value)
		$httpheaders .= "$key: $value\r\n";

	$opts =	array('http' => array('header' => $httpheaders));
	$context = stream_context_create($opts);
	$response = file_get_contents($url, false, $context);

	//echo json_encode($opts);
	
	return $response;
}

?>
