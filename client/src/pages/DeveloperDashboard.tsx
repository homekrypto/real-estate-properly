import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Building, Plus, Edit, Trash2, Users, Calendar, 
  TrendingUp, DollarSign, Home, Eye, Globe, BarChart3,
  Settings, Bell, Upload, MapPin, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Project {
  id: number;
  name: string;
  description: string;
  country: string;
  region: string;
  city: string;
  address: string;
  totalUnits: number;
  availableUnits: number;
  completionDate: string;
  images: string[];
  features: string[];
  isActive: boolean;
  createdAt: string;
}

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalUnits: number;
  soldUnits: number;
  totalRevenue: string;
}

export default function DeveloperDashboard() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newProjectForm, setNewProjectForm] = useState({
    name: '',
    description: '',
    country: '',
    region: '',
    city: '',
    address: '',
    totalUnits: 1,
    availableUnits: 1,
    completionDate: '',
    features: [],
  });

  // Mock developer ID - in real app this would come from auth context
  const developerId = 3;

  // Fetch developer's projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['/api/developers', developerId, 'projects'],
    queryFn: async () => {
      // Mock data since we don't have project endpoints yet
      return [
        {
          id: 1,
          name: 'Marina Residences',
          description: 'Luxury waterfront development with modern amenities',
          country: 'Portugal',
          region: 'Algarve',
          city: 'Lagos',
          address: 'Marina de Lagos',
          totalUnits: 35,
          availableUnits: 12,
          completionDate: '2025-06-01',
          images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'],
          features: ['marina_access', 'swimming_pool', 'gym', 'concierge'],
          isActive: true,
          createdAt: '2024-01-15T00:00:00Z',
        },
        {
          id: 2,
          name: 'Garden Towers',
          description: 'Sustainable living in the heart of the city',
          country: 'Spain',
          region: 'Catalonia',
          city: 'Barcelona',
          address: 'Eixample District',
          totalUnits: 60,
          availableUnits: 25,
          completionDate: '2025-12-01',
          images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'],
          features: ['green_building', 'rooftop_garden', 'solar_panels', 'smart_home'],
          isActive: true,
          createdAt: '2024-03-20T00:00:00Z',
        },
      ];
    },
  });

  // Calculate dashboard stats
  const stats = projects.reduce((acc, project) => {
    acc.totalProjects = projects.length;
    acc.activeProjects = projects.filter(p => p.isActive).length;
    acc.totalUnits += project.totalUnits;
    acc.soldUnits += (project.totalUnits - project.availableUnits);
    return acc;
  }, {
    totalProjects: 0,
    activeProjects: 0,
    totalUnits: 0,
    soldUnits: 0,
    totalRevenue: '€45.2M',
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: any) => {
      await apiRequest('POST', '/api/projects', {
        ...projectData,
        developerId,
      });
    },
    onSuccess: () => {
      toast({
        title: t('developer.projectCreated'),
        description: t('developer.projectCreatedSuccess'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/developers', developerId, 'projects'] });
      setNewProjectForm({
        name: '',
        description: '',
        country: '',
        region: '',
        city: '',
        address: '',
        totalUnits: 1,
        availableUnits: 1,
        completionDate: '',
        features: [],
      });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('developer.projectCreatedError'),
        variant: 'destructive',
      });
    },
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectForm.name || !newProjectForm.country) {
      toast({
        title: t('common.error'),
        description: t('developer.fillRequiredFields'),
        variant: 'destructive',
      });
      return;
    }
    createProjectMutation.mutate(newProjectForm);
  };

  const getCompletionStatus = (completionDate: string) => {
    const completion = new Date(completionDate);
    const now = new Date();
    const diffMonths = (completion.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (diffMonths < 0) return { text: t('developer.completed'), color: 'bg-green-600' };
    if (diffMonths < 6) return { text: t('developer.nearCompletion'), color: 'bg-orange-600' };
    return { text: t('developer.inProgress'), color: 'bg-blue-600' };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-luxury text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {t('developer.dashboard')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {t('developer.welcomeBack')}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="floating-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 luxury-gradient rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('developer.totalProjects')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalProjects}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="floating-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('developer.activeProjects')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.activeProjects}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="floating-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('developer.totalUnits')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalUnits}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="floating-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('developer.soldUnits')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.soldUnits}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="floating-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 luxury-gradient-gold rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('developer.totalRevenue')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalRevenue}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects" className="flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span>{t('developer.projects')}</span>
            </TabsTrigger>
            <TabsTrigger value="add-project" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>{t('developer.addProject')}</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>{t('developer.analytics')}</span>
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>{t('developer.subscription')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card className="luxury-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t('developer.myProjects')}</span>
                  <Button className="luxury-button">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('developer.newProject')}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {projectsLoading ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                        <CardContent className="p-4 space-y-3">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-12">
                    <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {t('developer.noProjects')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {t('developer.noProjectsDescription')}
                    </p>
                    <Button className="luxury-button">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('developer.createFirstProject')}
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {projects.map((project) => {
                      const completionStatus = getCompletionStatus(project.completionDate);
                      const soldPercentage = ((project.totalUnits - project.availableUnits) / project.totalUnits) * 100;
                      
                      return (
                        <Card key={project.id} className="floating-card group">
                          <div className="relative">
                            <img
                              src={project.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00"}
                              alt={project.name}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-2 left-2">
                              <Badge className={completionStatus.color}>
                                {completionStatus.text}
                              </Badge>
                            </div>
                            <div className="absolute top-2 right-2 flex space-x-1">
                              <Button variant="ghost" size="icon" className="bg-white/90 hover:bg-white">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="bg-white/90 hover:bg-white">
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                          
                          <CardContent className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-forest-600 dark:group-hover:text-forest-400 transition-colors">
                              {project.name}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                              <MapPin className="h-4 w-4" />
                              <span>{project.city}, {project.country}</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                              {project.description}
                            </p>
                            
                            {/* Units Status */}
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">{t('developer.unitsAvailable')}</span>
                                <span className="font-semibold">{project.availableUnits}/{project.totalUnits}</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-forest-600 h-2 rounded-full" 
                                  style={{ width: `${soldPercentage}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>{Math.round(soldPercentage)}% {t('developer.sold')}</span>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{new Date(project.completionDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>

                            {/* Features */}
                            <div className="mt-4 flex flex-wrap gap-1">
                              {project.features?.slice(0, 3).map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {feature.replace('_', ' ')}
                                </Badge>
                              ))}
                              {project.features?.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{project.features.length - 3} {t('common.more')}
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Project Tab */}
          <TabsContent value="add-project">
            <Card className="luxury-shadow">
              <CardHeader>
                <CardTitle>{t('developer.addNewProject')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateProject} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t('developer.projectName')} *
                      </label>
                      <Input
                        value={newProjectForm.name}
                        onChange={(e) => setNewProjectForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder={t('developer.projectNamePlaceholder')}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t('developer.completionDate')}
                      </label>
                      <Input
                        type="date"
                        value={newProjectForm.completionDate}
                        onChange={(e) => setNewProjectForm(prev => ({ ...prev, completionDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      {t('property.description')}
                    </label>
                    <Textarea
                      value={newProjectForm.description}
                      onChange={(e) => setNewProjectForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder={t('developer.projectDescriptionPlaceholder')}
                      rows={4}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t('search.country')} *
                      </label>
                      <Input
                        value={newProjectForm.country}
                        onChange={(e) => setNewProjectForm(prev => ({ ...prev, country: e.target.value }))}
                        placeholder={t('search.country')}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t('search.region')} *
                      </label>
                      <Input
                        value={newProjectForm.region}
                        onChange={(e) => setNewProjectForm(prev => ({ ...prev, region: e.target.value }))}
                        placeholder={t('search.region')}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t('search.city')} *
                      </label>
                      <Input
                        value={newProjectForm.city}
                        onChange={(e) => setNewProjectForm(prev => ({ ...prev, city: e.target.value }))}
                        placeholder={t('search.city')}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      {t('property.address')}
                    </label>
                    <Input
                      value={newProjectForm.address}
                      onChange={(e) => setNewProjectForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder={t('developer.addressPlaceholder')}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t('developer.totalUnits')}
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={newProjectForm.totalUnits}
                        onChange={(e) => setNewProjectForm(prev => ({ 
                          ...prev, 
                          totalUnits: parseInt(e.target.value) || 1,
                          availableUnits: parseInt(e.target.value) || 1 
                        }))}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t('developer.availableUnits')}
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max={newProjectForm.totalUnits}
                        value={newProjectForm.availableUnits}
                        onChange={(e) => setNewProjectForm(prev => ({ 
                          ...prev, 
                          availableUnits: Math.min(parseInt(e.target.value) || 0, prev.totalUnits)
                        }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline">
                      {t('common.cancel')}
                    </Button>
                    <Button 
                      type="submit" 
                      className="luxury-button"
                      disabled={createProjectMutation.isPending}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {createProjectMutation.isPending ? t('common.creating') : t('developer.createProject')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="luxury-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>{t('developer.salesPerformance')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-forest-50 dark:bg-forest-900/20 rounded-lg">
                      <span className="text-sm font-medium">{t('developer.thisQuarter')}</span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">+18%</span>
                    </div>
                    <div className="h-40 bg-gradient-to-r from-forest-100 to-gold-100 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-end space-x-1 p-4">
                      {[30, 45, 60, 85, 70, 90, 75, 95, 80, 88, 92, 100].map((height, i) => (
                        <div
                          key={i}
                          className="w-full bg-forest-500 rounded-t"
                          style={{ height: `${height}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="luxury-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>{t('developer.marketReach')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('developer.internationalBuyers')}</span>
                      <span className="font-semibold">76%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('developer.luxuryPortals')}</span>
                      <span className="font-semibold">25</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('developer.avgViewTime')}</span>
                      <span className="font-semibold">4.2 min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription">
            <Card className="luxury-shadow">
              <CardHeader>
                <CardTitle>{t('developer.currentPlan')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-forest-50 to-gold-50 dark:from-forest-900/20 dark:to-gold-900/20 rounded-lg">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Developer Pro</h3>
                    <p className="text-gray-600 dark:text-gray-400">{t('developer.premiumDeveloperPlan')}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-forest-600 dark:text-forest-400">€2,500/mo</div>
                    <Badge className="bg-green-600 text-white">{t('developer.activePlan')}</Badge>
                  </div>
                </div>
                
                <div className="mt-6 grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t('developer.planFeatures')}</h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <li>• {t('developer.unlimitedProjects')}</li>
                      <li>• {t('developer.globalDistribution')}</li>
                      <li>• {t('developer.luxuryPortalAccess')}</li>
                      <li>• {t('developer.dedicatedSupport')}</li>
                      <li>• {t('developer.customBranding')}</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t('developer.usage')}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t('developer.projectsUsed')}</span>
                        <span className="font-semibold">{projects.length}/∞</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{t('developer.unitsListed')}</span>
                        <span className="font-semibold">{stats.totalUnits}/∞</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex space-x-4">
                  <Button className="luxury-button">
                    {t('developer.manageBilling')}
                  </Button>
                  <Button variant="outline">
                    {t('developer.downloadInvoices')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
