<?php
/**
 * Ficheru de configuración de la conexón a la base de datos MySQL.
 * Configuración fecha pa la redolada Local.
 */

// Datos de conexón (Host, Usuariu, Contraseña, Nome de la BD)
$conexion = new mysqli("localhost", "root", "root", "bd_bande_dessinee");

// Comprobar si hai erros de conexón
if ($conexion->connect_error) {
    die("Fallu na conexón: " . $conexion->connect_error);
}

// Afitar el conxuntu de carauteres a utf8mb4 pa sofitar acentos y eñes
$conexion->set_charset("utf8mb4");

?>