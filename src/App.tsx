import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "./api";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/home/Home";

function App() {
  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () => fetch(BASE_URL).then((res) => res.json()),
  });

  if (isPending) return "Loading...";

  if (error) return `An error has occurred: ${error.message}`;

  return (
    <>
      {data.message}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} /> */}
      </Routes>
      <Button className="btn-secondary">Click me</Button>
    </>
  );
}

export default App;
