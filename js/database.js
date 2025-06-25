const database = {
    categories: [
        { id: 'all', name: 'Todos' },
        { id: 'panquesitos', name: 'Panquesitos' },
        { id: 'panqueton', name: 'Panquetón' },
        { id: 'nueces', name: 'Nueces' },
        { id: 'panetelas', name: 'Panetela' },
        { id: 'flan', name: 'Flan' },
        { id: 'tartaletas', name: 'Tartaletas' }
    ],
    
    products: [
        {
            id: 'panques',
            name: 'Panqués Rellenos',
            category: 'panquesitos',
            price: 150,
            description: 'Deliciosos panqués esponjosos con relleno a elegir.',
            image: 'img/132.jpg',
            options: {
                filling: [
                    { id: 'chocolate-drawing', name: 'Dibujo con Chocolate', price: 0 },
                    { id: 'chocolate', name: 'Chocolate', price: 0 },
                    { id: 'fanguito', name: 'Fanguito', price: 0 },
                    { id: 'mani', name: 'Maní', price: 0 }
                ]
            },
            disabled: true
        },
        {
            id: 'panqueton',
            name: 'Panquetón',
            category: 'panqueton',
            price: 1800,
            description: 'Exquisito panetón casero con frutas confitadas.',
            image: 'img/logo.jpg',
            disabled: true
        },
        {
            id: 'nueces',
            name: 'Paquete de 20 Nueces Rellenas',
            category: 'nueces',
            price: 1400,
            description: 'Nueces en diferentes presentaciones.',
            image: 'img/logo.jpg',
            disabled: true
        },
        {
            id: 'panetelas',
            name: 'Panetelas',
            category: 'panetelas',
            price: 1300,
            description: 'Suaves panetelas caseras con diferentes rellenos.',
            image: 'img/logo.jpg',
            options: {
                relleno: [
                    { id: 'guayaba', name: 'Guayaba', price: 0 },
                    { id: 'coco', name: 'Coco', price: 0 }
                ]
            },
            disabled: true
        },
        {
            id: 'flan',
            name: 'Flan Casero',
            category: 'flan',
            price: 1200,
            description: 'Delicioso flan casero con caramelo.',
            image: 'img/logo.jpg',
            disabled: true
        },
        /*{
            id: 'proximamente',
            name: 'Próximamente más productos',
            category: 'none',
            price: 0,
            description: 'Estamos preparando nuevas delicias para ti.',
            image: 'img/logo.jpg',
            disabled: true
        }*/
    ]
};
