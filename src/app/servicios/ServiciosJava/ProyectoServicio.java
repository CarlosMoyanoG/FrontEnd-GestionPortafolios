package app.servicios.ServiciosJava;

import app.modelos.ModelosJava.Proyecto;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Carlos Moyano
 */

public class ProyectoServicio {

    private List<Proyecto> baseDeDatos = new ArrayList<>();
    private int contadorId = 1;

    // CREAR
    public Proyecto crear(Proyecto p) {
        // Validar Sección
        if (!p.getOpcionesSeccion().contains(p.getSeccion())) {
            System.out.println("Error: Sección no válida (" + p.getSeccion() + ")");
            return null;
        }

        // Validar Participación
        if (!p.getOpcionesParticipacion().contains(p.getParticipacion())) {
            System.out.println("Error: Participación no válida (" + p.getParticipacion() + ")");
            return null;
        }

        p.setId(contadorId++);
        baseDeDatos.add(p);
        System.out.println("Proyecto creado con ID: " + p.getId());
        return p;
    }

    // LEER
    public List<Proyecto> obtenerTodos() {
        return baseDeDatos;
    }

    public Proyecto obtenerPorId(int id) {
        for (Proyecto p : baseDeDatos) {
            if (p.getId() == id) {
                return p;
            }
        }
        return null;
    }

    // ACTUALIZAR
    public boolean actualizar(int id, Proyecto nuevosDatos) {
        Proyecto actual = obtenerPorId(id);
        
        if (actual != null) {
            actual.setNombre(nuevosDatos.getNombre());
            actual.setDescripcion(nuevosDatos.getDescripcion());
            
            // Validamos antes de actualizar campos restringidos
            if (actual.getOpcionesSeccion().contains(nuevosDatos.getSeccion())) {
                actual.setSeccion(nuevosDatos.getSeccion());
            }

            if (actual.getOpcionesParticipacion().contains(nuevosDatos.getParticipacion())) {
                actual.setParticipacion(nuevosDatos.getParticipacion());
            }

            actual.setTecnologias(nuevosDatos.getTecnologias());
            actual.setRepoUrl(nuevosDatos.getRepoUrl());
            actual.setDemoUrl(nuevosDatos.getDemoUrl());
            
            System.out.println("Proyecto ID " + id + " actualizado correctamente.");
            return true;
        } else {
            System.out.println("No se encontró el proyecto con ID: " + id);
            return false;
        }
    }

    // ELIMINAR
    public boolean eliminar(int id) {
        Proyecto p = obtenerPorId(id);
        if (p != null) {
            baseDeDatos.remove(p);
            System.out.println("Proyecto ID " + id + " eliminado.");
            return true;
        }
        System.out.println("No se puede eliminar, ID no encontrado.");
        return false;
    }
}