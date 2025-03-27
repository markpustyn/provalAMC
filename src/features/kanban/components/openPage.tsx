import { Heading } from '@/components/ui/heading';
import { DataTable } from './table/data-table';
import { columns } from './table/column';
import { db } from '@/db/drizzle';
import {  users } from '@/db/schema';
import { AuthCredentials, OpenOrder } from 'types';





export default async function KanbanViewPage() {

  const vendors = (await db.select().from(users)) as AuthCredentials[]
  const totalProducts = vendors.length
  console.log(totalProducts)


  return (
    <div>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title={`Open Orders`} description='Manage tasks by dnd' />
        </div>
        <DataTable columns={columns} data={vendors}/>
      </div>
    </div>
  );
}
