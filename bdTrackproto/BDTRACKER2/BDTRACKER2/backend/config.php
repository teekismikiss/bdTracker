<?php

// CDMON
//  $conexion = new mysqli("localhost", "root", "root", "bd_bande_dessinee");

// Infinity
//  $conexion = new mysqli("localhost", "root", "root", "bd_bande_dessinee");

// Local
$conexion = new mysqli("localhost", "root", "root", "bd_bande_dessinee");

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

$conexion->set_charset("utf8mb4");
?>