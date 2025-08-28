<?php
include_once __DIR__ . '/../templates/barra.php';
?>

<h1 class="nombre-pagina">Actualizar Servicio</h1>
<p class="descripcion-pagina">Modifica los valores del formulario</p>

<?php
include_once __DIR__ . '/../templates/administacion.php';
include_once __DIR__ . '/../templates/alertas.php';
?>


<form method="POST" class="form">
    <?php
    include_once __DIR__ . '/formulario.php';
    ?>
    <input type="submit" class="boton" value="Guardar Servicio">
</form>