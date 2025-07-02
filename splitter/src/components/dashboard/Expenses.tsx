import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';

export const Expenses = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/*  */}
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Total this month</p>
              <h3 className="text-2xl font-bold mt-1">${"0.00"}</h3>
            </div>
            {/*  */}
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Total this year</p>
              <h3 className="text-2xl font-bold mt-1">${"0.00"}</h3>
            </div>
            {/*  */}
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs sm:text-xl text-muted-foreground text-center mt-2">
            Monthly spending for 2025
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
