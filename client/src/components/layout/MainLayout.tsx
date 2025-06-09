import Navbar from "../../components/Navbar";

interface MainLayoutProps {
  content: React.ReactNode;
}

const MainLayout = ({ content }: MainLayoutProps) => {
  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        paddingTop: "80px", // to account for fixed navbar
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <main
        style={{
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
          paddingTop: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {content}
      </main>
    </div>
  );
};

export default MainLayout;
