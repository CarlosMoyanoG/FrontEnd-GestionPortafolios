import { Injectable } from '@angular/core';
import { Firestore,doc,getDoc,setDoc,updateDoc } from '@angular/fire/firestore';
import { Usuario, RolUsuario } from '../modelos/usuario';

interface DatosFirebaseUsuario {
  uid: string;
  nombre: string | null;
  email: string | null;
  fotoUrl: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class Usuarios {
  constructor(private firestore: Firestore) {}

  private refUsuario(uid: string) {
    return doc(this.firestore, 'usuarios', uid);
  }

  async obtenerOCrearUsuarioDesdeFirebase(
    datos: DatosFirebaseUsuario
  ): Promise<Usuario> {
    const ref = this.refUsuario(datos.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      const nuevo: Usuario = {
        id: Date.now(),
        nombre: datos.nombre || 'Usuario',
        rol: 'visitante', 
      };

      await setDoc(ref, nuevo);
      return nuevo;
    }

    return snap.data() as Usuario;
  }

  async actualizarRol(uid: string,rol: RolUsuario, programadorId?: number): Promise<void> {
    const ref = this.refUsuario(uid);
    const cambios: Partial<Usuario> = {
      rol,
      programadorId,
    };
    await updateDoc(ref, cambios);
  }

  async obtenerUsuario(uid: string): Promise<Usuario | null> {
    const ref = this.refUsuario(uid);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as Usuario) : null;
  }
}
