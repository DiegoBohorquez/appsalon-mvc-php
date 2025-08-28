<?php
include_once __DIR__ . '/../templates/barra.php';
?>

<h1 class="nombre-pagina">Servicios</h1>
<p class="descripcion-pagina">Administración de Servicios</p>

<?php
include_once __DIR__ . '/../templates/administacion.php';
?>

<div class="listado-servicios">
    <?php foreach ($servicios as $servicio) { ?>
        <div data-id-servicio="<?php echo $servicio->id; ?>" class="servicio servicio-admin">
            <div class="datos-servicio mostrar-servicio">
                <p><?php echo $servicio->nombre; ?></p>
                <p class="precio-servicio">$<?php echo $servicio->precio; ?></p>
            </div>
            <div class="funciones">
                <a class="boton" href="/servicios/actualizar?id=<?php echo $servicio->id; ?>">Actualizar</a>
                <form action="/servicios/eliminar" method="POST">
                    <input type="hidden" name="id" value="<?php echo $servicio->id; ?>" />
                    <input type="submit" value="Eliminar" class="boton-eliminar">
                </form>
            </div>
        </div>
    <?php } ?>
</div>

<?php
$script = "
        <script src='build/js/servicio.js'></script>
        "
?>