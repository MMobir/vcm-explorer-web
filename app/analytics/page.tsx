'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { formatNumber } from '@/lib/utils'
import { BarChart3, TrendingUp, Globe, PieChart, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import { BarChart, Bar, PieChart as RePieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

export default function AnalyticsPage() {
  const [selectedRegistry, setSelectedRegistry] = useState('ALL')
  
  const { data: projectsData, isLoading: projectsLoading } = useSWR(
    ['analytics-projects'],
    () => api.projects.list({ per_page: 1000 })
  )
  
  const { data: creditsData, isLoading: creditsLoading } = useSWR(
    ['analytics-credits'],
    () => api.charts.creditsOverTime()
  )

  // Process data for charts
  const projectsByCategory = projectsData?.data?.reduce((acc: any[], project: any) => {
    const existing = acc.find(item => item.name === project.category)
    if (existing) {
      existing.value += 1
    } else {
      acc.push({ name: project.category, value: 1 })
    }
    return acc
  }, []).sort((a, b) => b.value - a.value) || []

  const projectsByRegistry = projectsData?.data?.reduce((acc: any[], project: any) => {
    const existing = acc.find(item => item.name === project.registry)
    if (existing) {
      existing.issued += project.credits_issued
      existing.retired += project.credits_retired
    } else {
      acc.push({
        name: project.registry,
        issued: project.credits_issued,
        retired: project.credits_retired
      })
    }
    return acc
  }, []) || []

  const projectsByCountry = projectsData?.data?.reduce((acc: any[], project: any) => {
    const existing = acc.find(item => item.name === project.country)
    if (existing) {
      existing.value += 1
    } else {
      acc.push({ name: project.country, value: 1 })
    }
    return acc
  }, []).sort((a, b) => b.value - a.value).slice(0, 10) || []

  const totalStats = projectsData?.data?.reduce((acc: any, project: any) => {
    acc.totalProjects += 1
    acc.totalIssued += project.credits_issued
    acc.totalRetired += project.credits_retired
    acc.countries.add(project.country)
    return acc
  }, { totalProjects: 0, totalIssued: 0, totalRetired: 0, countries: new Set() }) || 
  { totalProjects: 0, totalIssued: 0, totalRetired: 0, countries: new Set() }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-8 text-4xl font-bold">Market Analytics</h1>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projectsLoading ? <Skeleton className="h-8 w-20" /> : formatNumber(totalStats.totalProjects)}
              </div>
              <p className="text-xs text-muted-foreground">Across all registries</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credits Issued</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projectsLoading ? <Skeleton className="h-8 w-20" /> : formatNumber(totalStats.totalIssued)}
              </div>
              <p className="text-xs text-muted-foreground">Total volume</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credits Retired</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projectsLoading ? <Skeleton className="h-8 w-20" /> : formatNumber(totalStats.totalRetired)}
              </div>
              <p className="text-xs text-muted-foreground">Permanent removals</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Countries</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projectsLoading ? <Skeleton className="h-8 w-20" /> : totalStats.countries.size}
              </div>
              <p className="text-xs text-muted-foreground">Global coverage</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-8 lg:grid-cols-2 mb-8">
          {/* Projects by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Projects by Category</CardTitle>
              <CardDescription>Distribution of project types</CardDescription>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <Skeleton className="h-64" />
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={projectsByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {projectsByCategory.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Credits by Registry */}
          <Card>
            <CardHeader>
              <CardTitle>Credits by Registry</CardTitle>
              <CardDescription>Issued vs Retired</CardDescription>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <Skeleton className="h-64" />
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projectsByRegistry}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => formatNumber(value)} />
                      <Tooltip formatter={(value: number) => formatNumber(value)} />
                      <Legend />
                      <Bar dataKey="issued" fill="#3b82f6" name="Issued" />
                      <Bar dataKey="retired" fill="#10b981" name="Retired" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Countries */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Top Countries by Project Count</CardTitle>
              <CardDescription>Leading countries in carbon offset projects</CardDescription>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <Skeleton className="h-64" />
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projectsByCountry} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
