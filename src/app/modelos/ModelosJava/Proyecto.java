package app.modelos.ModelosJava;
import java.util.ArrayList;


/**
 *
 * @author Carlos Moyano
 */
public class Proyecto {
    
    ArrayList<String> opcionesSeccion = new ArrayList<>();
    ArrayList<String> opcionesParticipacion = new ArrayList<>();
    
    int id;
    String nombre;
    String descripcion;
    String seccion;       
    String participacion; 
    
    ArrayList<String> tecnologias = new ArrayList<>();
    
    String repoUrl;
    String demoUrl;
    
    public Proyecto() {
        // Inicializar opciones de Seccion
        opcionesSeccion.add("academico");
        opcionesSeccion.add("laboral");
        
        // Inicializar opciones de Participacion
        opcionesParticipacion.add("Frontend");
        opcionesParticipacion.add("Backend");
        opcionesParticipacion.add("Base de Datos");
        opcionesParticipacion.add("Fullstack");
    }

    public ArrayList<String> getOpcionesSeccion() {
        return opcionesSeccion;
    }

    public void setOpcionesSeccion(ArrayList<String> opcionesSeccion) {
        this.opcionesSeccion = opcionesSeccion;
    }

    public ArrayList<String> getOpcionesParticipacion() {
        return opcionesParticipacion;
    }

    public void setOpcionesParticipacion(ArrayList<String> opcionesParticipacion) {
        this.opcionesParticipacion = opcionesParticipacion;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getSeccion() {
        return seccion;
    }

    public void setSeccion(String seccion) {
        this.seccion = seccion;
    }

    public String getParticipacion() {
        return participacion;
    }

    public void setParticipacion(String participacion) {
        this.participacion = participacion;
    }

    public ArrayList<String> getTecnologias() {
        return tecnologias;
    }

    public void setTecnologias(ArrayList<String> tecnologias) {
        this.tecnologias = tecnologias;
    }

    public String getRepoUrl() {
        return repoUrl;
    }

    public void setRepoUrl(String repoUrl) {
        this.repoUrl = repoUrl;
    }

    public String getDemoUrl() {
        return demoUrl;
    }

    public void setDemoUrl(String demoUrl) {
        this.demoUrl = demoUrl;
    }
}