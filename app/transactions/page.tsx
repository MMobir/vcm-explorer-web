'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SkeletonTable } from '@/components/ui/skeleton'
import { api, type Transaction } from '@/lib/api'
import { formatNumber, formatDate, cn } from '@/lib/utils'
import { ArrowUpDown, Calendar, Hash, TrendingUp, TrendingDown, Filter, X } from 'lucide-react'
import { motion } from 'framer-motion'

const registries = ['ALL', 'ACR', 'ART', 'CAR', 'GLD', 'VCS']
const transactionTypes = ['ALL', 'Issuance', 'Retirement', 'Cancellation']

function TransactionsContent() {
  const searchParams = useSearchParams()
  const projectIdFromUrl = searchParams.get('project_id')
  
  const [selectedRegistry, setSelectedRegistry] = useState('ALL')
  const [selectedType, setSelectedType] = useState('ALL')
  const [projectId, setProjectId] = useState(projectIdFromUrl || '')
  const [page, setPage] = useState(1)

  const params = {
    page,
    per_page: 50,
    ...(selectedRegistry !== 'ALL' && { registries: [selectedRegistry] }),
    ...(selectedType !== 'ALL' && { transaction_type: selectedType }),
    ...(projectId && { project_id: projectId }),
  }

  const { data, error, isLoading } = useSWR(
    ['transactions', params],
    () => api.transactions.list(params),
    { keepPreviousData: true }
  )

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Issuance':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'Retirement':
        return <TrendingDown className="h-4 w-4 text-blue-500" />
      case 'Cancellation':
        return <X className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getTransactionBadgeVariant = (type: string) => {
    switch (type) {
      case 'Issuance':
        return 'success'
      case 'Retirement':
        return 'info'
      case 'Cancellation':
        return 'destructive'
      default:
        return 'default'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-8 text-4xl font-bold">Carbon Credit Transactions</h1>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Project ID */}
            <div>
              <label className="block text-sm font-medium mb-2">Project ID</label>
              <input
                type="text"
                placeholder="Filter by project ID..."
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
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

            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Transaction Type</label>
              <div className="flex flex-wrap gap-2">
                {transactionTypes.map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <Card>
            <CardContent className="p-0">
              <SkeletonTable />
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-destructive">Error loading transactions. Please try again.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-muted-foreground">
                Found {data?.count || 0} transactions
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

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Project ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Type
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                        Vintage
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        User/Account
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data?.map((transaction: Transaction, index: number) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(transaction.transaction_date)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Link
                            href={`/projects/${transaction.project_id}`}
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            <Hash className="h-3 w-3" />
                            {transaction.project_id}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            {getTransactionIcon(transaction.transaction_type)}
                            <Badge variant={getTransactionBadgeVariant(transaction.transaction_type)}>
                              {transaction.transaction_type}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium">
                          {formatNumber(transaction.quantity)}
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          {transaction.vintage || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {transaction.retirement_account || transaction.registry_user || 'N/A'}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold">Carbon Credit Transactions</h1>
        <Card>
          <CardContent className="p-0">
            <SkeletonTable />
          </CardContent>
        </Card>
      </div>
    }>
      <TransactionsContent />
    </Suspense>
  )
}