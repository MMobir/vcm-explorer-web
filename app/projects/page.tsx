'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SkeletonCard } from '@/components/ui/skeleton'
import { api, type Project } from '@/lib/api'
import { formatNumber } from '@/lib/utils'
import { Search, Filter, ChevronRight, Globe, Leaf, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

const registries = ['ALL', 'ACR', 'ART', 'CAR', 'GLD', 'VCS']
const categories = ['ALL', 'FOREST', 'RENEWABLE ENERGY', 'GHG MANAGEMENT', 'ENERGY EFFICIENCY', 'FUEL SWITCHING', 'AGRICULTURE', 'OTHER']

export default function ProjectsPage() {
  const [selectedRegistry, setSelectedRegistry] = useState('ALL')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  const params = {
    page,
    per_page: 20,
    ...(selectedRegistry !== 'ALL' && { registries: [selectedRegistry] }),
    ...(selectedCategory !== 'ALL' && { categories: [selectedCategory] }),
    ...(searchQuery && { search: searchQuery }),
  }

  const { data, error, isLoading } = useSWR(
    ['projects', params],
    () => api.projects.list(params),
    { keepPreviousData: true }
  )

  const getBadgeVariant = (category: string) => {
    const variants: Record<string, any> = {
      'FOREST': 'success',
      'RENEWABLE ENERGY': 'info',
      'ENERGY EFFICIENCY': 'warning',
      'GHG MANAGEMENT': 'secondary',
    }
    return variants[category] || 'default'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-8 text-4xl font-bold">Carbon Offset Projects</h1>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Registry */}
            <div>
              <label className="block text-sm font-medium mb-2">Registry</label>
              <div className="flex flex-wrap gap-2">
                {registries.map((registry) => (
                  <Button
                    key={registry}
                    variant={selectedRegistry === registry ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedRegistry(registry)}
                  >
                    {registry}
                  </Button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-destructive">Error loading projects. Please try again.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-muted-foreground">
                Found {data?.count || 0} projects
              </p>
              {data?.total_pages && data.total_pages > 1 && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-3 text-sm">
                    Page {page} of {data.total_pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === data.total_pages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>

            <motion.div
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
            >
              {data?.data?.map((project: Project) => (
                <motion.div
                  key={project.project_id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <Link href={`/projects/${project.project_id}`}>
                    <Card className="h-full hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-lg line-clamp-1">
                              {project.name || project.project_id}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {project.country || 'Unknown'}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="shrink-0">
                            {project.registry}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Leaf className="h-4 w-4 text-muted-foreground" />
                            <Badge variant={getBadgeVariant(project.category)}>
                              {project.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {project.project_type}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                            <div>
                              <p className="text-xs text-muted-foreground">Issued</p>
                              <p className="font-semibold text-sm">
                                {formatNumber(project.credits_issued)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Retired</p>
                              <p className="font-semibold text-sm">
                                {formatNumber(project.credits_retired)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-end text-primary">
                          <span className="text-sm">View details</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  )
}
