// Base types for each entity
export type CarMaker = {
    id: string;
    name: string;
  };
  
  export type ModelLine = {
    id: string;
    name: string;
    carMakerId: string; // Foreign key reference to CarMaker
  };
  
  export type Year = {
    id: string;
    year: number;
    modelLineId: string; // Foreign key reference to ModelLine
  };
  
  export type Modification = {
    id: string;
    name: string;
    yearId: string; // Foreign key reference to Year
  };
  
  export type Category = {
    id: string;
    name: string;
    image?: string;
  };

export type ProductFormData = {
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    image: string;
    categoryId: string;
    modificationId: string;
  };

export interface AddProductFormProps {
    carMakers: CarMaker[];
    categories: Category[];
    onSubmit: (productData: ProductFormData) => void;
  }