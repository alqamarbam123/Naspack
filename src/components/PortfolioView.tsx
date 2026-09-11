import React, { useState } from 'react';
import { Project, ProjectCategory } from '../types';
import { PROJECTS_DATA } from '../data/projectsData';
import { 
  Search, 
  Filter, 
  Layers, 
  Camera, 
  ArrowRight, 
  Sparkles,
  MapPin,
  Check,
  Edit3,
  Plus
} from 'lucide-react';

interface PortfolioViewProps {
  projects?: Project[];
  isAdmin?: boolean;
  onOpenProject: (project: Project) => void;
  onRequestQuote: () => void;
  onEditProject?: (project: Project) => void;
  onAddNewProject?: () => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  projects = PROJECTS_DATA,
  isAdmin = false,
  onOpenProject,
  onRequestQuote,
  onEditProject,
  onAddNewProject
}) => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: ProjectCategory; label: string }[] = [
    { id: 'all', label: 'All Projects' },
    { id: 'luxury', label: 'Luxury & Oud Boxes' },
    { id: 'food', label: 'Food & Hospitality' },
    { id: 'cosmetics', label: 'Cosmetics & Skincare' },
    { id: 'eco', label: 'Sustainable Kraft' },
    { id: 'co-packing', label: 'Co-Packaging Lines' },
    { id: 'retail', label: 'Retail & Fashion' }
  ];

  const dataSource = projects && projects.length > 0 ? projects : PROJECTS_DATA;

  const filteredProjects = dataSource.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.finishDetails.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-12 transition-colors">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Camera className="w-3.5 h-3.5" />
              <span>Creative Design & Commercial Photography Showcase</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
              Packaging design portfolio & visual aesthetics.
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Every piece engineered in our Doha facility reflects calibrated structural integrity, tactile paper craftsmanship, and bespoke finishings. Explore our signature client work below.
            </p>
          </div>

          {isAdmin && onAddNewProject && (
            <button
              onClick={onAddNewProject}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product Design</span>
            </button>
          )}
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-sm'
                      : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by finish, foil, material..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => onOpenProject(project)}
                className="group cursor-pointer bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:border-amber-500/50 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Visual Image container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={project.primaryImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-black/70 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md">
                      {project.category}
                    </span>
                  </div>

                  {isAdmin && onEditProject && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditProject(project);
                      }}
                      className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-neutral-950 text-[11px] font-bold flex items-center gap-1 shadow-md z-10 cursor-pointer"
                      title="Edit Product Design"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg opacity-90">
                    <span className="flex items-center gap-1">
                      <Camera className="w-3 h-3 text-amber-400" />
                      {project.galleryImages.length} Perspectives
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                      Inspect Specs <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                      <span>{project.client}</span>
                      <span>{project.location}</span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-neutral-950 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 space-y-2">
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      <strong className="text-neutral-800 dark:text-neutral-200">Finishing: </strong>
                      {project.finishDetails.length > 50 ? `${project.finishDetails.slice(0, 50)}...` : project.finishDetails}
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8">
            <Layers className="w-10 h-10 text-neutral-400 mx-auto" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              No matching packaging projects found
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Try adjusting your search query or select another category filter.
            </p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Custom Die-Line Banner */}
        <div className="rounded-2xl p-8 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-heading text-xl font-bold text-neutral-950 dark:text-white">
              Have a unique custom product shape or packaging requirement?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl">
              Our packaging engineers in Doha create tailored CAD die-lines with physical unprinted mockups within 48 hours.
            </p>
          </div>

          <button
            onClick={onRequestQuote}
            className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-sm shrink-0 cursor-pointer"
          >
            Request Custom Die-Line Engineering
          </button>
        </div>
      </div>
    </div>
  );
};
