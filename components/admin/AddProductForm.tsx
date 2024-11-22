"use client"

import React, { useState, useEffect } from 'react';
import { ModelLine, Year, Modification, ProductFormData, AddProductFormProps } from '@/lib/types';

const AddProductForm: React.FC<AddProductFormProps> = ({
  carMakers,
  categories,
  onSubmit,
}) => {
  const [modelLines, setModelLines] = useState<ModelLine[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [modifications, setModifications] = useState<Modification[]>([]);

  const [selectedCarMaker, setSelectedCarMaker] = useState<string>('');
  const [selectedModelLine, setSelectedModelLine] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedModification, setSelectedModification] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [stockQuantity, setStockQuantity] = useState<number>(0);
  const [image, setImage] = useState<string>('');

  // Fetch model lines when car maker changes
  useEffect(() => {
    if (selectedCarMaker) {
      fetch(`/api/model-lines/?carMakerId=${selectedCarMaker}`)
        .then((res) => res.json())
        .then((data: ModelLine[]) => setModelLines(data))
        .catch(() => setModelLines([]));
    } else {
      setModelLines([]);
    }
  }, [selectedCarMaker]);

  // Fetch years when model line changes
  useEffect(() => {
    if (selectedModelLine) {
      fetch(`/api/years?modelLineId=${selectedModelLine}`)
        .then((res) => res.json())
        .then((data: Year[]) => setYears(data))
        .catch(() => setYears([]));
    } else {
      setYears([]);
    }
  }, [selectedModelLine]);

  // Fetch modifications when year changes
  useEffect(() => {
    if (selectedYear) {
      fetch(`/api/modifications?yearId=${selectedYear}`)
        .then((res) => res.json())
        .then((data: Modification[]) => setModifications(data))
        .catch(() => setModifications([]));
    } else {
      setModifications([]);
    }
  }, [selectedYear]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productData: ProductFormData = {
      name,
      description,
      price,
      stockQuantity,
      image,
      categoryId: selectedCategory,
      modificationId: selectedModification,
    };

    onSubmit(productData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='mb-2'>
        <label>Car Maker:</label>
        <select
          value={selectedCarMaker}
          onChange={(e) => setSelectedCarMaker(e.target.value)}
          required
        >
          <option value="">Select a Car Maker</option>
          {carMakers.map((maker) => (
            <option key={maker.id} value={maker.id}>
              {maker.name}
            </option>
          ))}
        </select>
      </div>

      <div className='mb-2'>
        <label>Model Line:</label>
        <select
          value={selectedModelLine}
          onChange={(e) => setSelectedModelLine(e.target.value)}
          required
          disabled={!modelLines.length}
        >
          <option value="">Select a Model Line</option>
          {modelLines.map((line) => (
            <option key={line.id} value={line.id}>
              {line.name}
            </option>
          ))}
        </select>
      </div>

      <div className='mb-2'>
        <label>Year:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          required
          disabled={!years.length}
        >
          <option value="">Select a Year</option>
          {years.map((year) => (
            <option key={year.id} value={year.id}>
              {year.year}
            </option>
          ))}
        </select>
      </div>

      <div className='mb-2'>
        <label>Modification:</label>
        <select
          value={selectedModification}
          onChange={(e) => setSelectedModification(e.target.value)}
          required
          disabled={!modifications.length}
        >
          <option value="">Select a Modification</option>
          {modifications.map((mod) => (
            <option key={mod.id} value={mod.id}>
              {mod.name}
            </option>
          ))}
        </select>
      </div>

      <div className='mb-2'>
        <label>Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          required
        >
          <option value="">Select a Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className='mb-2'>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Price:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          required
        />
      </div>

      <div>
        <label>Stock Quantity:</label>
        <input
          type="number"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(parseInt(e.target.value))}
          required
        />
      </div>

      <div>
        <label>Image URL:</label>
        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default AddProductForm;