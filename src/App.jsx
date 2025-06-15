import React from 'react';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import Notifications from './components/Notifications';
import Content from './components/Content';
import Footer from './components/Footer';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ProgressBar />
      <Content />
      <Footer />
    </div>
  );
};

export default App;
