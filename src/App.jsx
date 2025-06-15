import Header from "./components/Header";
import Footer from "./components/Footer";
import ArrowStepper from "./components/ArrowStepper";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <ArrowStepper />
      <Footer />
    </div>
  );
};

export default App;
