<?php
include("config.php");

$titulo = $_POST['titulo'];
$serie_id = $_POST['serie_id'];
$estado_id = $_POST['estado_id'];
$tieneslu = isset($_POST['tieneslu']) ? 1 : 0;

$sql = "INSERT INTO albumes (titulo, serie_id, estado_id, tieneslu)
VALUES (?, ?, ?, ?)";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("siii", $titulo, $serie_id, $estado_id, $tieneslu);
$stmt->execute();

$album_id = $stmt->insert_id;

/* autores */
if (!empty($_POST['autores'])) {
    foreach ($_POST['autores'] as $autor_id) {
        $conexion->query("INSERT INTO album_autor (album_id, autor_id) 
                          VALUES ($album_id, $autor_id)");
    }
}

header("Location: index.php");