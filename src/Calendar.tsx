import React from 'react';
import { useEffect } from 'react';

export const CalendarRedirect = () => {
  useEffect(() => {
    window.location.href = "https://sites.google.com/view/9or10mafia/home";
  }, []);

  return (<p>Redirecting to budget sheet...</p>);
};