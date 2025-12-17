package app.servicios.ServiciosJava;

import app.modelos.ModelosJava.Programador;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Carlos Moyano
 */

public class ProgramadorServicio {

    private List<Programador> baseDeDatos = new ArrayList<>();
    private int contadorId = 1;
    
    // CREAR
    public Programador crear(Programador p) {
        p.setId(contadorId++);
        baseDeDatos.add(p);
        System.out.println("Programador creado con ID: " + p.getId());
        return p;
    }

    // LEER
    public List<Programador> obtenerTodos() {
        return baseDeDatos;
    }

    public Programador obtenerPorId(int id) {
        for (Programador p : baseDeDatos) {
            if (p.getId() == id) {
                return p;
            }
        }
        return null;
    }

    // ACTUALIZAR
    public boolean actualizar(int id, Programador nuevosDatos) {
        Programador actual = obtenerPorId(id);
        
        if (actual != null) {
            actual.setNombre(nuevosDatos.getNombre());
            actual.setEspecialidad(nuevosDatos.getEspecialidad());
            actual.setDescripcion(nuevosDatos.getDescripcion());
            actual.setFotoUrl(nuevosDatos.getFotoUrl());
            actual.setEmailContacto(nuevosDatos.getEmailContacto());
            actual.setGithubUrl(nuevosDatos.getGithubUrl());
            actual.setLinkedinUrl(nuevosDatos.getLinkedinUrl());
            actual.setSitioWeb(nuevosDatos.getSitioWeb());
            actual.setDuenioUid(nuevosDatos.getDuenioUid());
            
            // También actualizamos la lista de proyectos si viene en los nuevos datos
            actual.setProyectos(nuevosDatos.getProyectos());
            
            System.out.println("Programador ID " + id + " actualizado correctamente.");
            return true;
        } else {
            System.out.println("No se encontró el programador con ID: " + id);
            return false;
        }
    }

    // ELIMINAR
    public boolean eliminar(int id) {
        Programador p = obtenerPorId(id);
        if (p != null) {
            baseDeDatos.remove(p);
            System.out.println("Programador ID " + id + " eliminado.");
            return true;
        }
        System.out.println("No se puede eliminar, ID no encontrado.");
        return false;
    }
}