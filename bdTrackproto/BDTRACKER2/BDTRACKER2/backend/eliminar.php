<?php
include("config.php");

$id = $_GET['id'];

$conexion->query("DELETE FROM albumes WHERE id=$id");

header("Location: index.php");