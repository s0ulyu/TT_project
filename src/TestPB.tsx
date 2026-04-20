import { useEffect, useState } from "react";
import { pb } from "./lib/pocketbase";

type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
};

export default function TestPB() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await pb.collection("products").getFullList<Product>();
        setData(result);
      } catch (error: any) {
        if (error?.isAbort) return;

        console.error("PocketBase error:", error);
        setErrorMsg(error?.message || "Có lỗi khi load dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">Test PocketBase</h1>

      {errorMsg && <p className="text-red-500 mb-4">Lỗi: {errorMsg}</p>}

      {!errorMsg && data.length === 0 && <p>Không có dữ liệu</p>}

      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.id} className="border rounded-xl p-4 shadow-sm">
            {item.image && (
              <img
                src={pb.files.getURL(item, item.image)}
                alt={item.name}
                className="w-40 h-40 object-cover rounded mb-4"
              />
            )}

            <p>
              <b>ID:</b> {item.id}
            </p>
            <p>
              <b>Name:</b> {item.name}
            </p>
            <p>
              <b>Price:</b> {item.price}
            </p>
            <p>
              <b>Description:</b> {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
