import { useEffect, useState } from "react";
import API from "../services/api";

export default function MyDocs() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    API.get("/my-docs").then((res) => setDocs(res.data));
  }, []);

  return (
    <div>
      <h2>My Purchases</h2>

      {docs.map((d, i) => (
        <div key={i}>
          <h3>{d.title}</h3>
          <a href={d.downloadLink}>Download</a>
        </div>
      ))}
    </div>
  );
}