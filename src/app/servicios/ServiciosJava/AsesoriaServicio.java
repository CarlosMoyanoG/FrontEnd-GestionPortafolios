package app.servicios.ServiciosJava;
import app.modelos.ModelosJava.Asesoria;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Carlos Moyano
 */

public class AsesoriaServicio {

    private final List<Asesoria> baseDeDatos = new ArrayList<>();
    private int contadorId = 1;
    
    // CREAR

    public Asesoria crear(Asesoria a) {
        // Asignamos el ID automático al campo 'numero'
        a.setNumero(contadorId++); 
        baseDeDatos.add(a);
        System.out.println("Asesoría creada con Numero (ID): " + a.getNumero());
        return a;
    }

    // LEER
    
    public List<Asesoria> obtenerTodos() {
        return baseDeDatos;
    }

    public Asesoria obtenerPorId(int numero) {
        for (Asesoria a : baseDeDatos) {
            if (a.getNumero() == numero) {
                return a;
            }
        }
        return null;
    }

    // ACTUALIZAR
    public boolean actualizar(int numero, Asesoria nuevosDatos) {
        Asesoria actual = obtenerPorId(numero);
        
        if (actual != null) {
            actual.setProgramadorId(nuevosDatos.getProgramadorId());
            actual.setNombreCliente(nuevosDatos.getNombreCliente());
            actual.setEmailCliente(nuevosDatos.getEmailCliente());
            actual.setFecha(nuevosDatos.getFecha());
            actual.setHora(nuevosDatos.getHora());
            actual.setDescripcionProyecto(nuevosDatos.getDescripcionProyecto());
            actual.setMensajeRespuesta(nuevosDatos.getMensajeRespuesta());
            
            System.out.println("Asesoría Numero " + numero + " actualizada correctamente.");
            return true;
        } else {
            System.out.println("No se encontró la asesoría con Numero: " + numero);
            return false;
        }
    }

    // ELIMINAR
    public boolean eliminar(int numero) {
        Asesoria a = obtenerPorId(numero);
        if (a != null) {
            baseDeDatos.remove(a);
            System.out.println("Asesoría Numero " + numero + " eliminada.");
            return true;
        }
        System.out.println("No se puede eliminar, Numero no encontrado.");
        return false;
    }
}