import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { SampleOrder } from '@/constants';
import { DataTable } from './table/data-table';
import { columns } from './table/column';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';





export default async function KanbanViewPage() {
  const results = await db.select().from(users)
  // console.log(JSON.stringify(results))
  return (
    <div>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title={`Open Orders`} description='Manage tasks by dnd' />
        </div>
        <DataTable columns={columns} data={SampleOrder}/>
      </div>
    </div>
  );
}
