import Navbar from "../../components/Navbar";

interface MainLayoutProps {
  content: React.ReactNode;
}

const MainLayout = ({ content }: MainLayoutProps) => {
  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <main
        style={{
          flex: 1, // take remaining space
          paddingTop: "40px",
          paddingBottom: "40px",
          paddingLeft: "300px", // Adjusted to accommodate the fixed-width Navbar (280px + 20px padding/margin)
          paddingRight: "20px",
          overflowX: "auto",
        }}
      >
        {content}
      </main>
    </div>
  );
};

export default MainLayout;
