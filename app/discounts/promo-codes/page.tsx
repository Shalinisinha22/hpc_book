"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Pagination } from "@/components/pagination";
import axios from "axios";
import { API_ROUTES } from "@/config/api";

// Types
interface PromoCode {
  _id: string;
  room_id: string;
  start_date: string;
  end_date: string;
  promo_code: string;
  discount: number;
  type: "percentage" | "fixed";
}
interface FormData {
  room: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  promoCode: string;
  discount: string;
  type: "percentage" | "fixed";
}

// Mock data for promo code types
const typeOptions = [
  { id: "percent", name: "Percent" },
  { id: "fixed", name: "Fixed Amount" },
];

export default function PromoCodesPage() {
  const { toast } = useToast();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState<PromoCode | null>(null);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    room: "",
    dateFrom: null,
    dateTo: null,
    promoCode: "",
    discount: "",
    type: "percentage",
  });

  // Fetch promo codes from API
  const fetchPromoCodes = async () => {
    try {
      const res = await axios.get(API_ROUTES.promocodes, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      });
      setPromoCodes(res.data);
      setTotalPages(Math.ceil(res.data.length / 10));
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load promo codes",
        variant: "destructive",
      });
    }
  };

  // Load promo codes on mount
  useEffect(() => {
    fetchPromoCodes();
  }, []);

  // Fetch rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(API_ROUTES.rooms);
        setRooms(res.data);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load rooms",
          variant: "destructive",
        });
      }
    };
    fetchRooms();
  }, []);

  // Handle form input changes
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Add promo code (POST)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (
      !formData.room ||
      !formData.dateFrom ||
      !formData.dateTo ||
      !formData.promoCode ||
      !formData.discount
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    if (formData.dateFrom < today) {
      toast({
        title: "Error",
        description: "'Date From' must be today or later.",
        variant: "destructive",
      });
      return;
    }
    if (formData.dateTo < formData.dateFrom) {
      toast({
        title: "Error",
        description: "'Date To' cannot be before 'Date From'.",
        variant: "destructive",
      });
      return;
    }
    try {
      await axios.post(
        API_ROUTES.promocodes,
        {
          room_id: formData.room,
          start_date: formData.dateFrom,
          end_date: formData.dateTo,
          promo_code: formData.promoCode,
          discount: Number(formData.discount),
          type: formData.type,
        },

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          }
        }
      );
      toast({ title: "Success", description: "Promo code added successfully" });
      await fetchPromoCodes();
      setCurrentPage(1); 
    
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add promo code",
        variant: "destructive",
      });
    }
    // Reset form
    setFormData({
      room: "",
      dateFrom: null,
      dateTo: null,
      promoCode: "",
      discount: "",
      type: "percentage",
    });
  };

  // Handle delete
  const handleDelete = (_id: string) => {
    const promoToDelete = promoCodes.find((promo) => promo._id === _id);
    setPromoToDelete(promoToDelete || null);
    setIsDeleteDialogOpen(true);
  };

  // Update promo code (PUT)
  const handleUpdate = async (id, updatedData) => {
    try {
      await axios.put(`${API_ROUTES.promocodes}/${id}`, updatedData,
        {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
            }
    });
      toast({
        title: "Success",
        description: "Promo code updated successfully",
      });
      // Optionally refresh promo codes list here
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update promo code",
        variant: "destructive",
      });
    }
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (promoToDelete) {
      try {
        await axios.delete(`${API_ROUTES.promocodes}/${promoToDelete._id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
            }
          }
        );
        toast({
          title: "Success",
          description: "Promo code deleted successfully",
        });
        await fetchPromoCodes(); // Refresh the list after delete
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to delete promo code",
          variant: "destructive",
        });
      }
    }
    setIsDeleteDialogOpen(false);
    setPromoToDelete(null);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Manage Promo Codes"
        description="Create different promo codes for any room during a certain time of the year. The promo code discount can be either in % or fixed amount. Just click on the 'Add Promo code' button and fill in the form."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Promo Codes Table */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Promo Codes</h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date From
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date To
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Promo Code
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {promoCodes.length > 0 ? (
                    promoCodes.map((promo, index) => (
                      <tr
                        key={promo.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4 text-sm">{index + 1}</td>
                        <td className="py-4 px-4 text-sm">
                          {rooms.find((r) => r._id === promo.room_id._id)
                            ?.room_title || "-"}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {format(new Date(promo.start_date), "MM/dd/yyyy")}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {format(new Date(promo.end_date), "MM/dd/yyyy")}
                        </td>
                        <td className="py-4 px-4 text-sm font-medium">
                          {promo.promo_code}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {promo.type === "percent"
                            ? "Percent"
                            : "Fixed Amount"}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {promo.type === "percent"
                            ? `${promo.discount}%`
                            : `₹${promo.discount}`}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          <button
                            onClick={() => handleDelete(promo._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-4 px-4 text-center text-sm text-gray-500"
                      >
                        No promo codes found. Add your first promo code.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {promoCodes.length > 0 && (
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>

        {/* Add Promo Code Form */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Add Promo Code</h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Room Selection */}
                <div>
                  <label
                    htmlFor="room"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Room
                  </label>
                  <Select
                    value={formData.room}
                    onValueChange={(value) => handleInputChange("room", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="-- Choose --" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room._id} value={room._id}>
                          {room.room_title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date From
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dateFrom ? (
                          format(formData.dateFrom, "MM/dd/yyyy")
                        ) : (
                          <span>mm/dd/yyyy</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.dateFrom}
                        onSelect={(date) => handleInputChange("dateFrom", date)}
                        initialFocus
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date To
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dateTo ? (
                          format(formData.dateTo, "MM/dd/yyyy")
                        ) : (
                          <span>mm/dd/yyyy</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.dateTo}
                        onSelect={(date) => handleInputChange("dateTo", date)}
                        initialFocus
                        disabled={(date) =>
                          formData.dateFrom
                            ? date < formData.dateFrom
                            : date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Promo Code */}
                <div>
                  <label
                    htmlFor="promoCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Promo Code
                  </label>
                  <Input
                    id="promoCode"
                    value={formData.promoCode}
                    onChange={(e) =>
                      handleInputChange("promoCode", e.target.value)
                    }
                    placeholder="Promo Code"
                  />
                </div>

                {/* Discount */}
                <div>
                  <label
                    htmlFor="discount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Discount
                  </label>
                  <Input
                    id="discount"
                    value={formData.discount}
                    onChange={(e) =>
                      handleInputChange("discount", e.target.value)
                    }
                    placeholder="Discount"
                    type="number"
                  />
                </div>

                {/* Type */}
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Type
                  </label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gold hover:bg-gold/90 text-white"
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the promo code "
              {promoToDelete?.promo_code}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
