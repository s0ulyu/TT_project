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

  if (loading) return (
    <div className="flex justify-center items-center p-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Danh sách sản phẩm</h2>
        <span className="text-sm font-medium text-gray-600 bg-gray-200 px-3 py-1 rounded-full">{data.length} sản phẩm</span>
      </div>

      {errorMsg && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">{errorMsg}</div>}

      {!errorMsg && data.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 border-dashed">
          <p className="text-gray-500">Chưa có sản phẩm nào. Hãy thêm sản phẩm mới ở form bên cạnh!</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {data.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group">
            {item.image && (
              <div className="relative overflow-hidden aspect-[4/3] bg-gray-50 border-b border-gray-100">
                <img
                  src={pb.files.getURL(item, item.image)}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                {item.description || "Chưa có mô tả"}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="font-semibold text-black bg-gray-100 px-3 py-1.5 rounded-lg text-sm">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
