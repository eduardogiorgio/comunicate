import { Action } from '../models/action';

export const ACTIONS: Action[] = [
    //category 1
    { id: 1, name: 'Bien', path: '/assets/images/examples/smiling.jpg', categoryId: 1, sequence: null },
    { id: 2, name: 'Mal', path: '/assets/images/examples/sick.jpg', categoryId: 1, sequence: null },
    { id: 3, name: 'Triste', path: '/assets/images/examples/sad.jpg', categoryId: 1, sequence: null },

    //group 1
    { id: 4, name: 'Papa', path: '/assets/images/examples/father.jpg', categoryId: 2, sequence: null },
    { id: 5, name: 'Mama', path: '/assets/images/examples/mother.jpg', categoryId: 2, sequence: null },
    { id: 6, name: 'Hermana', path: '/assets/images/examples/sister.jpg', categoryId: 2, sequence: null },
    { id: 7, name: 'Hermano', path: '/assets/images/examples/brother.jpg', categoryId: 2, sequence: null },
    //group 2
    { id: 8, name: 'Mi amigo', path: '/assets/images/examples/friend1.jpg', categoryId: 2, sequence: null },
    { id: 9, name: 'Mi amiga', path: '/assets/images/examples/friend2.jpg', categoryId: 2, sequence: null },
    //group 3
    { id: 10, name: 'Nadia', path: '/assets/images/examples/terapist1.jpg', categoryId: 2, sequence: null },
    { id: 11, name: 'Valeria', path: '/assets/images/examples/terapist2.jpg', categoryId: 2, sequence: null },
    { id: 12, name: 'Claudia', path: '/assets/images/examples/terapist3.jpg', categoryId: 2, sequence: null },
    //category 3
    //group 4
    { id: 13, name: 'andar en bicicleta', path: '/assets/images/examples/bicycle.jpg', categoryId: 3, sequence: null },
    { id: 14, name: 'Salir a caminar', path: '/assets/images/examples/walk.jpg', categoryId: 3, sequence: null },
    //group 5
    { id: 15, name: 'Mirar televesion', path: '/assets/images/examples/television.jpg', categoryId: 3, sequence: null },
    //category 4
    { id: 16, name: 'Casa', path: '/assets/images/examples/house.jpg', categoryId: 4, sequence: null },
    { id: 17, name: 'Escuela', path: '/assets/images/examples/school.jpg', categoryId: 4, sequence: null },
    { id: 18, name: 'Kiosko', path: '/assets/images/examples/grocery.jpg', categoryId: 4, sequence: null },
    //category 5
    //group 5
    { id: 19, name: 'Agua', path: '/assets/images/examples/water-bootle.jpg', categoryId: 5, sequence: null },
    { id: 20, name: 'Jugo', path: '/assets/images/examples/juice.jpg', categoryId: 5, sequence: null },
    { id: 21, name: 'Mate', path: '/assets/images/examples/mate.jpg', categoryId: 5, sequence: null },
    //group 6
    { id: 22, name: 'pizza', path: '/assets/images/examples/pizza.jpg', categoryId: 5, sequence: null },
    { id: 23, name: 'hamburguesa', path: '/assets/images/examples/hamburger.jpg', categoryId: 5, sequence: null },
    
];
