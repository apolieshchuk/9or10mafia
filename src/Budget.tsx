import React from 'react';
import { useEffect } from 'react';

export const BudgetRedirect = () => {
  useEffect(() => {
    window.location.href = "https://docs.google.com/spreadsheets/d/1Rmp0EHC4pm5u8frgDozMUt7s3XSLwUTJyH2Okys4aqs/";
  }, []);

  return (<p>Redirecting to budget sheet...</p>);
};