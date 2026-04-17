<?php
include("config.php");

$id = $_GET['id'];

$album = $conexion->query("SELECT * FROM albumes WHERE id=$id")->fetch_assoc();
$autores_album = [];

$res = $conexion->query("SELECT autor_id FROM album_autor WHERE album_id=$id");
while ($r = $res->fetch_assoc()) {
    $autores_album[] = $r['autor_id'];
}
?>

<h2>Editar álbum</h2>

<form action="guardar.php" method="POST">
<input type="hidden" name="id" value="<?= $id ?>">

Título: <input type="text" name="titulo" value="<?= $album['titulo'] ?>"><br><br>

Autores:<br>
<?php
$res = $conexion->query("SELECT * FROM autores");
while ($row = $res->fetch_assoc()) {
    $checked = in_array($row['id'], $autores_album) ? "checked" : "";
    echo "<input type='checkbox' name='autores[]' value='{$row['id']}' $checked> {$row['nombre']}<br>";
}
?>

<br>
<input type="submit" value="Actualizar">
</form>