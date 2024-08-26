import { User, Product } from './types';

const user: User[] = [
    { id: 1, name: '김창완', address: '부산', email: 'dsc0320@hotmail.com', description: '미남' },
    { id: 2, name: '김창완', address: '부산', email: 'dsc0320@hotmail.com', description: '미남' },
    { id: 3, name: '김창완', address: '부산', email: 'dsc0320@hotmail.com', description: '미남' },
    { id: 4, name: '김창완', address: '부산', email: 'dsc0320@hotmail.com', description: '미남' },
    { id: 5, name: '김창완', address: '부산', email: 'dsc0320@hotmail.com', description: '미남' }
]

const product: Product[] = [
    { id: 1, name: '닭가슴살', price: 3600, description: '단백질' },
    { id: 2, name: '고구마', price: 1800, description: '탄수화물' },
    { id: 3, name: '야채', price: 7200, description: '섬유질' },
    { id: 4, name: '아몬드', price: 4000, description: '지방' }
]

const dataBase = {
    user,
    product
}

export default dataBase;