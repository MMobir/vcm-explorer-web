'use client'

import { useParams } from 'next/navigation'
import useSWR from 'swr'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton, SkeletonTable } from '@/components/ui/skeleton'
import { api, type Project, type Transaction } from '@/lib/api'
import { formatNumber, formatDate } from '@/lib/utils'
import { ArrowLeft, Calendar, Globe, Hash, Leaf, TrendingUp, TrendingDown, FileText, Building } from 'lucide-react'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string

  const { data: projectData, error: projectError, isLoading: projectLoading } = useSWR(
    ['project', projectId],
    () => api.projects.get(projectId)
  )

  const { data: transactionsData, error: transactionsError, isLoading: transactionsLoading } = useSWR(
    ['transactions', projectId],
    () => api.transactions.byProject(projectId, { per_page: 100 })
  )

  const project = projectData?.data

  // Process transactions for charts
  const chartData = transactionsData?.data?.reduce((acc: any[], transaction: Transaction) => {
    const year = new Date(transaction.transaction_date).getFullYear()
    const existing = acc.find(item => item.year === year)
    
    if (existing) {
      if (transaction.transaction_type === 'Issuance') {
        existing.issued += transaction.quantity
      } else if (transaction.transaction_type === 'Retirement') {
        existing.retired += transaction.quantity
      }
    } else {
      acc.push({
        year,
        issued: transaction.transaction_type === 'Issuance' ? transaction.quantity : 0,
        retired: transaction.transaction_type === 'Retirement' ? transaction.quantity : 0,
      })
    }
    
    return acc
  }, []).sort((a, b) => a.year - b.year) || []

  if (projectLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (projectError || !project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-destructive">Error loading project details. Please try again.</p>
            <Link href="/projects">
              <Button variant="outline" className="mt-4">
                Back to Projects
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/projects">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {project.name || project.project_id}
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Badge variant="outline" className="text-base">
              {project.registry}
            </Badge>
            <span className="flex items-center gap-1">
              <Hash className="h-4 w-4" />
              {project.project_id}
            </span>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Country
              </CardDescription>
              <CardTitle className="text-xl">{project.country || 'Unknown'}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Status</CardDescription>
              <CardTitle className="text-xl">
                <Badge variant={project.status === 'Registered' ? 'success' : 'default'}>
                  {project.status}
                </Badge>
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Credits Issued</CardDescription>
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                {formatNumber(project.credits_issued)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Credits Retired</CardDescription>
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-blue-500" />
                {formatNumber(project.credits_retired)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Details */}
        <div className="grid gap-8 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Category</p>
                    <Badge variant="secondary" className="text-sm">
                      <Leaf className="mr-1 h-3 w-3" />
                      {project.category}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Project Type</p>
                    <p className="font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {project.project_type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Protocol</p>
                    <p className="font-medium">{project.protocol || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Compliance</p>
                    <Badge variant={project.is_compliance ? 'default' : 'outline'}>
                      {project.is_compliance ? 'Compliance' : 'Voluntary'}
                    </Badge>
                  </div>
                </div>
                {project.proponent && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Proponent</p>
                    <p className="font-medium flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {project.proponent}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Charts */}
            {chartData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Credits Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis tickFormatter={(value) => formatNumber(value)} />
                        <Tooltip formatter={(value: number) => formatNumber(value)} />
                        <Line 
                          type="monotone" 
                          dataKey="issued" 
                          stroke="hsl(var(--primary))" 
                          name="Issued"
                          strokeWidth={2}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="retired" 
                          stroke="hsl(var(--secondary))" 
                          name="Retired"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Timeline */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {transactionsLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactionsData?.data?.slice(0, 5).map((transaction: Transaction, index: number) => (
                      <div key={index} className="border-l-2 border-muted pl-4 pb-4 last:pb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant={transaction.transaction_type === 'Issuance' ? 'success' : 'info'}
                            className="text-xs"
                          >
                            {transaction.transaction_type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(transaction.transaction_date)}
                          </span>
                        </div>
                        <p className="text-sm font-medium">
                          {formatNumber(transaction.quantity)} credits
                        </p>
                        {transaction.vintage && (
                          <p className="text-xs text-muted-foreground">
                            Vintage {transaction.vintage}
                          </p>
                        )}
                      </div>
                    ))}
                    <Link href={`/transactions?project_id=${projectId}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View All Transactions
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
