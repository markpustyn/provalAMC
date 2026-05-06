'use client'

import { TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'

const chartData = [
  { month: 'January', completed: 42, open: 18 },
  { month: 'February', completed: 58, open: 24 },
  { month: 'March', completed: 66, open: 21 },
  { month: 'April', completed: 74, open: 16 },
  { month: 'May', completed: 91, open: 14 },
  { month: 'June', completed: 105, open: 11 }
]

const chartConfig = {
  completed: {
    label: 'Completed Reports',
    color: 'hsl(var(--chart-1))'
  },
  open: {
    label: 'Open Orders',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig

export function AreaGraph() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order & Report Activity</CardTitle>
        <CardDescription>
          Monthly property inspection and PCR report activity
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[310px] w-full'
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dot' />}
            />

            <Area
              dataKey='open'
              type='natural'
              fill='var(--color-open)'
              fillOpacity={0.4}
              stroke='var(--color-open)'
              stackId='a'
            />

            <Area
              dataKey='completed'
              type='natural'
              fill='var(--color-completed)'
              fillOpacity={0.4}
              stroke='var(--color-completed)'
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 font-medium leading-none'>
              Completed reports increased by 18% this quarter
              <TrendingUp className='h-4 w-4' />
            </div>

            <div className='flex items-center gap-2 leading-none text-muted-foreground'>
              January - June 2026
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}