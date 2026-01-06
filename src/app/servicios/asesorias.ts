import { Injectable } from '@angular/core';
import { Asesoria } from '../modelos/asesoria';

import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})

export class Asesorias {

  private coleccionRef;

  constructor(private firestore: Firestore) {
    this.coleccionRef = collection(this.firestore, 'asesorias');
  }

  // CREAR ASESORIA

  async crearAsesoria(nueva: Omit<Asesoria, 'id' | 'estado'>): Promise<Asesoria> {
    // Validación preventiva: evitar doble reserva en misma fecha/hora para el mismo programador
    const conflictoRef = query(
      this.coleccionRef,
      where('programadorId', '==', nueva.programadorId),
      where('fecha', '==', nueva.fecha),
      where('hora', '==', nueva.hora)
    );
    const conflictoSnap = await getDocs(conflictoRef);
    const existeConflicto = conflictoSnap.docs.some((d) => {
      const a = d.data() as Asesoria;
      return a.estado !== 'rechazada';
    });

    if (existeConflicto) {
      throw new Error('La hora seleccionada ya está ocupada para este programador.');
    }

    const asesoria: Asesoria = {
      id: Date.now(),
      estado: 'pendiente',
      ...nueva,
    };

    await addDoc(this.coleccionRef, asesoria);
    console.log('Asesoría creada:', asesoria);
    return asesoria;
  }

  // OBTENER ASESORIAS

  async getAsesorias(): Promise<Asesoria[]> {
    const snap = await getDocs(this.coleccionRef);
    return snap.docs.map((d) => d.data() as Asesoria);
  }

  // OBTENER ASESORIAS POR CRITERIOS

  async getAsesoriasPorEmailCliente(email: string): Promise<Asesoria[]> {
    const qRef = query(this.coleccionRef, where('emailCliente', '==', email));
    const snap = await getDocs(qRef);
    return snap.docs.map((d) => d.data() as Asesoria);
  }

  async getAsesoriasPorProgramadorYFecha(programadorId: number,fecha: string): Promise<Asesoria[]> {
    const qRef = query(this.coleccionRef, where('programadorId', '==', programadorId), where('fecha', '==', fecha));
    const snap = await getDocs(qRef);
    return snap.docs.map((d) => d.data() as Asesoria);
  }

  // ACTUALIZAR ASESORIA

  async actualizarAsesoria(id: number,cambios: Partial<Asesoria>): Promise<void> {
    const qRef = query(this.coleccionRef, where('id', '==', id));
    const snap = await getDocs(qRef);

    if (snap.empty) {
      console.warn('No se encontró asesoria con id', id);
      return;
    }

    const docRef = snap.docs[0].ref;
    await updateDoc(docRef, cambios as any);

    console.log('Asesoría actualizada en Firestore:', id, cambios);
  }
}
