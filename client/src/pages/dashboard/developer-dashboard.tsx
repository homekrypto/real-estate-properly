import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertProjectSchema, insertPropertySchema } from "@shared/schema";
import { 
  Building, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  TrendingUp,
  Users,
  Crown,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Home
} from "lucide-react";
import { Link } from "wouter";

export default function DeveloperDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: myProjects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects", user?.id],
    enabled: isAuthenticated && !!user?.id,
    queryFn: async () => {
      const res = await fetch(`/api/projects?developerId=${user?.id}`);
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
  });

  const { data: myUnits = [], isLoading: unitsLoading } = useQuery({
    queryKey: ["/api/properties", { developerId: user?.id }],
    enabled: isAuthenticated && !!user?.id,
    queryFn: async () => {
      const res = await fetch(`/api/properties?developerId=${user?.id}`);
      if (!res.ok) throw new Error("Failed to fetch units");
      return res.json();
    },
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/messages"],
    enabled: isAuthenticated,
  });

  const { data: countries = [] } = useQuery({
    queryKey: ["/api/countries"],
  });

  const addProjectMutation = useMutation({
    mutationFn: async (projectData: any) => {
      return await apiRequest("POST", "/api/projects", projectData);
    },
    onSuccess: () => {
      toast({
        title: "Project Added",
        description: "Your development project has been successfully created.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setIsAddProjectOpen(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addUnitMutation = useMutation({
    mutationFn: async (unitData: any) => {
      return await apiRequest("POST", "/api/properties", unitData);
    },
    onSuccess: () => {
      toast({
        title: "Unit Added",
        description: "Unit has been successfully added to the project.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      setIsAddUnitOpen(false);
      setSelectedProject(null);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add unit. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: number) => {
      return await apiRequest("DELETE", `/api/projects/${projectId}`);
    },
    onSuccess: () => {
      toast({
        title: "Project Deleted",
        description: "Project has been removed from your portfolio.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddProject = (formData: FormData) => {
    const projectData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      countryId: parseInt(formData.get("countryId") as string),
      totalUnits: parseInt(formData.get("totalUnits") as string),
      availableUnits: parseInt(formData.get("totalUnits") as string), // Initially all units are available
      completionDate: new Date(formData.get("completionDate") as string),
      images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      amenities: [],
      isActive: true,
    };

    try {
      insertProjectSchema.parse(projectData);
      addProjectMutation.mutate(projectData);
    } catch (error) {
      toast({
        title: "Validation Error",
        description: "Please check all required fields.",
        variant: "destructive",
      });
    }
  };

  const handleAddUnit = (formData: FormData) => {
    const unitData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      propertyType: formData.get("propertyType") as string,
      listingType: "sale",
      bedrooms: parseInt(formData.get("bedrooms") as string),
      bathrooms: parseInt(formData.get("bathrooms") as string),
      squareMeters: parseInt(formData.get("squareMeters") as string),
      address: selectedProject?.address || "",
      city: selectedProject?.city || "",
      region: formData.get("region") as string,
      countryId: selectedProject?.countryId || 1,
      currency: "EUR",
      images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
      features: [],
      developerId: user?.id,
      projectId: selectedProject?.id,
      isActive: true,
      isFeatured: false,
    };

    try {
      insertPropertySchema.parse(unitData);
      addUnitMutation.mutate(unitData);
    } catch (error) {
      toast({
        title: "Validation Error",
        description: "Please check all required fields.",
        variant: "destructive",
      });
    }
  };

  // Calculate stats
  const totalUnits = myProjects.reduce((sum: number, project: any) => sum + (project.totalUnits || 0), 0);
  const availableUnits = myProjects.reduce((sum: number, project: any) => sum + (project.availableUnits || 0), 0);
  const soldUnits = totalUnits - availableUnits;
  const totalValue = myUnits.reduce((sum: number, unit: any) => sum + parseFloat(unit.price || "0"), 0);
  const unreadMessages = messages.filter((msg: any) => !msg.isRead);

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-20">
          <div className="container mx-auto px-4 lg:px-8 py-8">
            <Skeleton className="w-64 h-8 mb-8" />
            <div className="grid lg:grid-cols-4 gap-8">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Layout>
      
      <div className="pt-20">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-luxury text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Developer Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your development projects, units, and connect with international buyers
              </p>
            </div>
            <div className="flex space-x-3">
              <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Development Project</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    handleAddProject(formData);
                  }} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Project Name</Label>
                      <Input id="name" name="name" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" rows={3} required />
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" name="address" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" required />
                      </div>
                      <div>
                        <Label htmlFor="countryId">Country</Label>
                        <Select name="countryId" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country: any) => (
                              <SelectItem key={country.id} value={country.id.toString()}>
                                {country.flag} {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="totalUnits">Total Units</Label>
                        <Input id="totalUnits" name="totalUnits" type="number" min="1" required />
                      </div>
                      <div>
                        <Label htmlFor="completionDate">Completion Date</Label>
                        <Input id="completionDate" name="completionDate" type="date" required />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsAddProjectOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={addProjectMutation.isPending}
                        className="bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white"
                      >
                        {addProjectMutation.isPending ? "Adding..." : "Add Project"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddUnitOpen} onOpenChange={setIsAddUnitOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" disabled={myProjects.length === 0}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Unit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Unit to Project</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    handleAddUnit(formData);
                  }} className="space-y-4">
                    <div>
                      <Label htmlFor="projectSelect">Select Project</Label>
                      <Select 
                        value={selectedProject?.id?.toString() || ""} 
                        onValueChange={(value) => {
                          const project = myProjects.find((p: any) => p.id.toString() === value);
                          setSelectedProject(project);
                        }}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a project" />
                        </SelectTrigger>
                        <SelectContent>
                          {myProjects.map((project: any) => (
                            <SelectItem key={project.id} value={project.id.toString()}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Unit Title</Label>
                        <Input id="title" name="title" required />
                      </div>
                      <div>
                        <Label htmlFor="price">Price (EUR)</Label>
                        <Input id="price" name="price" type="number" required />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" rows={3} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="propertyType">Unit Type</Label>
                        <Select name="propertyType" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="penthouse">Penthouse</SelectItem>
                            <SelectItem value="villa">Villa</SelectItem>
                            <SelectItem value="studio">Studio</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="region">Region/Area</Label>
                        <Input id="region" name="region" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input id="bedrooms" name="bedrooms" type="number" min="0" required />
                      </div>
                      <div>
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Input id="bathrooms" name="bathrooms" type="number" min="0" required />
                      </div>
                      <div>
                        <Label htmlFor="squareMeters">Square Meters</Label>
                        <Input id="squareMeters" name="squareMeters" type="number" min="0" required />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsAddUnitOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={addUnitMutation.isPending || !selectedProject}
                        className="bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white"
                      >
                        {addUnitMutation.isPending ? "Adding..." : "Add Unit"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-forest-100 dark:bg-forest-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building className="h-6 w-6 text-forest-600 dark:text-forest-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {myProjects.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Projects</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Home className="h-6 w-6 text-gold-600 dark:text-gold-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalUnits}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Units</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {soldUnits}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Units Sold</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {unreadMessages.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">New Inquiries</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-6 w-6 text-gold-600 dark:text-gold-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  €{(totalValue / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Portfolio Value</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="projects" className="flex items-center space-x-2">
                <Building className="h-4 w-4" />
                <span>Projects</span>
              </TabsTrigger>
              <TabsTrigger value="units" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Units</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Messages</span>
                {unreadMessages.length > 0 && (
                  <Badge variant="destructive" className="ml-1 text-xs">
                    {unreadMessages.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Projects Tab */}
            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building className="h-5 w-5 text-forest-600" />
                      <span>Development Projects</span>
                    </div>
                    <Badge variant="secondary">
                      {myProjects.length} active
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {projectsLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}>
                          <Skeleton className="w-full h-48" />
                          <CardContent className="p-4">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2 mb-4" />
                            <div className="flex space-x-4 mb-4">
                              <Skeleton className="h-4 w-16" />
                              <Skeleton className="h-4 w-16" />
                            </div>
                            <Skeleton className="h-8 w-full" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : myProjects.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No Development Projects
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Create your first development project to start showcasing units to international buyers.
                      </p>
                      <Button 
                        onClick={() => setIsAddProjectOpen(true)}
                        className="bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Project
                      </Button>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myProjects.map((project: any) => (
                        <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative">
                            <img 
                              src={project.images[0]} 
                              alt={project.name}
                              className="w-full h-48 object-cover" 
                            />
                            <div className="absolute top-2 left-2">
                              <Badge className={project.isActive ? "bg-green-600" : "bg-gray-600"}>
                                {project.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                              {project.name}
                            </h3>
                            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                              <MapPin className="mr-1 h-4 w-4" />
                              {project.city}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                              {project.description}
                            </p>
                            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Total Units:</span>
                                <div className="font-semibold text-gray-900 dark:text-white">
                                  {project.totalUnits}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Available:</span>
                                <div className="font-semibold text-green-600 dark:text-green-400">
                                  {project.availableUnits}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {project.completionDate ? 
                                    new Date(project.completionDate).toLocaleDateString() : 
                                    "TBD"
                                  }
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => {
                                  setSelectedProject(project);
                                  setIsAddUnitOpen(true);
                                }}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Unit
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => deleteProjectMutation.mutate(project.id)}
                                disabled={deleteProjectMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Units Tab */}
            <TabsContent value="units">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Home className="h-5 w-5 text-gold-600" />
                      <span>Project Units</span>
                    </div>
                    <Badge variant="secondary">
                      {myUnits.length} units
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {unitsLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}>
                          <Skeleton className="w-full h-48" />
                          <CardContent className="p-4">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2 mb-4" />
                            <div className="flex space-x-4 mb-4">
                              <Skeleton className="h-4 w-16" />
                              <Skeleton className="h-4 w-16" />
                            </div>
                            <Skeleton className="h-8 w-full" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : myUnits.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Home className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No Units Added
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Add units to your projects to start selling to international buyers.
                      </p>
                      <Button 
                        onClick={() => setIsAddUnitOpen(true)}
                        disabled={myProjects.length === 0}
                        className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Unit
                      </Button>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myUnits.map((unit: any) => (
                        <Card key={unit.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative">
                            <img 
                              src={unit.images[0]} 
                              alt={unit.title}
                              className="w-full h-48 object-cover" 
                            />
                            <div className="absolute top-2 left-2">
                              <Badge className={unit.isActive ? "bg-green-600" : "bg-gray-600"}>
                                {unit.isActive ? "Available" : "Sold"}
                              </Badge>
                            </div>
                            {unit.isFeatured && (
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-gold-600">
                                  <Crown className="mr-1 h-3 w-3" />
                                  Featured
                                </Badge>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <div className="text-xl font-bold text-forest-600 dark:text-forest-400 mb-2">
                              €{Number(unit.price).toLocaleString()}
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                              {unit.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                              <span className="flex items-center">
                                <Bed className="mr-1 h-4 w-4" />
                                {unit.bedrooms}
                              </span>
                              <span className="flex items-center">
                                <Bath className="mr-1 h-4 w-4" />
                                {unit.bathrooms}
                              </span>
                              <span className="flex items-center">
                                <Square className="mr-1 h-4 w-4" />
                                {unit.squareMeters}m²
                              </span>
                            </div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                <Eye className="h-4 w-4" />
                                <span>{unit.viewCount || 0} views</span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Link href={`/property/${unit.id}`} className="flex-1">
                                <Button variant="outline" size="sm" className="w-full">
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </Button>
                              </Link>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-forest-600" />
                      <span>Sales Performance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-forest-50 dark:bg-forest-950 rounded-lg">
                        <span className="text-gray-700 dark:text-gray-300">Sales Rate</span>
                        <span className="font-bold text-forest-600 dark:text-forest-400">
                          {totalUnits > 0 ? ((soldUnits / totalUnits) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gold-50 dark:bg-gold-950 rounded-lg">
                        <span className="text-gray-700 dark:text-gray-300">Average Unit Value</span>
                        <span className="font-bold text-gold-600 dark:text-gold-400">
                          €{myUnits.length > 0 ? Math.round(totalValue / myUnits.length).toLocaleString() : 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                        <span className="text-gray-700 dark:text-gray-300">Total Revenue</span>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          €{(totalValue * soldUnits / totalUnits / 1000000).toFixed(1)}M
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-gold-600" />
                      <span>Top Performing Projects</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {myProjects
                        .sort((a: any, b: any) => (b.totalUnits - b.availableUnits) - (a.totalUnits - a.availableUnits))
                        .slice(0, 5)
                        .map((project: any, index: number) => (
                        <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              #{index + 1}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                                {project.name}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {project.city}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-forest-600 dark:text-forest-400">
                              {project.totalUnits - project.availableUnits}/{project.totalUnits}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">sold</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-forest-600" />
                    <span>Buyer Inquiries</span>
                    {unreadMessages.length > 0 && (
                      <Badge variant="destructive">
                        {unreadMessages.length} unread
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {messagesLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Card key={i}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <Skeleton className="h-5 w-1/3" />
                              <Skeleton className="h-4 w-20" />
                            </div>
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No Inquiries Yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        When international buyers contact you about units, their messages will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message: any) => (
                        <Card 
                          key={message.id} 
                          className={`cursor-pointer transition-colors ${
                            !message.isRead ? "border-forest-200 dark:border-forest-800 bg-forest-50 dark:bg-forest-950" : ""
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {message.subject}
                                </h3>
                                {!message.isRead && (
                                  <Badge variant="destructive" className="text-xs">
                                    New
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(message.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                              From: {message.fromUserId}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                              {message.message}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer is included in Layout */}
      </Layout>
    </div>
  );
}
