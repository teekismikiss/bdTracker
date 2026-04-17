<?php 
// Incluyimos la configuración
include("config.php"); 
// Amestamos la cabecera del diseńu
include("header.php"); 
?>

<div class="glass-panel" style="max-width: 600px; margin: 0 auto;">
    <div style="margin-bottom: 2rem;">
        <a href="index.php" style="color: var(--accent); text-decoration: none; font-size: 0.875rem;">← Volver al llistáu</a>
        <h2 style="margin-top: 1rem;">Amiestu nuevu álbum</h2>
    </div>

    <form action="guardar.php" method="POST">
        <!-- Títulu del álbum -->
        <div class="form-group">
            <label for="titulo">Títulu del álbum</label>
            <input type="text" name="titulo" id="titulo" placeholder="Ex: El Secretu del Espadón" required>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <!-- Serie -->
            <div class="form-group">
                <label for="serie_id">Serie</label>
                <select name="serie_id" id="serie_id">
                    <?php
                    $res = $conexion->query("SELECT * FROM series ORDER BY nombre ASC");
                    while ($row = $res->fetch_assoc()) {
                        echo "<option value='{$row['id']}'>{$row['nombre']}</option>";
                    }
                    ?>
                </select>
            </div>

            <!-- Editorial (Campu nuevu solicitáu) -->
            <div class="form-group">
                <label for="editorial_id">Editorial</label>
                <select name="editorial_id" id="editorial_id">
                    <option value="">-- Ensin especificar --</option>
                    <?php
                    $res = $conexion->query("SELECT * FROM editoriales ORDER BY nombre ASC");
                    while ($row = $res->fetch_assoc()) {
                        echo "<option value='{$row['id']}'>{$row['nombre']}</option>";
                    }
                    ?>
                </select>
            </div>
        </div>

        <!-- Estáu de calidá -->
        <div class="form-group">
            <label for="estado_id">Estáu del exemplar</label>
            <select name="estado_id" id="estado_id">
                <?php
                $res = $conexion->query("SELECT * FROM estados ORDER BY id ASC");
                while ($row = $res->fetch_assoc()) {
                    echo "<option value='{$row['id']}'>{$row['nombre']}</option>";
                }
                ?>
            </select>
        </div>

        <!-- Autores (Rellación N:M) -->
        <div class="form-group">
            <label>Autores</label>
            <div class="checkbox-group">
            <?php
            $res = $conexion->query("SELECT * FROM autores ORDER BY nombre ASC");
            while ($row = $res->fetch_assoc()) {
                echo "<label class='checkbox-item'>
                        <input type='checkbox' name='autores[]' value='{$row['id']}'>
                        <span>{$row['nombre']}</span>
                      </label>";
            }
            ?>
            </div>
        </div>

        <!-- Checkbox de posesión -->
        <div class="form-group" style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 0.5rem; margin-top: 2rem;">
            <label class="checkbox-item" style="color: var(--text-main); margin-bottom: 0;">
                <input type="checkbox" name="tieneslu" value="1">
                <span>¿Yá lu tienes na to coleición?</span>
            </label>
        </div>

        <div style="margin-top: 2rem;">
            <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 1rem; font-size: 1rem;">
                💾 Guardar álbum
            </button>
        </div>
    </form>
</div>

<?php 
// Zarramos col footer
include("footer.php"); 
?>