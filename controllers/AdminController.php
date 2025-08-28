<?php

namespace Controllers;

use MVC\Router;
use Model\AdminCita;

class AdminController
{

    public static function index(Router $router)
    {
        session_start();
        isAdmin();
        $fecha = $_GET['fecha'] ?? date('Y-m-d');
        $fechas = explode('-', $fecha);
        if (!checkdate($fechas[1], $fechas[2], $fechas[0])) {
            header('Location: /404');
        }

        // Consultar la BD
        $consulta = "SELECT citas.id, citas.hora, CONCAT( usuarios.nombre, ' ', usuarios.apellido) as cliente, ";
        $consulta .= " usuarios.email, usuarios.telefono, servicios.nombre as servicio, servicios.precio  ";
        $consulta .= " FROM citas  ";
        $consulta .= " INNER JOIN usuarios ";
        $consulta .= " ON citas.usuario_id = usuarios.id  ";
        $consulta .= " INNER JOIN citasServicios ";
        $consulta .= " ON citasServicios.cita_id=citas.id ";
        $consulta .= " INNER JOIN servicios ";
        $consulta .= " ON servicios.id=citasServicios.servicio_id ";
        $consulta .= " WHERE fecha =  '{$fecha}' ";
        $consulta .= " ORDER BY citas.id ASC ";

        $citas = AdminCita::SQL($consulta);

        $router->render('admin/index', [
            'nombre' => $_SESSION['nombre'],
            'citas' => $citas,
            'fecha' => $fecha
        ]);
    }
}
