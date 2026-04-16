<?php include("config.php"); ?>

<h1>Colección BD</h1>
<a href="crear.php">➕ Nuevo álbum</a>

<table border="1" cellpadding="5">
<tr>
    <th>ID</th>
    <th>Título</th>
    <th>Serie</th>
    <th>Autores</th>
    <th>Estado</th>
    <th>Tienes</th>
    <th>Acciones</th>
</tr>

<?php
$sql = "
SELECT 
    a.id,
    a.titulo,
    s.nombre AS serie,
    e.nombre AS estado,
    a.tieneslu,
    GROUP_CONCAT(au.nombre SEPARATOR ', ') AS autores
FROM albumes a
LEFT JOIN series s ON a.serie_id = s.id
LEFT JOIN estados e ON a.estado_id = e.id
LEFT JOIN album_autor aa ON a.id = aa.album_id
LEFT JOIN autores au ON aa.autor_id = au.id
GROUP BY a.id
";

$result = $conexion->query($sql);

while ($row = $result->fetch_assoc()) {
    echo "<tr>
        <td>{$row['id']}</td>
        <td>{$row['titulo']}</td>
        <td>{$row['serie']}</td>
        <td>{$row['autores']}</td>
        <td>{$row['estado']}</td>
        <td>" . ($row['tieneslu'] ? 'Sí' : 'No') . "</td>
        <td>
            <a href='editar.php?id={$row['id']}'>✏️</a>
            <a href='eliminar.php?id={$row['id']}'>🗑️</a>
        </td>
    </tr>";
}
?>
</table>