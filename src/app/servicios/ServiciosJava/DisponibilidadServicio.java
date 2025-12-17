package app.servicios.ServiciosJava;

import app.modelos.ModelosJava.Disponibilidad;
import java.util.ArrayList;
import java.util.List;



/**
 *
 * @author Carlos Moyano
 */

public class DisponibilidadServicio {

    private final List<Disponibilidad> baseDeDatos = new ArrayList<>();
    private int contadorId = 1;
    
    // CREAR

    public Disponibilidad crear(Disponibilidad d) {
        if (!d.getOpcionesTipo().contains(d.getTipo())) {
            System.out.println("Error: Tipo de disponibilidad no válido.");
            return null;
        }

        d.setId(contadorId++); 
        baseDeDatos.add(d);
        System.out.println("Disponibilidad creada con ID: " + d.getId());
        return d;
    }

    // LEER
    
    public List<Disponibilidad> obtenerTodos() {
        return baseDeDatos;
    }

    public Disponibilidad obtenerPorId(int id) {
        for (Disponibilidad d : baseDeDatos) {
            if (d.getId() == id) {
                return d;
            }
        }
        return null;
    }

    // ACTUALIZAR
    public boolean actualizar(int id, Disponibilidad nuevosDatos) {
        Disponibilidad actual = obtenerPorId(id);
        
        if (actual != null) {
            actual.setProgramadorId(nuevosDatos.getProgramadorId());
            if (actual.getOpcionesTipo().contains(nuevosDatos.getTipo())) {
                actual.setTipo(nuevosDatos.getTipo());
            }
            
            actual.setDiaSemana(nuevosDatos.getDiaSemana());
            actual.setFecha(nuevosDatos.getFecha());
            actual.setHoraInicio(nuevosDatos.getHoraInicio());
            actual.setHoraFin(nuevosDatos.getHoraFin());
            actual.setHora(nuevosDatos.getHora());
            
            System.out.println("Disponibilidad ID " + id + " actualizada correctamente.");
            return true;
        } else {
            System.out.println("No se encontró la disponibilidad con ID: " + id);
            return false;
        }
    }

    // ELIMINAR
    public boolean eliminar(int id) {
        Disponibilidad d = obtenerPorId(id);
        if (d != null) {
            baseDeDatos.remove(d);
            System.out.println("Disponibilidad ID " + id + " eliminada.");
            return true;
        }
        System.out.println("No se puede eliminar, ID no encontrado.");
        return false;
    }
}