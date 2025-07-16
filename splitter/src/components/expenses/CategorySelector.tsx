"use client"
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { ExpenseCategory } from '@/lib/ex-categories';
import { SelectLabel } from '@radix-ui/react-select';

export const CategorySelector = ({
  categories,
  onChange,
}: {
  categories: ExpenseCategory[];
  onChange?: (categoryId: string) => void;
  }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  
  const handleSelect = (categoryId:string) => {
    if (onChange && categoryId !== selectedCategory) {
      onChange(categoryId)
     }
    setSelectedCategory(categoryId)
  }

  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      const defaultCategory = categories[0];
      setSelectedCategory(defaultCategory.id);
      if (onChange) {
        onChange(defaultCategory.id);
      }
    }
  }, []);

  if (!categories || categories.length === 0) {
    return <div>No categories available</div>;
  }

  return (

    <div>
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="select a category"></SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Category</SelectLabel>
            {categories.map((category: ExpenseCategory) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelector