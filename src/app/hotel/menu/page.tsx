"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft, Plus, Edit2, Trash2, ToggleLeft, ToggleRight,
  FolderPlus, Leaf, Drumstick,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomSheet } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, generateId } from "@/lib/utils";
import { useHotelStore } from "@/store/hotelStore";
import type { Product, Category } from "@/types";
import toast from "react-hot-toast";

export default function MenuManagementPage() {
  const {
    loggedInHotel, getHotelCategories, getHotelProducts,
    addCategory, updateCategory, deleteCategory,
    addProduct, updateProduct, deleteProduct, toggleProductAvailability,
  } = useHotelStore();

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showProductSheet, setShowProductSheet] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categoryName, setCategoryName] = useState("");

  const [productForm, setProductForm] = useState({
    name: "", description: "", price: "", categoryId: "", isVeg: true,
  });

  if (!loggedInHotel) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Link href="/hotel/login" className="text-primary font-semibold">Login first</Link>
      </div>
    );
  }

  const categories = getHotelCategories(loggedInHotel.id);
  const products = getHotelProducts(loggedInHotel.id);
  const filteredProducts = activeCategory
    ? products.filter((p) => p.categoryId === activeCategory)
    : products;

  const handleAddCategory = () => {
    if (!categoryName.trim()) return;
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryName.trim());
      toast.success("Category updated");
    } else {
      addCategory({
        id: `cat-${generateId()}`,
        name: categoryName.trim(),
        hotelId: loggedInHotel.id,
        sortOrder: categories.length + 1,
      });
      toast.success("Category added");
    }
    setCategoryName("");
    setEditingCategory(null);
    setShowCategoryDialog(false);
  };

  const handleDeleteCategory = (cat: Category) => {
    deleteCategory(cat.id);
    toast.success("Category deleted");
    if (activeCategory === cat.id) setActiveCategory(null);
  };

  const openEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setShowCategoryDialog(true);
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "", description: "", price: "",
      categoryId: activeCategory || categories[0]?.id || "",
      isVeg: true,
    });
    setShowProductSheet(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      description: p.description || "",
      price: String(p.price),
      categoryId: p.categoryId,
      isVeg: p.isVeg,
    });
    setShowProductSheet(true);
  };

  const handleSaveProduct = () => {
    if (!productForm.name.trim() || !productForm.price || !productForm.categoryId) {
      toast.error("Fill in all required fields");
      return;
    }
    const price = parseFloat(productForm.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Enter valid price");
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: productForm.name.trim(),
        description: productForm.description.trim() || undefined,
        price,
        categoryId: productForm.categoryId,
        isVeg: productForm.isVeg,
      });
      toast.success("Product updated");
    } else {
      addProduct({
        id: `prod-${generateId()}`,
        name: productForm.name.trim(),
        description: productForm.description.trim() || undefined,
        price,
        categoryId: productForm.categoryId,
        hotelId: loggedInHotel.id,
        isAvailable: true,
        isVeg: productForm.isVeg,
      });
      toast.success("Product added");
    }
    setShowProductSheet(false);
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 shadow-soft">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link href="/hotel/dashboard" className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center flex-shrink-0">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-black text-gray-900 flex-1 min-w-0">Menu</h1>
        </div>

        <div className="px-4 pb-3 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              setEditingCategory(null);
              setCategoryName("");
              setShowCategoryDialog(true);
            }}
          >
            <FolderPlus className="h-4 w-4" /> Category
          </Button>
          <Button size="sm" className="flex-1" onClick={openAddProduct}>
            <Plus className="h-4 w-4" /> Product
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="border-t border-gray-100">
          <div className="flex gap-1 px-3 py-3 overflow-x-auto overflow-y-hidden scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              !activeCategory ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            All ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;
            return (
              <div key={cat.id} className="flex items-center flex-shrink-0">
                <button
                  onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                  className={`px-3.5 py-1.5 rounded-l-full text-xs font-semibold transition-all ${
                    activeCategory === cat.id ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {cat.name} ({count})
                </button>
                <div className="flex">
                  <button
                    onClick={() => openEditCategory(cat)}
                    className={`px-1.5 py-1.5 text-xs transition-colors ${
                      activeCategory === cat.id ? "bg-primary/80 text-white" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className={`px-1.5 py-1.5 rounded-r-full text-xs transition-colors ${
                      activeCategory === cat.id ? "bg-primary/60 text-white" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="px-4 py-4 space-y-3">
        {categories.length === 0 && (
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-center">
            <p className="text-sm text-amber-800 font-medium">
              Add a category first, then add products.
            </p>
          </div>
        )}

        {filteredProducts.length === 0 && categories.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <span className="text-5xl">🍽️</span>
            <p className="text-gray-500 mt-4 font-semibold">No products yet</p>
            <Button onClick={openAddProduct} className="mt-4" size="sm">
              <Plus className="h-4 w-4" /> Add First Product
            </Button>
          </motion.div>
        ) : (
          filteredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`bg-white rounded-xl border shadow-soft flex items-center gap-3 p-3 transition-all ${
                product.isAvailable ? "border-gray-100" : "border-gray-200 opacity-60"
              }`}
            >
              <div className="h-14 w-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-2xl">
                🍽️
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-sm border ${product.isVeg ? "border-green-600" : "border-red-600"} flex items-center justify-center`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${product.isVeg ? "bg-green-600" : "bg-red-600"}`} />
                  </span>
                  <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{product.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-gray-900">{formatCurrency(product.price)}</span>
                  <Badge variant={product.isAvailable ? "success" : "muted"} className="text-[10px] px-2 py-0">
                    {product.isAvailable ? "Available" : "Disabled"}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleProductAvailability(product.id)}
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  {product.isAvailable ? (
                    <ToggleRight className="h-6 w-6 text-primary" />
                  ) : (
                    <ToggleLeft className="h-6 w-6" />
                  )}
                </button>
                <button
                  onClick={() => openEditProduct(product)}
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => { deleteProduct(product.id); toast.success("Product deleted"); }}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Category Sheet */}
      <BottomSheet
        open={showCategoryDialog}
        onClose={() => setShowCategoryDialog(false)}
        title={editingCategory ? "Edit Category" : "Add Category"}
      >
        <div className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Biryani, Meals, Drinks"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            autoFocus
          />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowCategoryDialog(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAddCategory} className="flex-1">
              {editingCategory ? "Update" : "Add"} Category
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* Product Sheet */}
      <BottomSheet
        open={showProductSheet}
        onClose={() => setShowProductSheet(false)}
        title={editingProduct ? "Edit Product" : "Add Product"}
      >
        <div className="space-y-4">
          <Input
            label="Product Name *"
            placeholder="e.g. Chicken Biryani"
            value={productForm.name}
            onChange={(e) => setProductForm((f) => ({ ...f, name: e.target.value }))}
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              placeholder="Brief description..."
              value={productForm.description}
              onChange={(e) => setProductForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <Input
            label="Price (₹) *"
            placeholder="e.g. 150"
            type="number"
            min="0"
            value={productForm.price}
            onChange={(e) => setProductForm((f) => ({ ...f, price: e.target.value }))}
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Category *</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setProductForm((f) => ({ ...f, categoryId: cat.id }))}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                    productForm.categoryId === cat.id
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Food Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProductForm((f) => ({ ...f, isVeg: true }))}
                className={`py-2.5 rounded-lg border font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                  productForm.isVeg
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                <Leaf className="h-4 w-4" /> Veg
              </button>
              <button
                type="button"
                onClick={() => setProductForm((f) => ({ ...f, isVeg: false }))}
                className={`py-2.5 rounded-lg border font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                  !productForm.isVeg
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                <Drumstick className="h-4 w-4" /> Non-Veg
              </button>
            </div>
          </div>
          <Button onClick={handleSaveProduct} className="w-full mt-2" size="lg">
            {editingProduct ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
