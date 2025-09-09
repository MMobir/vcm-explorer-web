'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, BarChart3, Database, Globe, Search, Shield, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container relative mx-auto px-4">
          <motion.div 
            className="mx-auto max-w-4xl text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="gradient-text">Explore the Voluntary Carbon Market</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Professional carbon offset project and credit database for market intelligence. 
              Comprehensive data from major offset registries with advanced filtering and analysis tools.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/projects">
                <Button size="lg" variant="gradient" className="group">
                  Explore Projects
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/transactions">
                <Button size="lg" variant="outline">
                  View Transactions
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid gap-8 md:grid-cols-3"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            <motion.div variants={fadeIn}>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Database className="mx-auto h-12 w-12 text-primary" />
                  <CardTitle className="text-3xl font-bold">10,000+</CardTitle>
                  <CardDescription>Carbon Projects</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
            <motion.div variants={fadeIn}>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <TrendingUp className="mx-auto h-12 w-12 text-secondary" />
                  <CardTitle className="text-3xl font-bold">2.5B</CardTitle>
                  <CardDescription>Credits Issued</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
            <motion.div variants={fadeIn}>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Globe className="mx-auto h-12 w-12 text-accent" />
                  <CardTitle className="text-3xl font-bold">150+</CardTitle>
                  <CardDescription>Countries</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="mx-auto max-w-2xl text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Powerful Features for Market Intelligence
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to analyze the voluntary carbon market
            </p>
          </motion.div>

          <motion.div 
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            <motion.div variants={fadeIn}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Search className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Advanced Search</CardTitle>
                  <CardDescription>
                    Filter by registry, category, project type, country, and more
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
            <motion.div variants={fadeIn}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-secondary mb-2" />
                  <CardTitle>Real-time Analytics</CardTitle>
                  <CardDescription>
                    Interactive charts and visualizations of market trends
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
            <motion.div variants={fadeIn}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Shield className="h-10 w-10 text-accent mb-2" />
                  <CardTitle>Verified Data</CardTitle>
                  <CardDescription>
                    Data sourced directly from major carbon credit registries
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to dive in?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Start exploring carbon credit projects and transactions today
            </p>
            <Link href="/projects">
              <Button size="lg" variant="gradient" className="group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.03'%3E%3Cpath d='M0 0h20v20H0zm20 20h20v20H20z'/%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  )
}