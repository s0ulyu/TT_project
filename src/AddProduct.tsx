import { useState } from "react";
import { pb } from "./lib/pocketbase";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await pb.collection("products").create(formData);

      alert("Thêm sản phẩm thành công");
      setName("");
      setPrice("");
      setDescription("");
      setImageFile(null);
    } catch (error) {
      console.error(error);
      alert("Thêm sản phẩm thất bại");
    }
  };

  return (
    <div className="p-6 space-y-3">
      <h2 className="text-2xl font-bold">Thêm sản phẩm</h2>

      <input
        className="border p-2 w-full"
        placeholder="Tên sản phẩm"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Giá"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Mô tả"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Thêm sản phẩm
      </button>
    </div>
  );
}
