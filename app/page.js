"use client";

import Image from "next/image";
import Header from "./components/Header";
import { useEffect, useState } from "react";

export default function Home() {
  // Sample data for demonstration
  const [newProduct, setNewProduct] = useState({
    slug: "",
    quantity: "",
    price: "",
  });
  const [alert, setAlert] = useState({ active: false, message: "" });

  const [products, setProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [dropdown, setDropdown] = useState([]);
  // const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      let response = await fetch("/api/product");
      let res = await response.json();
      // console.log(res);

      setProducts(res.products);
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  // console.log(newProduct);
  const handleAddProduct = async () => {
    if (!newProduct.slug || !newProduct.quantity || !newProduct.price) {
      setAlert({
        ...alert,
        active: true,
        message: "Please enter all the fields.",
      });

      setInterval(() => {
        setAlert({ ...alert, active: false, message: "" });
      }, 3000);
    } else {
      try {
        const response = await fetch("/api/product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add any other headers if needed
          },
          body: JSON.stringify(newProduct),
        });

        if (!response.ok) {
          // Handle error responses here
          console.error("Error:", response.statusText);
          return;
        }

        // Handle successful response
        // const result = await response.json();
        setNewProduct({});
        setAlert({
          ...alert,
          active: true,
          message: "Product Added Successfully.",
        });
        // console.log(newProduct);
        setTimeout(() => {
          setAlert({ ...alert, active: false, message: "" });
        }, 3000);
        // console.log("Success:", result);
      } catch (error) {
        console.error("Error:", error.message);
      }
    }
    // Fetch products again to sync back:
    let response = await fetch("/api/product");
    let res = await response.json();
    // console.log(res);

    setProducts(res.products);
  };

  const onDropDownChange = async (e) => {
    let value = e.target.value;
    setSearchTerm(value);
    setDropdown([]);
    if (value.length > 3) {
      try {
        setLoading(true);
        let response = await fetch("/api/search?query=" + searchTerm);
        let res = await response.json();
        // console.log(res);
        setDropdown(res.products);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      setDropdown([]);
    }
  };
  // console.log(dropdown);
  const buttonAction = async (action, slug, initialQuantity) => {
    // Immediately change the quantity in products and dropdown as well.
    let index = products.findIndex((item) => item.slug == slug);
    // Changing the quantity in products:
    let newProducts = [...products];
    if (action == "add") {
      newProducts[index].quantity = parseInt(initialQuantity) + 1;
    } else {
      newProducts[index].quantity = parseInt(initialQuantity) - 1;
    }
    setProducts(newProducts);
    // Changing the quantity in dropdown
    let dropIndex = dropdown.findIndex((item) => item.slug == slug);
    let newDropdown = [...dropdown];
    if (action == "add") {
      newDropdown[dropIndex].quantity = parseInt(initialQuantity) + 1;
    } else {
      newDropdown[dropIndex].quantity = parseInt(initialQuantity) - 1;
    }
    setDropdown(newDropdown);
    setLoadingAction(true);
    try {
      const response = await fetch("/api/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any other headers if needed
        },
        body: JSON.stringify({ action, slug, initialQuantity }),
      });
      const r = await response.json();
      // console.log(r);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingAction(false);
    }
    // console.log(action, slug);
  };
  return (
    <>
      <Header />

      <div className="container mx-auto px-5">
        {alert.active && (
          <div className="text-green-600 text-center relative">
            {alert.message}
          </div>
        )}
        <h1 className="text-3xl font-bold mt-8 mb-4">Search a Product</h1>

        {/* Search form with input and dropdown */}
        <div className="flex items-center mb-2">
          <input
            type="text"
            placeholder="Enter product name"
            value={searchTerm}
            onChange={(e) => onDropDownChange(e)}
            // onBlur={() => setDropdown([])}
            className="p-2 flex-1 border rounded-md mr-2 w-[90%]"
          />

          {/* Dropdown for selecting category */}
          {/* <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded-md">
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select> */}
        </div>
        <div className="absoulte w-[90%] bg-purple-100 rounded-xl">
          {loading && (
            <div className="flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 40 40"
                stroke="#000">
                <g fill="none" fillRule="evenodd" strokeWidth="2">
                  <circle cx="20" cy="20" r="18" strokeOpacity=".1">
                    <animate
                      attributeName="r"
                      from="18"
                      to="18"
                      begin="0s"
                      dur="0.8s"
                      values="18;0;18"
                      calcMode="linear"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="stroke-opacity"
                      from="1"
                      to="0"
                      begin="0s"
                      dur="0.8s"
                      values="1;.2;0.9;0"
                      calcMode="linear"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <path d="M20 2a18 18 0 1 0 0 36">
                    <animate
                      attributeName="stroke-dasharray"
                      from="1,200"
                      to="89,200"
                      begin="0s"
                      dur="0.8s"
                      values="1,200;89,200;1,200"
                      calcMode="linear"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="-124"
                      begin="0s"
                      dur="0.8s"
                      values="0;-30;-124"
                      calcMode="linear"
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
              </svg>
            </div>
          )}

          {dropdown?.map((item) => (
            <div
              className="container flex justify-between  p-2 rounded-2xl my-2"
              key={item.id}>
              <span>
                {item.slug} {item.quantity} available for ₹{item.price}
              </span>
              <div>
                <button
                  className="add px-3 py-1 bg-purple-400 rounded-md cursor-pointer disabled:bg-purple-50"
                  disabled={loadingAction}
                  onClick={() => {
                    buttonAction("subtract", item.slug, item.quantity);
                  }}>
                  -
                </button>
                <span className="mx-2">
                  {item.quantity > 10 ? item.quantity : "0" + item.quantity}
                </span>
                <button
                  className="subtract px-3 py-1 bg-purple-400 rounded-md cursor-pointer disabled:bg-purple-50"
                  disabled={loadingAction}
                  onClick={() => {
                    buttonAction("add", item.slug, item.quantity);
                  }}>
                  +
                </button>
              </div>
              {/* <span>{item.quantity}</span>
              <span>{item.price}</span> */}
            </div>
          ))}
        </div>
      </div>

      {/* Add a product */}
      <div className="container my-6 px-5 mx-auto">
        <h1 className="text-3xl font-bold mt-8 mb-4 ">Add a product</h1>

        {/* Form to add a new product */}
        <form className="mb-4">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-600">
              Product Slug
            </label>
            <input
              type="text"
              name="slug"
              value={newProduct?.slug || ""}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-600">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={newProduct?.quantity || ""}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-600">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={newProduct?.price || ""}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <button
            type="button"
            onClick={handleAddProduct}
            className="bg-blue-500 text-white p-2 rounded-md">
            Add Product
          </button>
        </form>
      </div>
      <div className="container my-6  mx-auto px-5">
        <h1 className="text-3xl font-bold mt-8 mb-4 ">Display Current Stock</h1>

        {/* Table for displaying stock */}
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              {/* <th className="py-2 px-4 border-b">ID</th> */}
              <th className="py-2 px-4 border-b">Product Slug</th>
              <th className="py-2 px-4 border-b">Quantity</th>
              <th className="py-2 px-4 border-b">Price</th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((product) => (
                <tr key={product.id}>
                  <td className="py-2 px-4 border-b">{product.slug}</td>
                  <td className="py-2 px-4 border-b">{product.quantity}</td>
                  <td className="py-2 px-4 border-b">₹{product.price}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
