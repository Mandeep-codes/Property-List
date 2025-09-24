import { useState } from "react"
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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  ]);

  const [newPropertyName, setNewPropertyName] = useState("");
  const [newPropertyAddress, setNewPropertyAddress] = useState("");
  const [newPropertyPrice, setNewPropertyPrice] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  
  const [searchTerm, setSearchTerm] = useState("");

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
    
    setNewPropertyName("");
    setNewPropertyAddress("");
    setNewPropertyPrice("");
    setIsDialogOpen(false);
  };
  
  const handleDeleteProperty = (idToDelete: number) => {
    setProperties(properties.filter(property => property.id !== idToDelete));
  };

  
  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-8 bg-background text-foreground min-h-screen">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Properties</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Property</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
              <DialogDescription>
                Enter the details for the new property. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={newPropertyName} onChange={(e) => setNewPropertyName(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">Address</Label>
                <Input id="address" value={newPropertyAddress} onChange={(e) => setNewPropertyAddress(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Price ($)</Label>
                <Input id="price" type="number" value={newPropertyPrice} onChange={(e) => setNewPropertyPrice(e.target.value)} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddProperty}>Save Property</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>
      
      
      <div className="mb-8">
        <Input 
          type="text"
          placeholder="Search by name or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
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
            <CardFooter className="flex justify-end">
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
                    <AlertDialogAction onClick={() => handleDeleteProperty(property.id)}>
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