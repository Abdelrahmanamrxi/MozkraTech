import Header from "./Header/Header";
import Footer from "./Footer/Footer";
export default function Body({ children, navbarVariant = "landing" }) {
  return (
    <div>
      <Header navbarVariant={navbarVariant} />
      {children}
      <Footer />
    </div>
  );
}
