<?php
include("Database.php");

class Api{	
	public function __construct($get, $data){
		$this->data = (array)  json_decode($data);
		//print_r($this->data);
		$this->db = Database::getInstance();
		
		if($get['akce']=="getUsername"){
			$ret = $this->getUsername($this->data["user"]);
			$this->returnData($ret);	
		}
		if($get['akce']=="insertScore"){
			if(count($this->data) != 0){
				$ret = $this->insertScore($this->data);
				$this->returnData($ret);
			}
		}
		if($get['akce']=="loadScore"){
			$ret = $this->loadScore($this->data["input"], $this->data["group"]);
			$this->returnData($ret);	
		}
	}
	
	public function getUsername($user){
		$sql = "select * from ch_score where nick='".x($user)."' ";
		$query = $this->db->query($sql);
		if(mysql_num_rows($query)>=1){
			return array("result"=>"exists", "message"=>" ".$user." existuje");
		}else{
			return array("result"=>"notexists", "message"=>"jmeno ".$user." je volne");
		}
	}
	
	public function insertScore($data){
		$sql = "insert into ch_score set score = '".x($data["score"])."', avg_time = '".x($data["avgTime"])."', nick = '".xh($data["nick"])."', input = '".x($data["input"])."',
				 missed = '".x($data["missed"])."',group_name = '".xh($data["groupName"])."',  date = curdate(), time = curtime() ";
		
		if($data["groupName"]!=""){
			$this->handleGroupThings($data["nick"], $data["groupName"]);
		}
		///
		if($this->db->query($sql)){
			return array("result"=>"success", "message"=>"inserted");
		}else{
			return array("result"=>"fail", "message"=>"score db save problem: ".$sql);
		}
		//print_r($data);
	}
	
	private function handleGroupThings($nick, $group){
		if(!$this->isGroupExists($group)){
			$this->createGroup($group, $nick);
		}
		if(!$this->isMemberOfGroup($nick, $group)){
			//if($this->isMemberOfAnyGroup($nick)){
				$this->removeFromContemporaryGroups($nick);
			//}
			$this->addMemberToGroup($nick, $group);
		}
	}
	private function isGroupExists($group){
		$query = $this->db->query("SELECT * FROM `ch_groups` where name='".xh($group)."' ");
		if(mysql_num_rows($query) == 0){
			return false;
		}else{
			return true;
		}
	}
	private function createGroup($group, $nick){
		$query = $this->db->query("insert into `ch_groups` set name='".xh($group)."', founder='".xh($nick)."' ");
	}
	private function isMemberOfGroup($nick, $group){
		$query = $this->db->query("select * from  `ch_group_members` where user='".xh($nick)."' and idg='".xh($group)."' ");
		//echo ">".mysql_num_rows($query)."<";
		if(mysql_num_rows($query) > 0){
			return true;
		}else{
			return false;
		}
	}
	private function removeFromContemporaryGroups($nick){
		$query = $this->db->query("delete from `ch_group_members` where user='".xh($nick)."'  ");
	}
	private function addMemberToGroup($nick, $group){
		$query = $this->db->query("insert into `ch_group_members` set user='".xh($nick)."' , idg='".xh($group)."' ");
	}
	
	public function loadScore($input, $group){
		$inputOptions = array("mouse", "touchpad", "finger", "other");
		if(!in_array($input, $inputOptions)){
			$input = "%";
		}
		/*$sqlBezGroups = "
				SELECT t.*, 
					   o.games 
				FROM   ch_score AS t 
					   JOIN (SELECT Max(score)  AS score, 
									Count(nick) AS games 
							 FROM   ch_score 
							 WHERE  input LIKE '".$input."' 
							 GROUP  BY nick) AS o 
						 ON o.score = t.score 
				ORDER  BY score DESC ";
		*/
		$optionalGroup = "";
		if($group != ""){
			$optionalGroup = " and idg='".x($group)."' ";
		}
		$sqlSGroupama = "
				SELECT t.*, 
					   o.games, 
					   idg 
				FROM   ch_score AS t 
					   JOIN (SELECT Max(score)  AS score, 
									Count(nick) AS games 
							 FROM   ch_score 
							 WHERE  input LIKE '".$input."' 
							 GROUP  BY nick) AS o 
						 ON o.score = t.score 
					   LEFT OUTER JOIN ch_group_members 
									ON ch_group_members.user = t.nick
					   WHERE  input LIKE '".$input."'  ".$optionalGroup."			
				ORDER  BY score DESC ";
		//echo $sqlSGroupama;
		//$sql = " select * from ch_score ";
		$query = $this->db->query($sqlSGroupama);
		$results = array();
		while($radek = mysql_fetch_assoc($query)){
			array_push($results, $radek);
		}
		//if($results){
			return array("result"=>"success", "message"=>"ok", "data" => $results);
		//}else{
		//	return array("result"=>"fail", "message"=>"nepodarilo se nacist score");
		//}
	}
	
	private function returnData($array){
		echo json_encode($array);
	}
	
}
function xh($in){
	return x(h($in));
}
function x($in){
	return mysql_real_escape_string($in);
}
function h($in){
	return htmlspecialchars($in);
}

$data = file_get_contents("php://input");	
$api = new Api($_GET,$data);	
	
	
?>