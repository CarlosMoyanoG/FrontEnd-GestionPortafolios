package app.modelos.ModelosJava;
import java.util.ArrayList;

/**
 *
 * @author Carlos Moyano
 */

public class Disponibilidad {
    
    ArrayList<String> opcionesTipo = new ArrayList<>();
    
    int id;
    int programadorId;
    String tipo;      
    int diaSemana;   
    String fecha;
    String horaInicio;
    String horaFin;
    String hora;
    
    public Disponibilidad() {
        opcionesTipo.add("recurrente");
        opcionesTipo.add("bloqueo");
        opcionesTipo.add("puntual");
    }

    public ArrayList<String> getOpcionesTipo() {
        return opcionesTipo;
    }

    public void setOpcionesTipo(ArrayList<String> opcionesTipo) {
        this.opcionesTipo = opcionesTipo;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getProgramadorId() {
        return programadorId;
    }

    public void setProgramadorId(int programadorId) {
        this.programadorId = programadorId;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public int getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(int diaSemana) {
        this.diaSemana = diaSemana;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(String horaInicio) {
        this.horaInicio = horaInicio;
    }

    public String getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(String horaFin) {
        this.horaFin = horaFin;
    }

    public String getHora() {
        return hora;
    }

    public void setHora(String hora) {
        this.hora = hora;
    }
    
    @Override
    public String toString() {
        return "Disp [ID=" + id + ", ProgID=" + programadorId + ", Tipo=" + tipo + 
               ", Dia=" + diaSemana + ", Fecha=" + fecha + 
               ", Inicio=" + horaInicio + ", Fin=" + horaFin + "]";
    }
}