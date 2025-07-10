import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Bed, Bath, Square, MapPin, Filter, Grid, List, ChevronDown } from "lucide-react";
import { Link } from "wouter";

export default function SearchResults() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    countryId: "",
    propertyType: "",
    listingType: "sale",
    minPrice: 0,
    maxPrice: 10000000,
    bedrooms: "",
    bathrooms: "",
    sortBy: "newest"
  });

  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFilters(prev => ({
      ...prev,
      countryId: params.get("countryId") || "",
      propertyType: params.get("propertyType") || "",
      listingType: params.get("type") || "sale",
    }));
  }, [location]);

  const { data: countries = [] } = useQuery({
    queryKey: ["/api/countries"],
  });

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["/api/properties", "search", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") params.set(key, value.toString());
      });
      const res = await fetch(`/api/properties/search?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch properties");
      return res.json();
    },
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const PropertyCard = ({ property }: { property: any }) => (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group">
      <div className="relative">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <Button 
          variant="ghost" 
          size="sm"
          className="absolute top-4 right-4 bg-white/90 hover:bg-white"
        >
          <Heart className="h-4 w-4" />
        </Button>
        <Badge className="absolute top-4 left-4 bg-forest-600 text-white">
          {property.listingType === "sale" ? t('listingTypes.sale') : t('listingTypes.rent')}
        </Badge>
      </div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-2xl font-bold text-forest-600 dark:text-forest-400">
              €{Number(property.price).toLocaleString()}
            </div>
            <div className="text-gray-600 dark:text-gray-400 flex items-center">
              <MapPin className="mr-1 h-4 w-4" />
              {property.city}, {property.region}
            </div>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
          {property.title}
        </h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span className="flex items-center">
            <Bed className="mr-1 h-4 w-4" />
            {property.bedrooms} {t('property.beds')}
          </span>
          <span className="flex items-center">
            <Bath className="mr-1 h-4 w-4" />
            {property.bathrooms} {t('property.baths')}
          </span>
          <span className="flex items-center">
            <Square className="mr-1 h-4 w-4" />
            {property.squareMeters} m²
          </span>
        </div>
        <Link href={`/property/${property.id}`}>
          <Button className="w-full bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  const PropertyListItem = ({ property }: { property: any }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="flex">
        <div className="relative w-64 h-48">
          <img 
            src={property.images[0]} 
            alt={property.title}
            className="w-full h-full object-cover" 
          />
          <Badge className="absolute top-4 left-4 bg-forest-600 text-white">
            {property.listingType === "sale" ? "For Sale" : "For Rent"}
          </Badge>
        </div>
        <CardContent className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-2xl font-bold text-forest-600 dark:text-forest-400">
                €{Number(property.price).toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400 flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                {property.city}, {property.region}
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {property.title}
          </h3>
          <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <span className="flex items-center">
              <Bed className="mr-1 h-4 w-4" />
              {property.bedrooms} Bedrooms
            </span>
            <span className="flex items-center">
              <Bath className="mr-1 h-4 w-4" />
              {property.bathrooms} Bathrooms
            </span>
            <span className="flex items-center">
              <Square className="mr-1 h-4 w-4" />
              {property.squareMeters} m²
            </span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-600 dark:text-gray-300 line-clamp-2 flex-1 mr-4">
              {property.description}
            </p>
            <Link href={`/property/${property.id}`}>
              <Button className="bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white">
                View Details
              </Button>
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="pt-20">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-luxury text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {filters.listingType === "sale" ? "Properties for Sale" : "Properties for Rent"}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Found {properties.length} luxury properties matching your criteria
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <div className="flex items-center mb-6">
                  <Filter className="mr-2 h-5 w-5 text-forest-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
                </div>

                <div className="space-y-6">
                  {/* Listing Type */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Listing Type
                    </label>
                    <Select 
                      value={filters.listingType} 
                      onValueChange={(value) => handleFilterChange("listingType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Country
                    </label>
                    <Select 
                      value={filters.countryId} 
                      onValueChange={(value) => handleFilterChange("countryId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Countries" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Countries</SelectItem>
                        {countries.map((country: any) => (
                          <SelectItem key={country.id} value={country.id.toString()}>
                            {country.flag} {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Property Type */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Property Type
                    </label>
                    <Select 
                      value={filters.propertyType} 
                      onValueChange={(value) => handleFilterChange("propertyType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="penthouse">Penthouse</SelectItem>
                        <SelectItem value="farmhouse">Farmhouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 block">
                      Price Range: €{filters.minPrice.toLocaleString()} - €{filters.maxPrice.toLocaleString()}
                    </label>
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Minimum</span>
                        <Slider
                          value={[filters.minPrice]}
                          onValueChange={([value]) => handleFilterChange("minPrice", value)}
                          max={10000000}
                          step={50000}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Maximum</span>
                        <Slider
                          value={[filters.maxPrice]}
                          onValueChange={([value]) => handleFilterChange("maxPrice", value)}
                          max={10000000}
                          step={50000}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Bedrooms
                    </label>
                    <Select 
                      value={filters.bedrooms} 
                      onValueChange={(value) => handleFilterChange("bedrooms", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bathrooms */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Bathrooms
                    </label>
                    <Select 
                      value={filters.bathrooms} 
                      onValueChange={(value) => handleFilterChange("bathrooms", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              {/* Results Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {properties.length} Properties Found
                  </h2>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Sort */}
                  <Select 
                    value={filters.sortBy} 
                    onValueChange={(value) => handleFilterChange("sortBy", value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="size">Size</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Mode */}
                  <div className="flex border rounded-lg">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Results Grid/List */}
              {isLoading ? (
                <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="w-full h-64" />
                      <CardContent className="p-6">
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-24 mb-4" />
                        <Skeleton className="h-5 w-full mb-4" />
                        <div className="flex space-x-4 mb-4">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPin className="h-16 w-16 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    No Properties Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                    We couldn't find any properties matching your search criteria. Try adjusting your filters or search in a different location.
                  </p>
                  <Button 
                    onClick={() => setFilters({
                      countryId: "",
                      propertyType: "",
                      listingType: "sale",
                      minPrice: 0,
                      maxPrice: 10000000,
                      bedrooms: "",
                      bathrooms: "",
                      sortBy: "newest"
                    })}
                    className="bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white"
                  >
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                  {properties.map((property: any) => 
                    viewMode === "grid" ? (
                      <PropertyCard key={property.id} property={property} />
                    ) : (
                      <PropertyListItem key={property.id} property={property} />
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
