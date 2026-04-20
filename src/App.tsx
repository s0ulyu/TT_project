import TestPB from "./TestPB";
import AddProduct from "./AddProduct";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Quản lý Sản phẩm</h1>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <AddProduct />
          </div>
          <div className="lg:col-span-2">
            <TestPB />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
