<?php
INCLUDE("conf.db.php");
class Database{
  
    private static $m_pInstance;

    private function __construct() { 
      $this->connect();
    }

    public static function getInstance()    {
        if (!self::$m_pInstance)        {
            self::$m_pInstance = new Database();
        }
        return self::$m_pInstance;
    } 
  private function connect(){
     $spojeni=@mysql_connect(DBSERVER,WEBUSER,WEBUSER_PSW) or die("Chyba serveru, nelze se spojit s databází.<br>Omluvte prosím nedostupnost.");
      mysql_select_db(DBNAME) or die("nelze vybrat databazi");
      mysql_query("SET NAMES 'utf8'") ;
  }
  
  public function query($sql,$report=false){
    @$vysledek = MySQL_Query($sql);
    if (!$vysledek){
      if($report){
        echo "<b><i>".mysql_error()."</i><br>  $sql   </b>";
      }else{
         echo  "<br> Doslo k chybě, při komunikaci s databází. ".$sql ."  <BR>";
      }
      return false;
    }else{
      return $vysledek;    
    }
  }
  
}
?>
