import { Group } from '../models/group';

export const GROUPS: Group[] = [
    { id: 1, name: 'Familia', icon: 'people-circle', categoryId: 2, sequence: null},
    { id: 2, name: 'Amigos', icon: 'person', categoryId: 2, sequence: null},
    { id: 3, name: 'Terapistas', icon: 'people', categoryId: 2, sequence: null},

    { id: 4, name: 'Fuera casa', icon: 'football', categoryId: 3, sequence: null},
    { id: 5, name: 'En casa', icon: 'home', categoryId: 3, sequence: null},

    { id: 6, name: 'Bebidas', icon: 'pint', categoryId: 5, sequence: null},
    { id: 7, name: 'Comida', icon: 'pizza', categoryId: 5, sequence: null}
];
