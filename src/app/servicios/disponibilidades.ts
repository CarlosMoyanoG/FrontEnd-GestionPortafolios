import { Injectable } from '@angular/core';
import { Disponibilidad } from '../modelos/disponibilidad';

import {Firestore, collection, addDoc, getDocs, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class Disponibilidades {
  private colRef;

  constructor(private firestore: Firestore) {
    this.colRef = collection(this.firestore, 'disponibilidades');
  }

  async crearDisponibilidad(data: Omit<Disponibilidad, 'id'>): Promise<Disponibilidad> {
    const registro: Disponibilidad = {
      id: Date.now(),
      ...data,
    };

    await addDoc(this.colRef, registro);
    return registro;
  }

  async getTodas(): Promise<Disponibilidad[]> {
    const snap = await getDocs(this.colRef);
    return snap.docs.map(d => d.data() as Disponibilidad);
  }

  async getPorProgramador(programadorId: number): Promise<Disponibilidad[]> {
    const q = query(this.colRef, where('programadorId', '==', programadorId));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as Disponibilidad);
  }
}
