export type PossiblyUnsaved<T> = T extends { id: any } ? Omit<T, 'id'> | T : T;
