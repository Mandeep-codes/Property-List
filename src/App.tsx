import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Property = {
  id: number;
  name: string;
  address: string;
  price: number;
};

function App() {
  const [properties, setProperties] = useState<Property[]>([
    { id: 1, name: "Sunset Villa", address: "123 Ocean Drive, Miami", price: 1200000 },
    { id: 2, name: "Mountain Retreat", address: "456 Pine Trail, Aspen", price: 2500000 },
    { id: 3, name: "City Loft", address: "789 Main St, New York", price: 3100000 },
  ]);

  const [newPropertyName, setNewPropertyName] = useState("");
  const [newPropertyAddress, setNewPropertyAddress] = useState("");
  const [newPropertyPrice, setNewPropertyPrice] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [sortOrder, setSortOrder] = useState("name-asc");

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProperty(null);
    setNewPropertyName("");
    setNewPropertyAddress("");
    setNewPropertyPrice("");
  };

  const handleAddProperty = () => {
    if (!newPropertyName || !newPropertyAddress || !newPropertyPrice) {
      alert("Please fill all fields.");
      return;
    }
    const newProperty: Property = {
      id: Date.now(),
      name: newPropertyName,
      address: newPropertyAddress,
      price: parseFloat(newPropertyPrice),
    };
    setProperties([...properties, newProperty]);
    handleCloseDialog();
  };

  const handleUpdateProperty = () => {
    if (!editingProperty) return;
    setProperties(
      properties.map((p) =>
        p.id === editingProperty.id
          ? {
              ...p,
              name: newPropertyName,
              address: newPropertyAddress,
              price: parseFloat(newPropertyPrice),
            }
          : p
      )
    );
    handleCloseDialog();
  };

  const handleOpenEditDialog = (property: Property) => {
    setEditingProperty(property);
    setNewPropertyName(property.name);
    setNewPropertyAddress(property.address);
    setNewPropertyPrice(String(property.price));
    setIsDialogOpen(true);
  };

  const handleDeleteProperty = (idToDelete: number) => {
    setProperties(properties.filter((property) => property.id !== idToDelete));
  };

  const processedProperties = properties
    .filter(
      (property) =>
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOrder) {
        case "price-desc":
          return b.price - a.price;
        case "price-asc":
          return a.price - b.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="container mx-auto p-8 bg-background text-foreground min-h-screen">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Properties</h1>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              Add New Property
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[425px]"
            onEscapeKeyDown={handleCloseDialog}
          >
            <DialogHeader>
              <DialogTitle>
                {editingProperty ? "Edit Property" : "Add New Property"}
              </DialogTitle>
              <DialogDescription>
                Make changes to your property here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newPropertyName}
                  onChange={(e) => setNewPropertyName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  value={newPropertyAddress}
                  onChange={(e) => setNewPropertyAddress(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={newPropertyPrice}
                  onChange={(e) => setNewPropertyPrice(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={
                  editingProperty ? handleUpdateProperty : handleAddProperty
                }
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <div className="flex gap-4 mb-8">
        <Input
          type="text"
          placeholder="Search by name or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="price-desc">Price (High to Low)</SelectItem>
            <SelectItem value="price-asc">Price (Low to High)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedProperties.map((property) => (
          <Card key={property.id}>
            <CardHeader>
              <CardTitle>{property.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{property.address}</p>
              <p className="text-lg font-semibold mt-2">
                ${property.price.toLocaleString()}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => handleOpenEditDialog(property)}
              >
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the
                      property "{property.name}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteProperty(property.id)}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </main>
    </div>
  );
}

export default App;
