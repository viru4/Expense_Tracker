import React from 'react';
import ExpenseCard from './ExpenseCard';

/**
 * Grid layout for rendering multiple ExpenseCard components.
 */
const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ExpenseList;
