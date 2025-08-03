import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ArrowStepper from "./components/ArrowStepper";
import Header from "./components/Header";
import Footer from "./components/Footer";
import useAppStore from "./useAppStore";

const App = () => {
  const theme = useAppStore((s) => s.theme);

  return (
    <BrowserRouter>
      <div
        className={`min-h-screen flex flex-col ${
          theme === "dark" ? "dark" : ""
        }`}
      >
        <Header />
        <Routes>
          <Route path="/" element={<ArrowStepper />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
