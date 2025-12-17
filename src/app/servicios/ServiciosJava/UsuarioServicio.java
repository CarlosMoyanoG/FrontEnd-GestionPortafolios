package app.servicios.ServiciosJava;

import app.modelos.ModelosJava.Usuario;
import java.util.ArrayList;
import java.util.List;
/**
 *
 * @author Carlos Moyano
 */

public class UsuarioServicio {

    private List<Usuario> baseDeDatos = new ArrayList<>();
    private int contadorId = 1;
    
    // CREAR
    public Usuario crear(Usuario u) {
        // Validar Rol
        if (!u.getOpcionesRol().contains(u.getRol())) {
            System.out.println("Error: Rol no válido (" + u.getRol() + ")");
            return null;
        }

        u.setId(contadorId++);
        baseDeDatos.add(u);
        System.out.println("Usuario creado con ID: " + u.getId());
        return u;
    }

    // LEER
    public List<Usuario> obtenerTodos() {
        return baseDeDatos;
    }

    public Usuario obtenerPorId(int id) {
        for (Usuario u : baseDeDatos) {
            if (u.getId() == id) {
                return u;
            }
        }
        return null;
    }

    // ACTUALIZAR
    public boolean actualizar(int id, Usuario nuevosDatos) {
        Usuario actual = obtenerPorId(id);
        
        if (actual != null) {
            actual.setNombre(nuevosDatos.getNombre());
            actual.setEmail(nuevosDatos.getEmail());
            
            // Validamos antes de actualizar el rol
            if (actual.getOpcionesRol().contains(nuevosDatos.getRol())) {
                actual.setRol(nuevosDatos.getRol());
            }

            actual.setProgramadorId(nuevosDatos.getProgramadorId());
            actual.setFotoUrl(nuevosDatos.getFotoUrl());
            
            System.out.println("Usuario ID " + id + " actualizado correctamente.");
            return true;
        } else {
            System.out.println("No se encontró el usuario con ID: " + id);
            return false;
        }
    }

    // ELIMINAR
    public boolean eliminar(int id) {
        Usuario u = obtenerPorId(id);
        if (u != null) {
            baseDeDatos.remove(u);
            System.out.println("Usuario ID " + id + " eliminado.");
            return true;
        }
        System.out.println("No se puede eliminar, ID no encontrado.");
        return false;
    }
}