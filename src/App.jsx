import Header from './components/Header';
import Content from './components/Content';
import Footer from './components/Footer';
import ArrowStepper from './components/ArrowStepper';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <div className="">
        <ArrowStepper />
        <Content />
      </div>
      
      <Footer />
    </div>
  );
};

export default App;
