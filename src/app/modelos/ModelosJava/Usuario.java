package app.modelos.ModelosJava;
import java.util.ArrayList;

/**
 *
 * @author Carlos Moyano
 */

public class Usuario {
    
    ArrayList<String> opcionesRol = new ArrayList<>();
    
    int id;
    String nombre;
    String email;
    String rol;
    int programadorId;
    String fotoUrl;
    
    public Usuario() {
        opcionesRol.add("visitante");
        opcionesRol.add("admin");
        opcionesRol.add("programador");
    }

    public ArrayList<String> getOpcionesRol() {
        return opcionesRol;
    }

    public void setOpcionesRol(ArrayList<String> opcionesRol) {
        this.opcionesRol = opcionesRol;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public int getProgramadorId() {
        return programadorId;
    }

    public void setProgramadorId(int programadorId) {
        this.programadorId = programadorId;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }
}
