import React from 'react';
import './App.css';
import {QueryClientProvider} from "@tanstack/react-query";
import Users from "./components/Users";
import queryClient from "./data/queryClient";
import UserForm from "./components/UserForm";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserForm/>
      <Users/>
    </QueryClientProvider>
  );
}

export default App;
