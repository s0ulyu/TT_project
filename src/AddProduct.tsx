import { useState, useRef } from "react";
import { pb } from "./lib/pocketbase";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
      alert("Thêm sản phẩm thất bại");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-8">
      <h2 className="text-xl font-bold mb-5">Thêm sản phẩm mới</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1">
            Tên sản phẩm
          </label>
          <input
            id="product-name"
            className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-black focus:border-black outline-none transition"
            placeholder="Nhập tên sản phẩm..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-1">
            Giá (VNĐ)
          </label>
          <input
            id="product-price"
            type="number"
            className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-black focus:border-black outline-none transition"
            placeholder="VD: 150000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            id="product-description"
            className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-black focus:border-black outline-none transition"
            placeholder="Mô tả chi tiết sản phẩm..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="product-image" className="block text-sm font-medium text-gray-700 mb-1">
            Hình ảnh
          </label>
          <input
            id="product-image"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 transition cursor-pointer border border-gray-300 rounded-lg"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white font-medium px-4 py-2.5 rounded-lg hover:bg-gray-800 active:bg-gray-900 transition-colors mt-2 disabled:bg-gray-400"
          disabled={!name || !price}
        >
          Thêm sản phẩm
        </button>
      </form>
    </div>
  );
}
